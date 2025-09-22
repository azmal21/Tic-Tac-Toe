// src/pages/FriendGame.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import Board from "../components/Board";
import InfoPanel from "../components/InfoPanel";
import "../styles/FriendGame.css";

export default function FriendGame() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    boardSize: initialBoardSize = 3,
    winLength: initialWinLength = 3,
    name = "Player",
    isHost = false,
  } = location.state || {};

  // Game state
  const [boardSize, setBoardSize] = useState(initialBoardSize);
  const [winLength, setWinLength] = useState(initialWinLength);
  const [board, setBoard] = useState(Array(initialBoardSize * initialBoardSize).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [playerMark, setPlayerMark] = useState(null);
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [matchWinner, setMatchWinner] = useState(null);
  const [showNextRoundButton, setShowNextRoundButton] = useState(false);

  const totalRounds = 3;
  const targetWins = 2; // Best of 3

  useEffect(() => {
    // Connect socket once
    socket.connect();

    // Create or join room
    if (isHost) {
      socket.emit("createRoom", { roomId, boardSize, winLength, name });
    } else {
      socket.emit("joinRoom", { roomId, name });
    }

    // Event listeners
    socket.on("errorMessage", (msg) => {
      alert(msg);
      navigate("/", { replace: true });
    });

    socket.on("startGame", (room) => {
      setBoardSize(room.boardSize);
      setWinLength(room.winLength);
      setBoard(room.board || Array(room.boardSize * room.boardSize).fill(null));
      setCurrentPlayer(room.currentPlayer);
      setPlayers(room.players);

      const self = room.players.find((p) => p.id === socket.id);
      if (self) setPlayerMark(self.mark);
    });

    socket.on("roomUpdate", (room) => {
      setBoard(room.board);
      setCurrentPlayer(room.currentPlayer);
      setPlayers(room.players);
    });

    socket.on("roundOver", ({ winner: roundWinner, board: newBoard, score: newScore }) => {
      setBoard(newBoard);
      setWinner(roundWinner);
      setScore(newScore);
      setShowNextRoundButton(true);
    });

    socket.on("matchOver", ({ matchWinner: finalWinner, score: finalScore, players: finalPlayers }) => {
      setMatchWinner(finalWinner);
      setScore(finalScore);
      setShowNextRoundButton(false);

      setTimeout(() => {
        navigate("/result", {
          state: {
            matchWinner: finalWinner,
            score: finalScore,
            mode: "friend",
            players: finalPlayers,
            gameUrl: window.location.href,
          },
        });
      }, 500);
    });

    socket.on("roundStarted", (room) => {
      setBoard(room.board);
      setWinner(null);
      setCurrentPlayer(room.currentPlayer);
      setRound(room.round);
      setShowNextRoundButton(false);
    });

    socket.on("playerLeft", ({ reason }) => {
      alert("Opponent left: " + reason);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [roomId, isHost, name, navigate]);

  // Handle player move
  const handleCellClick = (index) => {
    if (winner || matchWinner) return;
    if (playerMark !== currentPlayer) return;
    if (board[index]) return;

    socket.emit("makeMove", { roomId, index });
  };

  // Handle next round
  const handleNextRound = () => {
    socket.emit("nextRound", { roomId });
  };

  return (
    <div className="friendgame-container">
      <h1 className="friendgame-title">Friend Game — Room {roomId}</h1>
      <p className="friendgame-info">Match: First to {targetWins} wins (Best of {totalRounds})</p>
      <p className="friendgame-info">Round {round} / {totalRounds}</p>

      <div className="friendgame-scores">
        {players.map((p) => (
          <span key={p.id} style={{ marginRight: "10px" }}>
            {p.name} ({p.mark}): {score[p.mark]}
          </span>
        ))}
      </div>

      <InfoPanel
        currentPlayer={currentPlayer}
        winner={winner || matchWinner}
        onReset={() => socket.emit("resetMatch", { roomId })}
        showDifficulty={false}
      />

      <Board
        board={board}
        onCellClick={handleCellClick}
        boardSize={boardSize}
        disabled={!!winner || !!matchWinner}
      />

      {showNextRoundButton && !matchWinner && (
        <button className="next-round-btn" onClick={handleNextRound}>
          Next Round
        </button>
      )}
    </div>
  );
}

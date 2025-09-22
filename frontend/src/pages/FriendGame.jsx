// src/pages/FriendGame.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Board from "../components/Board";
import InfoPanel from "../components/InfoPanel";
import "../styles/FriendGame.css";

const SERVER = "https://tic-tac-toe-eulu.onrender.com";

export default function FriendGame() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { boardSize: initialBoardSize = 3, winLength: initialWinLength = 3, name = "Player", isHost = false } =
    location.state || {};

  const socketRef = useRef(null);

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
  const targetWins = 2; // Best of 3\

  useEffect(() => {
    const socket = io(SERVER, { transports: ["websocket"] });
    socketRef.current = socket;

    // Create or join room
    if (isHost) {
      socket.emit("createRoom", { roomId, boardSize, winLength, name });
    } else {
      socket.emit("joinRoom", { roomId, name });
    }

    // Error handling
    socket.on("errorMessage", (msg) => {
      alert(msg);
      navigate("/", { replace: true });
    });

    // Start game
    socket.on("startGame", (room) => {
      setBoardSize(room.boardSize);
      setWinLength(room.winLength);
      setBoard(room.board || Array(room.boardSize * room.boardSize).fill(null));
      setCurrentPlayer(room.currentPlayer);
      setPlayers(room.players);

      const self = room.players.find((p) => p.id === socket.id);
      if (self) setPlayerMark(self.mark);
    });

    // Update room after each move
    socket.on("roomUpdate", (room) => {
      setBoard(room.board);
      setCurrentPlayer(room.currentPlayer);
      setPlayers(room.players);
    });

    // Round over
    socket.on("roundOver", ({ winner: roundWinner, board: newBoard, score: newScore }) => {
      setBoard(newBoard);
      setWinner(roundWinner);
      setScore(newScore);
      setShowNextRoundButton(true);
    });

    // Match over
    // Match over
    socket.on("matchOver", ({ matchWinner: finalWinner, score: finalScore }) => {
      setMatchWinner(finalWinner);
      setScore(finalScore);
      setShowNextRoundButton(false);

      setTimeout(() => {
        navigate("/result", {
          state: {
            matchWinner: finalWinner,
            score: finalScore,
            mode: "friend",        // indicate friend mode
            players: players,
            gameUrl: window.location.href
          }
        });
      }, 500);
    });


    // Start next round
    socket.on("roundStarted", (room) => {
      setBoard(room.board);
      setWinner(null); // ✅ Reset winner for new round
      setCurrentPlayer(room.currentPlayer);
      setRound(room.round);
      setShowNextRoundButton(false);
    });

    // Opponent left
    socket.on("playerLeft", ({ reason }) => {
      alert("Opponent left: " + reason);
    });

    return () => socket.disconnect();
  }, [roomId, isHost, name, navigate]);

  const handleCellClick = (index) => {
    if (!socketRef.current || winner || matchWinner) return;
    if (playerMark !== currentPlayer) return;
    if (board[index]) return;

    socketRef.current.emit("makeMove", { roomId, index });
  };

  const handleNextRound = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("nextRound", { roomId });
  };

  return (
    <div className="friendgame-container">
      <h1 className="friendgame-title">Friend Game — Room {roomId}</h1>

      <p className="friendgame-info">
        Match: First to {targetWins} wins (Best of {totalRounds})
      </p>
      <p className="friendgame-info">
        Round {round} / {totalRounds}
      </p>

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
        onReset={() => socketRef.current.emit("resetMatch", { roomId })}
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


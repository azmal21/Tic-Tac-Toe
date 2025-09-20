// src/pages/LocalGame.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Board from "../components/Board";
import InfoPanel from "../components/InfoPanel";
import { checkWinner } from "../utils/checkWinner";
import "../styles/LocalGame.css";

export default function LocalGame() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get settings from previous page
  const { boardSize, winLength } = location.state || { boardSize: 3, winLength: 3 };

  // Game state
  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);

  // Match state
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [matchWinner, setMatchWinner] = useState(null);
  const [round, setRound] = useState(1);

  const totalRounds = 3;
  const targetWins = 2;

  // Reset only the board
  const resetBoard = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  };

  // Reset full match
  const resetMatch = () => {
    setScore({ X: 0, O: 0 });
    setMatchWinner(null);
    setRound(1);
    resetBoard();
  };

  // Handle a move
  const handleCellClick = (index) => {
    if (board[index] || winner || matchWinner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard, winLength);

    if (result) {
      setWinner(result.winner);

      if (result.winner === "tie") {
        // If it's a draw round
        if (round < totalRounds) {
          setTimeout(() => {
            setRound((prev) => prev + 1);
            resetBoard();
          }, 1000);
        } else {
          // last round is a draw → decide final result
          if (score.X === score.O) {
            setMatchWinner("draw");
          } else if (score.X > score.O) {
            setMatchWinner("X");
          } else {
            setMatchWinner("O");
          }
        }
      } else {
        // Someone won this round
        setScore((prev) => {
          const updated = { ...prev, [result.winner]: prev[result.winner] + 1 };

          if (updated[result.winner] >= targetWins) {
            setMatchWinner(result.winner); // early win
          } else if (round === totalRounds) {
            // last round finished → decide match result
            if (updated.X === updated.O) {
              setMatchWinner("draw");
            } else if (updated.X > updated.O) {
              setMatchWinner("X");
            } else {
              setMatchWinner("O");
            }
          }
          return updated;
        });
      }
    } else {
      // Switch player
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };


  // Next round button (only for wins, not draws)
  const handleNextRound = () => {
    if (round < totalRounds) {
      setRound((prev) => prev + 1);
      resetBoard();
    } else {
      setMatchWinner("draw");
    }
  };

  // Navigate to result page when match ends
  useEffect(() => {
    if (matchWinner !== null) {
      navigate("/result", {
        state: { matchWinner, score },
      });
    }
  }, [matchWinner, score, navigate]);

  return (
    <div className="localgame-container">
      <h1 className="localgame-title">Local Game</h1>

      <p className="localgame-info">
        Match: First to {targetWins} wins (Best of {totalRounds})
      </p>
      <p className="localgame-info">Round {round} / {totalRounds}</p>
      <p className="localgame-score">
        Score — <span className="score-x">X: {score.X}</span> |{" "}
        <span className="score-o">O: {score.O}</span>
      </p>

      <InfoPanel
        currentPlayer={currentPlayer}
        winner={winner || matchWinner}
        onReset={resetMatch}
        className="localgame-infopanel"
      />

      <Board
        board={board}
        onCellClick={handleCellClick}
        boardSize={boardSize}
        disabled={!!winner || !!matchWinner}
        className="localgame-board"
      />

      <div className="localgame-actions">
        {winner && winner !== "draw" && !matchWinner && round < totalRounds && (
          <button className="next-round-btn" onClick={handleNextRound}>
            Next Round
          </button>
        )}
      </div>
    </div>
  );
}
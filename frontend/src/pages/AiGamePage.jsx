import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Board from "../components/Board";
import InfoPanel from "../components/InfoPanel";
import { checkWinner } from "../utils/checkWinner";
import { aiMoveEasy, aiMoveMedium, aiMoveHard } from "../utils/aiLogic";
import "../styles/AiGamePage.css";

// Helper to read query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AiGamePage = () => {
  const { mode } = useParams(); // "ai" or "local"
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const boardSize = Number(query.get("boardSize")) || 3;
  const alignToWin = Number(query.get("align")) || 3;
  const difficulty = query.get("difficulty") || "easy";

  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]); // ✅ Track winning cells
  const [score, setScore] = useState({ X: 0, O: 0 });

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard, alignToWin);

    if (result) {
      if (result.winner === "tie") {
        setWinner("tie");
      } else {
        setWinner(result.winner);
        setWinningCells(result.winningCells || []);
        setScore((prev) => ({
          ...prev,
          [result.winner]: prev[result.winner] + 1,
        }));
      }
      return;
    }



    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  // AI move effect
  useEffect(() => {
    if (mode === "ai" && currentPlayer === "O" && !winner) {
      const aiTimer = setTimeout(() => {
        let move = null;

        if (difficulty === "easy") {
          move = aiMoveEasy(board);
        } else if (difficulty === "medium") {
          move = aiMoveMedium(board, alignToWin, "O", "X");
        } else if (difficulty === "hard") {
          move = aiMoveHard(board, alignToWin, "O", "X");
        }

        if (move !== null) {
          const newBoard = [...board];
          newBoard[move] = "O";
          setBoard(newBoard);

          const result = checkWinner(newBoard, alignToWin);

          if (result) {
            if (result.winner) {
              console.log("Winner detected (AI):", result.winner);
              setWinner(result.winner);
              setWinningCells(result.winningCells || []);
              setScore((prev) => ({
                ...prev,
                [result.winner]: prev[result.winner] + 1,
              }));
            } else if (result === "tie") {
              console.log("Game tied after AI move!");
              setWinner("tie");
            }
            return;
          }
          setCurrentPlayer("X");
        }
      }, 1000);

      return () => clearTimeout(aiTimer);
    }
  }, [board, currentPlayer, winner, mode, difficulty, alignToWin]);

  // Navigate to result page if game is over
  useEffect(() => {
    if (winner) {
      console.log("Redirecting to /result with state:", {
        matchWinner: winner === "tie" ? "draw" : winner,
        score: score,
        mode: mode,
        previousUrl: `${location.pathname}${location.search}`,
      });

      navigate("/result", {
        state: {
          matchWinner: winner === "tie" ? "draw" : winner, // normalize
          score: score,
          mode: mode,
          previousUrl: `${location.pathname}${location.search}`,
        },
      });
    }
  }, [winner, score, navigate, location, mode]);

  const handleReset = () => {
    console.log("Game reset!");
    setBoard(Array(boardSize * boardSize).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
    setWinningCells([]);
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h1>{mode === "ai" ? `Play vs AI (${difficulty})` : "Local Multiplayer"}</h1>
      <InfoPanel
        currentPlayer={currentPlayer}
        winner={winner}
        difficulty={difficulty}
      />
      <Board
        board={board}
        onCellClick={handleClick}
        boardSize={boardSize}
        disabled={winner || (mode === "ai" && currentPlayer === "O")}
        winningCells={winningCells}
      />
      <button className="reset-btn"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
};

export default AiGamePage;

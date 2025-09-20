import "../styles/Result.css";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Winner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { matchWinner, score, mode, previousUrl, players, gameUrl } =
    location.state || {
      matchWinner: "draw",
      score: { X: 0, O: 0 },
      players: [],
    };

  const handlePlayGame = () => {
    if (mode === "ai") {
      navigate(previousUrl);
    } else if (mode === "friend") {
      navigate("/lobby");
    } else {
      navigate("/local-game");
    }
  };

  // Find winner name if friend mode
  const winnerName =
    mode === "friend" && matchWinner !== "draw"
      ? players.find((p) => p.mark === matchWinner)?.name || matchWinner
      : matchWinner;

  return (
    <motion.div
      className="winner-container"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
      }}
    >
      <div className="winner-card">
        <h1>Match Result</h1>

        {/* Show result */}
        {matchWinner === "draw" ? (
          <h2>
            {mode === "friend" && players.length === 2
              ? `${players[0].name} and ${players[1].name} drew the game!`
              : "The game ended in a draw"}
          </h2>
        ) : (
          <h2
            style={{
              color: matchWinner === "X" ? "#e63946" : "#1d9bf0",
              textShadow:
                matchWinner === "X"
                  ? "0 0 8px #e63946, 0 0 16px #ff1418"
                  : "0 0 8px #1d9bf0, 0 0 16px #7aa2ff",
            }}
          >
            {mode === "friend"
              ? `${winnerName} wins the match!`
              : `Player ${matchWinner} wins the match!`}
          </h2>
        )}

        {/* Show score */}
        {mode !== "ai" && (
          <div>
            <p>Final Score</p>
            {mode === "friend" && players.length > 0 ? (
              players.map((p) => (
                <p key={p.id}>
                  {p.name} ({p.mark}): {score[p.mark]}
                </p>
              ))
            ) : (
              <p>
                X: {score.X} | O: {score.O}
              </p>
            )}
          </div>
        )}

        {/* Play again button */}
        <button onClick={handlePlayGame}>Play Again</button>
      </div>
    </motion.div>
  );
}

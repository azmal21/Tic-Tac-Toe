import "../styles/InfoPanel.css"

const InfoPanel = ({ currentPlayer, winner, difficulty, showDifficulty = true }) => {
  return (
    <div>
      <h2 className="title1">
        {winner
          ? winner === "draw"
            ? "Draw!"
            : `${winner} wins!`
          : `Current: ${currentPlayer}`}
      </h2>

      {/* Difficulty only shows if explicitly allowed */}
      {showDifficulty && difficulty && <p className="difficulty-para">Difficulty: {difficulty}</p>}

      
    </div>
  );
};

export default InfoPanel;

import React from "react";
import GlowingMark from "../pages/GlowingMark";

const Cell = ({ 
  value, 
  onClick, 
  disabled, 
  index, 
  boardSize, 
  cellSize = 80, 
  glowSize = 60,
  isWinningCell = false 
}) => {
  const row = Math.floor(index / boardSize);
  const col = index % boardSize;
  
  // Determine which borders should be visible
  const showTop = row > 0;
  const showLeft = col > 0;
  
  // Create border glow intensity based on winning state
  const borderGlowIntensity = isWinningCell ? 'winning' : 'normal';

  return (
    <div
      onClick={disabled || value ? null : onClick}
      className={`cell cell-${row}-${col} ${borderGlowIntensity}`}
      data-show-top={showTop}
      data-show-left={showLeft}
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled || value ? "not-allowed" : "pointer",
        background: "#0c0b0b",
        position: "relative",
      }}
    >
      {value && <GlowingMark type={value} size={glowSize} active />}
    </div>
  );
};

export default Cell;
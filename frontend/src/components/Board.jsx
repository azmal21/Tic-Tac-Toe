import React, { useEffect } from "react";
import Cell from "./Cell";

const Board = ({ board, onCellClick, boardSize, disabled, winningCells = [] }) => {
  // Set CSS custom property for board size
  useEffect(() => {
    document.documentElement.style.setProperty('--board-size', boardSize);
  }, [boardSize]);

  // Calculate cell size based on screen width and board size
  const getCellSize = () => {
    const screenWidth = window.innerWidth;
        
    if (screenWidth <= 375) {
      return 55; // Very small screens
    } else if (screenWidth <= 480) {
      return 60; // Small screens
    } else if (screenWidth <= 768) {
      return 70; // Mobile tablets
    } else {
      return 80; // Desktop
    }
  };

  const cellSize = getCellSize();
  const glowSize = cellSize * 0.75; // Proportional glow mark size

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
      }}
    >
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => onCellClick(index)}
          disabled={disabled}
          index={index}
          boardSize={boardSize}
          cellSize={cellSize}
          glowSize={glowSize}
          isWinningCell={winningCells.includes(index)}
        />
      ))}
    </div>
  );
};

export default Board;
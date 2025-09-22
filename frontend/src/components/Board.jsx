import React, { useEffect, useState } from "react";
import Cell from "./Cell";

const Board = ({ board, onCellClick, boardSize, disabled, winningCells = [] }) => {
  const [cellSize, setCellSize] = useState(80); // default

  useEffect(() => {
    const calculateCellSize = () => {
      const screenWidth = window.innerWidth;
      let size;
      if (screenWidth <= 375) size = 55;
      else if (screenWidth <= 480) size = 60;
      else if (screenWidth <= 768) size = 70;
      else size = 80;
      setCellSize(size);
    };

    calculateCellSize();
    window.addEventListener("resize", calculateCellSize);

    return () => window.removeEventListener("resize", calculateCellSize);
  }, []);

  const glowSize = cellSize * 0.75;

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

export const checkWinner = (board, alignToWin) => {
  const size = Math.sqrt(board.length);
  const lines = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - alignToWin; c++) {
      lines.push([...Array(alignToWin)].map((_, k) => r * size + c + k));
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - alignToWin; r++) {
      lines.push([...Array(alignToWin)].map((_, k) => (r + k) * size + c));
    }
  }

  // Diagonals TL → BR
  for (let r = 0; r <= size - alignToWin; r++) {
    for (let c = 0; c <= size - alignToWin; c++) {
      lines.push([...Array(alignToWin)].map((_, k) => (r + k) * size + (c + k)));
    }
  }

  // Diagonals TR → BL
  for (let r = 0; r <= size - alignToWin; r++) {
    for (let c = alignToWin - 1; c < size; c++) {
      lines.push([...Array(alignToWin)].map((_, k) => (r + k) * size + (c - k)));
    }
  }

  // Check each line
  for (let line of lines) {
    const [first, ...rest] = line;
    if (board[first] && rest.every(i => board[i] === board[first])) {
      return { winner: board[first], winningCells: line };
    }
  }

  // Tie
  if (board.every(cell => cell)) return { winner: "tie", winningCells: [] };

  return null;
};

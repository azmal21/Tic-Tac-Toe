import { checkWinner } from "./checkWinner";

// Easy AI: random move
export const aiMoveEasy = (board) => {
  const emptyIndexes = board.map((cell, i) => (cell ? null : i)).filter(i => i !== null);
  if (!emptyIndexes.length) return null;
  return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
};

// Medium AI: win > block > random
export const aiMoveMedium = (board, alignToWin = 3, aiPlayer = "O", humanPlayer = "X") => {
  const emptyIndexes = board.map((cell, i) => (cell ? null : i)).filter(i => i !== null);

  // 1. Can AI win?
  for (let i of emptyIndexes) {
    const testBoard = [...board];
    testBoard[i] = aiPlayer;
    if (checkWinner(testBoard, alignToWin) === aiPlayer) return i;
  }

  // 2. Can Human win next? Block them
  for (let i of emptyIndexes) {
    const testBoard = [...board];
    testBoard[i] = humanPlayer;
    if (checkWinner(testBoard, alignToWin) === humanPlayer) return i;
  }

  // 3. Otherwise random
  return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
};

// Hard AI: depth-limited Minimax + heuristic for larger boards
export const aiMoveHard = (board, alignToWin = 3, aiPlayer = "O", humanPlayer = "X") => {
  const size = Math.sqrt(board.length);
  const emptyIndexes = board.map((cell, i) => (cell ? null : i)).filter(i => i !== null);

  if (!emptyIndexes.length) return null;

  const maxDepth = 3; // limit depth for performance

  const evaluateBoard = (board) => {
    let score = 0;

    const lines = [];

    // Collect all lines of length alignToWin
    for (let r = 0; r < size; r++) {
      for (let c = 0; c <= size - alignToWin; c++) {
        lines.push([...Array(alignToWin)].map((_, k) => r * size + c + k)); // rows
      }
    }
    for (let c = 0; c < size; c++) {
      for (let r = 0; r <= size - alignToWin; r++) {
        lines.push([...Array(alignToWin)].map((_, k) => (r + k) * size + c)); // columns
      }
    }
    for (let r = 0; r <= size - alignToWin; r++) {
      for (let c = 0; c <= size - alignToWin; c++) {
        lines.push([...Array(alignToWin)].map((_, k) => (r + k) * size + (c + k))); // TL-BR diagonals
      }
    }
    for (let r = 0; r <= size - alignToWin; r++) {
      for (let c = alignToWin - 1; c < size; c++) {
        lines.push([...Array(alignToWin)].map((_, k) => (r + k) * size + (c - k))); // TR-BL diagonals
      }
    }

    for (let line of lines) {
      const aiCount = line.filter(i => board[i] === aiPlayer).length;
      const humanCount = line.filter(i => board[i] === humanPlayer).length;

      if (aiCount && !humanCount) score += Math.pow(10, aiCount);       // prioritize AI lines
      else if (humanCount && !aiCount) score -= Math.pow(10, humanCount); // block Human
    }

    return score;
  };

  const minimax = (board, depth, isMaximizing, alpha, beta) => {
    const winner = checkWinner(board, alignToWin);
    if (winner === aiPlayer) return 1000 - depth;
    if (winner === humanPlayer) return -1000 + depth;
    if (winner === "draw" || depth === maxDepth) return evaluateBoard(board);

    const emptyIndexes = board.map((cell, i) => (cell ? null : i)).filter(i => i !== null);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i of emptyIndexes) {
        const newBoard = [...board];
        newBoard[i] = aiPlayer;
        const evalScore = minimax(newBoard, depth + 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break; // alpha-beta pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i of emptyIndexes) {
        const newBoard = [...board];
        newBoard[i] = humanPlayer;
        const evalScore = minimax(newBoard, depth + 1, true, alpha, beta);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break; // alpha-beta pruning
      }
      return minEval;
    }
  };

  let bestScore = -Infinity;
  let bestMove = null;

  for (let i of emptyIndexes) {
    const newBoard = [...board];
    newBoard[i] = aiPlayer;
    const score = minimax(newBoard, 0, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
};

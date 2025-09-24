import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["*"], 
    methods: ["GET", "POST"]
  }
});

// Rooms storage
const rooms = {};
const createBoard = (size) => Array(size * size).fill(null);

// ✅ Winner check function
function checkWinner(board, size, winLength) {
  const lines = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      lines.push(board.slice(r * size + c, r * size + c + winLength));
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      lines.push([...Array(winLength)].map((_, k) => board[(r + k) * size + c]));
    }
  }

  // Diagonals
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      lines.push([...Array(winLength)].map((_, k) => board[(r + k) * size + (c + k)]));
      lines.push([...Array(winLength)].map((_, k) => board[(r + k) * size + (c + winLength - 1 - k)]));
    }
  }

  for (let line of lines) {
    if (line.every((cell) => cell && cell === line[0])) return line[0];
  }

  return board.every((cell) => cell) ? "draw" : null;
}

io.on("connection", (socket) => {
  console.log("✅ Connected:", socket.id);

  // Create Room
  socket.on("createRoom", ({ roomId, boardSize, winLength, name }) => {
    if (rooms[roomId]) {
      socket.emit("errorMessage", "Room already exists!");
      return;
    }

    rooms[roomId] = {
      players: [{ id: socket.id, name, mark: "X" }],
      board: createBoard(boardSize),
      boardSize,
      winLength,
      currentPlayer: "X",
      score: { X: 0, O: 0 },
      round: 1,
      totalRounds: 3,
      targetWins: 2,
    };

    socket.join(roomId);

    // ✅ Send game state immediately to host
    socket.emit("startGame", rooms[roomId]);
  });

  // Join Room
  socket.on("joinRoom", ({ roomId, name }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit("errorMessage", "Room does not exist");
      return;
    }
    if (room.players.length >= 2) {
      socket.emit("errorMessage", "Room is full");
      return;
    }

    room.players.push({ id: socket.id, name, mark: "O" });
    socket.join(roomId);

    // ✅ Notify both players
    io.to(roomId).emit("startGame", room);
  });

  // Make Move
  socket.on("makeMove", ({ roomId, index }) => {
    const room = rooms[roomId];
    if (!room) return;
    if (room.board[index]) return;

    room.board[index] = room.currentPlayer;
    room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";

    const result = checkWinner(room.board, room.boardSize, room.winLength);

    if (result) {
      if (result !== "draw") room.score[result] += 1;

      const matchOver = Object.values(room.score).some((s) => s >= room.targetWins);

      if (matchOver) {
        const winnerMark = Object.keys(room.score).find((mark) => room.score[mark] >= room.targetWins);

        io.to(roomId).emit("matchOver", {
          matchWinner: winnerMark,
          score: room.score,
          players: room.players,
        });

        // ✅ Delete room so players can play again
        delete rooms[roomId];
      } else {
        io.to(roomId).emit("roundOver", {
          winner: result,
          board: room.board,
          score: room.score,
        });
      }
    } else {
      io.to(roomId).emit("roomUpdate", room);
    }
  });

  // Next Round
  socket.on("nextRound", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.board = createBoard(room.boardSize);
    room.currentPlayer = "X";
    room.round += 1;

    io.to(roomId).emit("roundStarted", {
      board: room.board,
      currentPlayer: room.currentPlayer,
      boardSize: room.boardSize,
      winLength: room.winLength,
      round: room.round,
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (!room) continue;

      const playerIndex = room.players.findIndex((p) => p.id === socket.id);

      if (playerIndex !== -1) {
        const disconnectedPlayer = room.players[playerIndex];
        const remainingPlayer = room.players.find((p) => p.id !== socket.id);

        // Remove disconnected player
        room.players.splice(playerIndex, 1);

        if (remainingPlayer) {
          // ✅ Remaining player wins the match
          io.to(roomId).emit("matchOver", {
            matchWinner: remainingPlayer.mark,
            score: room.score,
            players: room.players,
            reason: `${disconnectedPlayer.name} disconnected`,
          });
        }

        // ✅ Clean up the room after disconnect
        delete rooms[roomId];
        break;
      }
    }
  });
});

server.listen(4000, () => console.log("🚀 Server running on 4000"));



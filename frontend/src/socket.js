// socket.js
import { io } from "socket.io-client";

const SERVER = import.meta.env.VITE_BACKEND_URL || "https://tic-tac-toe-eulu.onrender.com";
export const socket = io(SERVER, { autoConnect: false, transports: ["websocket"] });

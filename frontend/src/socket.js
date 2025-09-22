// socket.js
import { io } from "socket.io-client";

const SERVER = "https://tic-tac-toe-eulu.onrender.com";
export const socket = io(SERVER, { autoConnect: true });


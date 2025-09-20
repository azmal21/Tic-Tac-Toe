// socket.js
import { io } from "socket.io-client";

const SERVER = import.meta.env.VITE_SERVER || "http://localhost:4000";
export const socket = io(SERVER, { autoConnect: true });

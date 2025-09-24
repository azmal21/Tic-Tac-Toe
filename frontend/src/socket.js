// socket.js
import { io } from "socket.io-client";

const SERVER = import.meta.env.VITE_BACKEND_URL ;
export const socket = io(SERVER, { autoConnect: false, transports: ["websocket"] });


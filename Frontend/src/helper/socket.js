import { io } from "socket.io-client";

const socket = io("https://localhost:3000", {
  transports: ["websocket"],
  secure: true,
  reconnection: true,
});
export default socket;

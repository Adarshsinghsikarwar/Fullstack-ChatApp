import { Server } from "socket.io";
import { config } from "./config";

let io;

export function init(server) {
  io = new Server(server, {
    cors: {
      origin: [config.CLIENT_URL],
      credentials: true,
    },
  });
  return io;
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

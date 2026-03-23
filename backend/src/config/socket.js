import { Server } from "socket.io";
import { corsOriginValidator } from "./cors.js";

let io;

export function init(server) {
  io = new Server(server, {
    cors: {
      origin: corsOriginValidator,
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

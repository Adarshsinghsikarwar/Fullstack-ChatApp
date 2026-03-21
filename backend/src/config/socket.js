import { Server } from "socket.io";

let io;

export function init(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
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

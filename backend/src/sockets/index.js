import { handleUserEvents } from "./user.socket.js";
import { handleChatEvents } from "./chat.socket.js";

export async function socketHandle(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle user connection and status
    handleUserEvents(io, socket);

    // Handle chat messages and events
    handleChatEvents(io, socket);
  });
}



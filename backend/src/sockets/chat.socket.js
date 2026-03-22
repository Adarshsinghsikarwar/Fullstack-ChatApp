import messageModel from "../models/message.model.js";
import { getReceiverSocketId } from "./user.socket.js";

export function handleChatEvents(io, socket) {
  // Join individual and group rooms on connection
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
  }

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`Socket ${socket.id} joined group room ${groupId}`);
  });

  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    console.log(`Socket ${socket.id} left group room ${groupId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, recipientId, groupId, content, media } = data;

      const newMessage = new messageModel({
        senderId,
        recipientId,
        groupId,
        content,
        media,
      });

      await newMessage.save();

      if (groupId) {
        // Broadcast to the group room
        io.to(groupId).emit("newMessage", newMessage);
      } else if (recipientId) {
        // Emit to the specific recipient room
        io.to(recipientId).emit("newMessage", newMessage);
      }

      socket.emit("messageSent", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("typing", (data) => {
    const { recipientId, groupId, senderId } = data;
    if (groupId) {
      socket.to(groupId).emit("typing", { senderId, groupId });
    } else if (recipientId) {
      io.to(recipientId).emit("typing", { senderId });
    }
  });

  socket.on("stopTyping", (data) => {
    const { recipientId, groupId, senderId } = data;
    if (groupId) {
      socket.to(groupId).emit("stopTyping", { senderId, groupId });
    } else if (recipientId) {
      io.to(recipientId).emit("stopTyping", { senderId });
    }
  });
}

import messageModel from "../models/message.model.js";
import { getReceiverSocketId } from "./user.socket.js";

export function handleChatEvents(io, socket) {
  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, recipientId, content, media } = data;

      // Save message to database
      const newMessage = new messageModel({
        senderId,
        recipientId,
        content,
        media,
      });

      await newMessage.save();

      // Get recipient socket ID
      const receiverSocketId = await getReceiverSocketId(recipientId);

      if (receiverSocketId) {
        // Emit to the specific recipient
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      // Optionally emit back to sender (or they can update locally)
      socket.emit("messageSent", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("typing", (data) => {
    const { recipientId, senderId } = data;
    getReceiverSocketId(recipientId).then((receiverSocketId) => {
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId });
      }
    });
  });

  socket.on("stopTyping", (data) => {
    const { recipientId, senderId } = data;
    getReceiverSocketId(recipientId).then((receiverSocketId) => {
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { senderId });
      }
    });
  });
}

export function handleChatEvents(io, socket) {
  socket.on("sendMessage", async (data) => {
    const { senderId, recipientId, content, media } = data;

    const message = new messageModel({
      senderId,
      recipientId,
      content,
      media,
    });
    await message.save();

    const receiverSocketId = await getReceiverSocketId(recipientId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    socket.emit("messageSent", Message);
  });

  socket.on("typing", (data) => {
    const { recipientId, senderId } = data;
    getReceiverSocketId(recipientId).then((receiverSocketId) => {
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId });
      }
    });
  });

  socket.on("stopTyping", (data) => {
    const { recipientId, senderId } = data;
    getReceiverSocketId(recipientId).then((receiverSocketId) => {
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { senderId });
      }
    });
  });
}

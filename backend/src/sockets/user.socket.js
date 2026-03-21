// Map to store online users {userId: socketId}
export const userSocketMap = {};

export async function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function handleUserEvents(io, socket) {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  }

  // Broadcast online users to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
}

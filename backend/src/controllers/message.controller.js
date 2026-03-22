import userModel from "../models/user.model.js";
import messageModel from "../models/message.model.js";
import { getReceiverSocketId } from "../sockets/user.socket.js";
import { getIo } from "../config/socket.js";

export async function getUsers(req, res) {
  try {
    const loggedInUserId = req.user.userId;

    const me = await userModel.findById(loggedInUserId).select("friends");
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = await userModel
      .find({ _id: { $in: me.friends } })
      .select("fullName username profilePicture");

    const safeFriends = friends.filter(
      (friend) => String(friend._id) !== String(loggedInUserId)
    );

    res.status(200).json(safeFriends);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function fetchMessage(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.userId;

    const me = await userModel.findById(myId).select("friends");
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFriend = me.friends.some(
      (friendId) => String(friendId) === String(userToChatId)
    );
    if (!isFriend) {
      return res
        .status(403)
        .json({ message: "You can only chat with friends" });
    }

    const messages = await messageModel
      .find({
        $or: [
          { senderId: myId, recipientId: userToChatId },
          { senderId: userToChatId, recipientId: myId },
        ],
      })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in fetchMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { content, media, groupId } = req.body;
    const { id: recipientId } = req.params;
    const senderId = req.user.userId;

    if (!groupId) {
      const me = await userModel.findById(senderId).select("friends");
      if (!me) {
        return res.status(404).json({ message: "User not found" });
      }

      const isFriend = me.friends.some(
        (friendId) => String(friendId) === String(recipientId)
      );
      if (!isFriend) {
        return res
          .status(403)
          .json({ message: "You can only message friends" });
      }
    }

    const newMessage = new messageModel({
      senderId,
      recipientId: groupId ? null : recipientId,
      groupId,
      content,
      media,
    });

    await newMessage.save();

    const io = getIo();
    if (groupId) {
      io.to(groupId).emit("newMessage", newMessage);
    } else {
      const receiverSocketId = await getReceiverSocketId(recipientId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

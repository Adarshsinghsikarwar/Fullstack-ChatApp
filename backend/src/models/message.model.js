import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    content: {
      type: String,
    },
    media: [
      {
        url: {
          type: String,
        },
        mediaType: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;

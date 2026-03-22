import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      select: false,
    },
    fullName: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      trim: true,
      default:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequestsSent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequestsReceived: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;

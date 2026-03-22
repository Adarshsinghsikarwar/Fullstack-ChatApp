import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";

export async function registerUser(req, res) {
  const { username, email, password, fullName } = req.body;
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or username already exists" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      fullName,
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, config.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res
      .status(201)
      .json({ message: "User registered successfully", user: userToReturn });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  console.log("Login attempt for:", email);
  try {
    // Search by email or username
    const user = await userModel
      .findOne({
        $or: [
          { email: email.toLowerCase() },
          { username: email.toLowerCase() },
        ],
      })
      .select("+password");

    if (!user) {
      console.log("User not found for identifier:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found, comparing passwords...");
    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Login successful for:", email);

    const token = jwt.sign({ userId: user._id }, config.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userToReturn = user.toObject();
    delete userToReturn.password;

    res.status(200).json({ message: "Login successful", user: userToReturn });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function logoutUser(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during user logout:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { profilePicture } = req.body;
    const userId = req.user.userId;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { profilePicture }, { new: true })
      .select("-password");

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getFriendshipData(req, res) {
  try {
    const userId = req.user.userId;

    const me = await userModel
      .findById(userId)
      .select("friends friendRequestsSent friendRequestsReceived");

    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    const relationIds = [
      ...me.friends.map(String),
      ...me.friendRequestsSent.map(String),
      ...me.friendRequestsReceived.map(String),
      String(userId),
    ];

    const [friends, incomingRequests, outgoingRequests, discoverUsers] =
      await Promise.all([
        userModel
          .find({ _id: { $in: me.friends } })
          .select("fullName username profilePicture"),
        userModel
          .find({ _id: { $in: me.friendRequestsReceived } })
          .select("fullName username profilePicture"),
        userModel
          .find({ _id: { $in: me.friendRequestsSent } })
          .select("fullName username profilePicture"),
        userModel
          .find({ _id: { $nin: relationIds } })
          .select("fullName username profilePicture")
          .sort({ createdAt: -1 })
          .limit(50),
      ]);

    const removeSelf = (list = []) =>
      list.filter((user) => String(user._id) !== String(userId));

    return res.status(200).json({
      friends: removeSelf(friends),
      incomingRequests: removeSelf(incomingRequests),
      outgoingRequests: removeSelf(outgoingRequests),
      discoverUsers: removeSelf(discoverUsers),
    });
  } catch (error) {
    console.error("Error in getFriendshipData:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const senderId = req.user.userId;
    const { userId: receiverId } = req.params;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    if (String(senderId) === String(receiverId)) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const [sender, receiver] = await Promise.all([
      userModel
        .findById(senderId)
        .select("friends friendRequestsSent friendRequestsReceived"),
      userModel
        .findById(receiverId)
        .select("friends friendRequestsSent friendRequestsReceived"),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFriends = sender.friends.some(
      (id) => String(id) === String(receiverId)
    );
    if (alreadyFriends) {
      return res.status(400).json({ message: "Already friends" });
    }

    const alreadySent = sender.friendRequestsSent.some(
      (id) => String(id) === String(receiverId)
    );
    if (alreadySent) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const requestedYou = sender.friendRequestsReceived.some(
      (id) => String(id) === String(receiverId)
    );
    if (requestedYou) {
      return res
        .status(400)
        .json({ message: "This user already sent you a request" });
    }

    sender.friendRequestsSent.push(receiverId);
    receiver.friendRequestsReceived.push(senderId);

    await Promise.all([sender.save(), receiver.save()]);
    return res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error in sendFriendRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const currentUserId = req.user.userId;
    const { userId: requesterId } = req.params;

    if (String(currentUserId) === String(requesterId)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const [currentUser, requester] = await Promise.all([
      userModel
        .findById(currentUserId)
        .select("friends friendRequestsSent friendRequestsReceived"),
      userModel
        .findById(requesterId)
        .select("friends friendRequestsSent friendRequestsReceived"),
    ]);

    if (!currentUser || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasRequest = currentUser.friendRequestsReceived.some(
      (id) => String(id) === String(requesterId)
    );
    if (!hasRequest) {
      return res
        .status(400)
        .json({ message: "No pending friend request from this user" });
    }

    const requesterSentRequest = requester.friendRequestsSent.some(
      (id) => String(id) === String(currentUserId)
    );
    if (!requesterSentRequest) {
      return res.status(400).json({ message: "Invalid friend request state" });
    }

    currentUser.friends = [
      ...new Set([...currentUser.friends.map(String), String(requesterId)]),
    ];
    requester.friends = [
      ...new Set([...requester.friends.map(String), String(currentUserId)]),
    ];

    currentUser.friendRequestsReceived =
      currentUser.friendRequestsReceived.filter(
        (id) => String(id) !== String(requesterId)
      );
    requester.friendRequestsSent = requester.friendRequestsSent.filter(
      (id) => String(id) !== String(currentUserId)
    );

    await Promise.all([currentUser.save(), requester.save()]);
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function rejectFriendRequest(req, res) {
  try {
    const currentUserId = req.user.userId;
    const { userId: requesterId } = req.params;

    const [currentUser, requester] = await Promise.all([
      userModel.findById(currentUserId).select("friendRequestsReceived"),
      userModel.findById(requesterId).select("friendRequestsSent"),
    ]);

    if (!currentUser || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.friendRequestsReceived =
      currentUser.friendRequestsReceived.filter(
        (id) => String(id) !== String(requesterId)
      );
    requester.friendRequestsSent = requester.friendRequestsSent.filter(
      (id) => String(id) !== String(currentUserId)
    );

    await Promise.all([currentUser.save(), requester.save()]);
    return res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error in rejectFriendRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function removeFriend(req, res) {
  try {
    const currentUserId = req.user.userId;
    const { userId: friendId } = req.params;

    if (String(currentUserId) === String(friendId)) {
      return res.status(400).json({ message: "You cannot remove yourself" });
    }

    const [currentUser, friendUser] = await Promise.all([
      userModel
        .findById(currentUserId)
        .select("friends friendRequestsSent friendRequestsReceived"),
      userModel
        .findById(friendId)
        .select("friends friendRequestsSent friendRequestsReceived"),
    ]);

    if (!currentUser || !friendUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const areFriends = currentUser.friends.some(
      (id) => String(id) === String(friendId)
    );

    if (!areFriends) {
      return res
        .status(400)
        .json({ message: "User is not in your friends list" });
    }

    currentUser.friends = currentUser.friends.filter(
      (id) => String(id) !== String(friendId)
    );
    friendUser.friends = friendUser.friends.filter(
      (id) => String(id) !== String(currentUserId)
    );

    // Also clear stale pending requests in either direction.
    currentUser.friendRequestsSent = currentUser.friendRequestsSent.filter(
      (id) => String(id) !== String(friendId)
    );
    currentUser.friendRequestsReceived =
      currentUser.friendRequestsReceived.filter(
        (id) => String(id) !== String(friendId)
      );
    friendUser.friendRequestsSent = friendUser.friendRequestsSent.filter(
      (id) => String(id) !== String(currentUserId)
    );
    friendUser.friendRequestsReceived =
      friendUser.friendRequestsReceived.filter(
        (id) => String(id) !== String(currentUserId)
      );

    await Promise.all([currentUser.save(), friendUser.save()]);
    return res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error in removeFriend:", error);
    res.status(500).json({ message: "Server error" });
  }
}

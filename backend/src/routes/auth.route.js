import express from "express";
import {
  registerValidation,
  loginValidation,
} from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
  getFriendshipData,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// POST /api/auth/register - Register a new user
authRouter.post("/register", registerValidation, validate, registerUser);
authRouter.post("/login", loginValidation, validate, loginUser);
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.get("/me", authMiddleware, getCurrentUser);
authRouter.put("/update-profile", authMiddleware, updateProfile);
authRouter.get("/friends", authMiddleware, getFriendshipData);
authRouter.post("/friends/request/:userId", authMiddleware, sendFriendRequest);
authRouter.post("/friends/accept/:userId", authMiddleware, acceptFriendRequest);
authRouter.post("/friends/reject/:userId", authMiddleware, rejectFriendRequest);
authRouter.delete("/friends/remove/:userId", authMiddleware, removeFriend);

export default authRouter;

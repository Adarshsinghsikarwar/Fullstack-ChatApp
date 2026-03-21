import express from "express";
import { registerValidation ,loginValidation } from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// POST /api/auth/register - Register a new user
authRouter.post("/register", registerValidation, validate, registerUser);
authRouter.post("/login", loginValidation, validate, loginUser);
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.get("/me", authMiddleware, getCurrentUser);

export default authRouter;

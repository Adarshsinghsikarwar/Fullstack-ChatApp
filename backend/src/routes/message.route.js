import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.get("/users", authMiddleware, getUsers);
messageRouter.get("/:id", authMiddleware, fetchMessage);
messageRouter.post("/send/:id", authMiddleware, sendMessage);

export default messageRouter;

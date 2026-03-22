import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createGroup,
  getGroups,
  getGroupMessages,
  updateGroupMembers,
  leaveGroup,
  deleteGroup,
} from "../controllers/group.controller.js";

const groupRouter = express.Router();

groupRouter.post("/create", authMiddleware, createGroup);
groupRouter.get("/list", authMiddleware, getGroups);
groupRouter.get("/messages/:groupId", authMiddleware, getGroupMessages);
groupRouter.put("/update/:groupId", authMiddleware, updateGroupMembers);
groupRouter.post("/:groupId/leave", authMiddleware, leaveGroup);
groupRouter.delete("/:groupId", authMiddleware, deleteGroup);

export default groupRouter;

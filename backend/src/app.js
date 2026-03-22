import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import groupRouter from "./routes/group.route.js";
import morgan from "morgan";

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);

export default app;

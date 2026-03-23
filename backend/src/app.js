import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import groupRouter from "./routes/group.route.js";
import morgan from "morgan";
import { config } from "./config/config.js";

const app = express();
app.use(
  cors({
    origin: [config.CLIENT_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;

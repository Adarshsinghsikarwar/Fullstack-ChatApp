import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import http from "http";
import { init } from "./src/config/socket.js";
import { socketHandle } from "./src/sockets/index.js";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const server = http.createServer(app);
const io = init(server);
socketHandle(io);

connectDB();

server.listen(3000, () => {
  console.log("server is running on port 3000");
});

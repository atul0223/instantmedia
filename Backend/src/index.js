import dotenv from "dotenv";
import app from "./app.js";
import https from "node:https";
import { Server } from "socket.io";
import fs from "fs";
import connection from "../dataBase/dbConnection.js";
dotenv.config({
  path: "./.env",
});
const port = process.env.PORT;
connection().then(() => {
  const options = {
    key: fs.readFileSync("localhost-key.pem"),
    cert: fs.readFileSync("localhost.pem"),
  };

  const server = https.createServer(options, app);

  const io = new Server(server, {
    cors: {
      origin: "https://localhost:5173",

      credentials: true, 
    },
  });
  io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("connected",()=>console.log("2 way connection established")
  )
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
   socket.to(chatId).emit("userJoined", { userId: "user-id" });
    console.log(`User joined group ${chatId}`);
  });

  socket.on("sendMessage", ({chat ,content,sender}) => {

   
    
    io.to(chat._id).emit("newMessage", 
    {
      chat,
      sender,
      content,
     
    }
    );
  });

  socket.on("typing", (groupId) => {
    socket.to(groupId).emit("userTyping", { userId: "user-id" });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
  server.listen(port, () => {
    console.log(`HTTPS server running on https://localhost:${port}`);
  });
});

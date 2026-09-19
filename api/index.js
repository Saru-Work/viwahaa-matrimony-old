import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//import mysql from "mysql2/promise";
//import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import adminRoutes from "./routes/admin.route.js";
import staffRoutes from "./routes/staff.routes.js";
import discountPackageRoutes from "./routes/discountPackage.route.js";
import heroImageRoutes from "./routes/heroImage.route.js";
import successStoryRoutes from "./routes/successStory.route.js";
import weddingGalleryRoutes from "./routes/weddingGallery.route.js";
import religionRoutes from "./routes/religion.route.js";
import defaultProfileImageRoutes from "./routes/defaultProfileImage.route.js";
import db from "./utils/dbconfig.js";
import initDb from "./utils/initDb.js";
import path from "path";

// Initialize database schema
initDb();

//dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

//HTTP + WebSocket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Track online users
const onlineUsers = new Map();

//expose db, io and onlineUsers to controllers via req
app.use((req, res, next) => {
  req.db = db;
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Viwaaha Matrimony Backend is running successfully!",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/discount-packages", discountPackageRoutes);
app.use("/api/hero-images", heroImageRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/wedding-gallery", weddingGalleryRoutes);
app.use("/api/religions", religionRoutes);
app.use("/api/default-profile-images", defaultProfileImageRoutes);

//console.log(onlineUsers);
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User identifies themselves
  socket.on("user_connected", ({ userId }) => {
    const stringUserId = String(userId);
    socket.userId = stringUserId;
    onlineUsers.set(stringUserId, socket.id);
    console.log(`User ${stringUserId} marked online`);
  });

  // Join chat room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  // Typing indicator
  socket.on("typing", ({ roomId, senderId }) => {
    socket.to(roomId).emit("display_typing", { senderId });
  });

  // Message sending
  socket.on("send_message", async (data) => {
    const { roomId, senderId, receiverId, message, timestamp } = data;

    try {
      await db.execute(
        `INSERT INTO messages (room_id, sender_id, receiver_id, message, timestamp)
         VALUES (?, ?, ?, ?, ?)`,
        [roomId, senderId, receiverId, message, timestamp],
      );

      io.to(roomId).emit("receive_message", data);
    } catch (err) {
      console.error("Socket message error:", err);
    }
  });

  // Disconnect logic
  socket.on("disconnect", async () => {
    const userId = socket.userId;
    if (!userId) return;

    onlineUsers.delete(userId);
    try {
      await db.execute(`UPDATE customers SET last_seen = ? WHERE id = ?`, [
        new Date().toISOString().slice(0, 19).replace("T", " "),
        userId,
      ]);
      console.log(`Updated last_seen for user ${userId}`);
    } catch (err) {
      console.error(" Failed to update last_seen:", err);
    }
  });
});

//global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

//start both HTTP and Socket server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// Load environment variables
dotenv.config();

// Initialize the app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => console.error(err));

// ChatMessage model
const ChatMessage = require("./models/ChatMessage");

// Authentication middleware to verify JWT token
const requireAuth = require("./middleware/requireAuth");

// Socket.IO connection for real-time messaging
io.on("connection", (socket) => {
    console.log("New client connected");

    // Listen for chat messages
    socket.on("sendMessage", async (msgData) => {
        try {
            const { token, roomId, message } = msgData;

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const sender = decoded.email;

            // Save message to MongoDB
            const chatMessage = new ChatMessage({ roomId, sender, message });
            await chatMessage.save();

            // Broadcast message to all clients in the room
            io.to(roomId).emit("receiveMessage", { sender, message });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    // Listen for room joining
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Routes for chat history
const chatRoutes = require("./routes/chat");
app.use("/api/chat", requireAuth, chatRoutes);

// Start the server
const PORT = process.env.PORT || 4906;
server.listen(PORT, () => {
    console.log(`Chat Service running on port ${PORT}`);
});

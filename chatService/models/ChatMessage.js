const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;

const Chat = require('../models/ChatModel');

// Get chat history by roomId
const getChatHistory = async (req, res) => {
    const { roomId } = req.params;
    
    try {
        const chatHistory = await Chat.find({ room: roomId }).sort({ createdAt: 1 });
        res.status(200).json(chatHistory);
    } catch (err) {
        res.status(500).json({ error: 'Unable to fetch chat history' });
    }
};

// Post message in chat room
const postMessage = async (req, res) => {
    const { roomId } = req.params;
    const { message, senderId } = req.body;

    try {
        const newMessage = new Chat({
            room: roomId,
            message,
            senderId
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to post message' });
    }
};

module.exports = { getChatHistory, postMessage };

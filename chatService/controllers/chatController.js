const ApiResponse = require("../dto/responseDto");
const Chat = require('../models/ChatModel'); // Correct the path to your model if necessary
const { decodeToken } = require('../functions/decodeToken'); 



// Get chat history by roomId
const getChatHistory = async (req, res) => {
    const { roomId } = req.params;
    
    try {
        const chatHistory = await Chat.find({ room: roomId }).sort({ createdAt: 1 });
        const response = new ApiResponse(true, 200, 'Chat history fetched successfully', chatHistory);
        res.status(200).json(response);
    } catch (err) {
        const response = new ApiResponse(false, 500, 'Unable to fetch chat history', null);
        res.status(500).json(response);
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
        const response = new ApiResponse(true, 201, 'Message posted successfully', newMessage);
        res.status(201).json(response);
    } catch (err) {
        const response = new ApiResponse(false, 500, 'Failed to post message', null);
        res.status(500).json(response);
    }
};

module.exports = { getChatHistory, postMessage };

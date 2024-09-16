const ChatMessage = require("../models/ChatMessage");
const ApiResponse = require("../dto/responseDto"); // Assuming you're following the ApiResponse structure

// Fetch chat history for a specific room
const getChatHistory = async (req, res) => {
    const { roomId } = req.params;

    try {
        // Retrieve chat history based on the room ID
        const messages = await ChatMessage.find({ roomId }).sort({ timestamp: 1 });

        // Send success response with the messages
        const response = new ApiResponse(true, 200, "Chat history retrieved successfully", messages);
        res.status(200).json(response);
    } catch (error) {
        // Handle error and send failure response
        const response = new ApiResponse(false, 500, "Failed to retrieve chat history", null);
        res.status(500).json(response);
    }
};

module.exports = {
    getChatHistory
};

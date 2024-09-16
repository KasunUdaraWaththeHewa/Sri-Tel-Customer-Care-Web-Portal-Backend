const express = require("express");
const { getChatHistory } = require("../controllers/chatController");
const router = express.Router();

// Route to get chat history for a specific room
router.get("/history/:roomId", getChatHistory);

module.exports = router;

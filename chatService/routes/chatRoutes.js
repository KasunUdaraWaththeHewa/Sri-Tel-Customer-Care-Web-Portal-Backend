const express = require('express');
const { getChatHistory, postMessage } = require('../controllers/chatController');

const router = express.Router();

router.get('/:roomId', getChatHistory);  // Get chat history by roomId
router.post('/:roomId', postMessage);   // Post message in room

module.exports = router;

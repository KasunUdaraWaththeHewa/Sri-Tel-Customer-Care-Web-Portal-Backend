const express = require("express");
const { activateVoice, deactivateVoice } = require("../controllers/voiceController");
const router = express.Router();

router.post("/voice/activate", activateVoice);
router.post("/voice/deactivate", deactivateVoice);

module.exports = router;

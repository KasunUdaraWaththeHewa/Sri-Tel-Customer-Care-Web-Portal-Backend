const express = require("express");
const { activateVoice, deactivateVoice , getAllActivatedVoice} = require("../controllers/voiceController");
const router = express.Router();

router.post("/voice/activate", activateVoice);
router.post("/voice/deactivate", deactivateVoice);
router.get("/voice/activated/:accountID", getAllActivatedVoice);

module.exports = router;

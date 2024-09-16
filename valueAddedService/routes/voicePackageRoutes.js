const express = require("express");
const {
  createVoicePackage,
  getAllVoicePackages,
  getVoicePackageById,
  updateVoicePackage,
  deleteVoicePackage,
} = require("../controllers/voicePackageController");
const router = express.Router();

router.post("/voice-packages", createVoicePackage);
router.get("/voice-packages", getAllVoicePackages);
router.get("/voice-packages/:id", getVoicePackageById);
router.put("/voice-packages/:id", updateVoicePackage);
router.delete("/voice-packages/:id", deleteVoicePackage);

module.exports = router;

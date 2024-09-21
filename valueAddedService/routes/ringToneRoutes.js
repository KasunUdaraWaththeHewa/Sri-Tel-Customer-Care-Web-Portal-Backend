const express = require("express");
const {
  personalizeTone,
  getAllActiveTones,
  deactivateTone
} = require("../controllers/ringToneController");

const router = express.Router();

router.post("/personalize-tone", personalizeTone);
router.get("/active-tones/:accountID", getAllActiveTones);
router.post("/deactivate-tone", deactivateTone);

module.exports = router;

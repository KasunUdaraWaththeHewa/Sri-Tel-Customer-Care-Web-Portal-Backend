const express = require("express");
const {
  personalizeTone,
  getAllActiveTones,
} = require("../controllers/ringToneController");
const router = express.Router();

router.post("/personalize-tone", personalizeTone);
router.get("/active-tones/:accountID", getAllActiveTones);

module.exports = router;

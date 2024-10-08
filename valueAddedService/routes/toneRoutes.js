const express = require("express");
const {
  getAvailableTones,
  addToneToCatalog,
} = require("../controllers/toneController");
const router = express.Router();

router.get("/tones", getAvailableTones);
router.post("/tones", addToneToCatalog);

module.exports = router;

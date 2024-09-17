const express = require("express");
const { activateData, deactivateData } = require("../controllers/dataController");
const router = express.Router();

router.post("/data/activate", activateData);
router.post("/data/deactivate", deactivateData);

module.exports = router;

const express = require("express");
const { activateData, deactivateData, getAllActiveDataPackages } = require("../controllers/dataController");
const router = express.Router();

router.post("/data/activate", activateData);
router.post("/data/deactivate", deactivateData);
router.get("/active-data-packages/:accountID", getAllActiveDataPackages);

module.exports = router;

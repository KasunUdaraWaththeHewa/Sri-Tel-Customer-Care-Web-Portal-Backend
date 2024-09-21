const express = require("express");
const { activateData, deactivateData, getAllActiveDataPackages , isDataPackageActive } = require("../controllers/dataController");
const router = express.Router();

router.post("/data/activate", activateData);
router.post("/data/deactivate", deactivateData);
router.get("/active-data-packages/:accountID", getAllActiveDataPackages);
router.get("/data/is-active", isDataPackageActive);

module.exports = router;

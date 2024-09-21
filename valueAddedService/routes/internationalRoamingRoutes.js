const express = require("express");
const {
  activateRoaming,
  deactivateRoaming,
  isActiveRoaming
} = require("../controllers/internationalRoamingController");
const router = express.Router();

router.post("/activate-roaming", activateRoaming);
router.post("/deactivate-roaming", deactivateRoaming);
router.get("/is-active-roaming/:accountID", isActiveRoaming);


module.exports = router;

const express = require("express");
const {
  activateRoaming,
  deactivateRoaming,
  isActiveRoaming
} = require("../controllers/internationalRoamingController");
const router = express.Router();

router.put("/activate-roaming", activateRoaming);
router.put("/deactivate-roaming", deactivateRoaming);
router.get("/is-active-roaming/:accountID", isActiveRoaming);


module.exports = router;

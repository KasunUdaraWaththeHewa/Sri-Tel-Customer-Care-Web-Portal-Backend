const express = require("express");
const {
  activateRoaming,
  deactivateRoaming,
} = require("../controllers/internationalRoamingController");
const router = express.Router();

router.put("/activate-roaming", activateRoaming);
router.put("/deactivate-roaming", deactivateRoaming);


module.exports = router;

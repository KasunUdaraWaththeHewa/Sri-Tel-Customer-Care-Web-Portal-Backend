const express = require("express");
const { getTotalBillingAmount } = require("../controllers/billingController");
const router = express.Router();

router.get("/:accountID", getTotalBillingAmount);
module.exports = router;

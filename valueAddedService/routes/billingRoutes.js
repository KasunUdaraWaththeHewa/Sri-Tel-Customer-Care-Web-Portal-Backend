const express = require("express");
const { getTotalBillingAmount } = require("../controllers/billingController");
const router = express.Router();

router.get("/billing/:accountID", getTotalBillingAmount);
module.exports = router;

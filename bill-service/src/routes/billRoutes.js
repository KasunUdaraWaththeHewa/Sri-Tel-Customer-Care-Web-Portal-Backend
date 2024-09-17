const express = require("express");
const router = express.Router();
const billController = require("../controllers/billController");
const test = require("../jobs/billingCronJob");

// API endpoints for bill service
router.post("/create", billController.createBill);
router.post("/pay", billController.recordPayment);
router.get("/history/:accountId", billController.getBillHistory);
router.get("/status/:billId", billController.getBillStatus);
router.get("/test", test.runBillingJob);

module.exports = router;

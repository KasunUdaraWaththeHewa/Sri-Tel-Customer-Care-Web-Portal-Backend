const express = require("express");
const router = express.Router();
const billController = require("../controllers/billController");

// API endpoints for bill service
router.post("/create", billController.createBill);
router.post("/pay", billController.recordPayment);
router.get("/history/:accountId", billController.getBillHistory);
router.get("/status/:billId", billController.getBillStatus);

module.exports = router;

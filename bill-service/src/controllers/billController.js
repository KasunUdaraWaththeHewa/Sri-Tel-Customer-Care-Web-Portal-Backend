const billService = require("../services/billService");
const { decodeToken } = require('../functions/decodeToken'); 


// Create a new bill
exports.createBill = async (req, res) => {
  try {
    const { accountId, amount, dueDate } = req.body;
    const bill = await billService.createBill(accountId, amount, dueDate);
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record a payment for a bill
exports.recordPayment = async (req, res) => {
  try {
    const { billId, amount, paymentMethod } = req.body;
    const payment = await billService.recordPayment(
      billId,
      amount,
      paymentMethod
    );
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bill history for an account
exports.getBillHistory = async (req, res) => {
  try {
    const { accountId } = req.params;
    const bills = await billService.getBillHistory(accountId);
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check bill status
exports.getBillStatus = async (req, res) => {
  try {
    const { billId } = req.params;
    const status = await billService.getBillStatus(billId);
    res.status(200).json({ status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

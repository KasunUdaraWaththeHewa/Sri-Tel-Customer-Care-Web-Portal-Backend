const billService = require("../services/billService");
const { decodeToken } = require("../functions/decodeToken");
const axios = require("axios");

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

    // Deduct the payment amount from the customer's total outstanding
    const bill = await billService.getBillById(billId);
    const accountId = bill.accountId;
    await axios.post(
      `http://bff:4901/api/proxy/forward/customer/outstanding/${accountId}`,
      {
        amount: -amount,
      },
      {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGY3YTdlMWI0ZTRhN2YyZDhjOGM0YjQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjY3NDEzNjAsImV4cCI6MjY3MzQ2OTM2MH0.oWTogdxmge7I4IsGptQPetjz4tTb1OncNnPHmdDMVMs`,
        },
      }
    );

    // Update the last payment date
    await axios.post(
      `http://bff:4901/api/proxy/forward/customer/paymentDate/${accountId}`,
      {
        lastPaymentDate: new Date(),
      },
      {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGY3YTdlMWI0ZTRhN2YyZDhjOGM0YjQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjY3NDEzNjAsImV4cCI6MjY3MzQ2OTM2MH0.oWTogdxmge7I4IsGptQPetjz4tTb1OncNnPHmdDMVMs`,
        },
      }
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

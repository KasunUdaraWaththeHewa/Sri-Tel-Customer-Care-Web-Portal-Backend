const mongoose = require("mongoose");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");

// Generate a new bill
exports.createBill = async (accountId, amount, dueDate) => {
  const newBill = new Bill({
    accountId,
    amount,
    dueDate,
    billDate: new Date(),
    status: "Unpaid",
  });
  return await newBill.save();
};

// Record a payment
exports.recordPayment = async (billId, amount, paymentMethod) => {
  try {
    // Validate the billId
    if (!mongoose.isValidObjectId(billId)) {
      throw new Error("Invalid billId format");
    }

    const validBillId = new mongoose.Types.ObjectId(billId);

    const bill = await Bill.findById(validBillId);
    if (!bill) throw new Error("Bill not found");

    // Record the payment
    const payment = new Payment({
      billId: validBillId,
      paymentDate: new Date(),
      amount,
      paymentMethod,
    });
    await payment.save();

    // Update bill status to Paid
    bill.status = "Paid";
    await bill.save();

    return payment;
  } catch (error) {
    throw error;
  }
};

// Get bill history for an account
exports.getBillHistory = async (accountId) => {
  return await Bill.find({ accountId }).sort({ billDate: -1 });
};

// Get bill status
exports.getBillStatus = async (billId) => {
  try {
    // Validate the billId
    if (!mongoose.isValidObjectId(billId)) {
      throw new Error("Invalid billId format");
    }

    const validBillId = new mongoose.Types.ObjectId(billId);

    const bill = await Bill.findById(validBillId);
    if (!bill) throw new Error("Bill not found");
    return bill.status;
  } catch (error) {
    throw error;
  }
};

exports.getBillById = async (billId) => {
  try {
    const bill = await Bill.findById(billId);
    return bill;
  } catch (error) {
    throw new Error("Error fetching bill by ID: " + error.message);
  }
};

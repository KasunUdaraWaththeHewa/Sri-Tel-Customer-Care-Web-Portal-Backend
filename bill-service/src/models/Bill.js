const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  billDate: { type: Date, required: true },
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
});

module.exports = mongoose.model("Bill", billSchema);

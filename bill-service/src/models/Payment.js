const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  billId: { type: mongoose.Schema.Types.ObjectId, ref: "Bill", required: true },
  paymentDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Debit Card"],
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);

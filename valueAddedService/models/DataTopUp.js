const mongoose = require("mongoose");

const DataTopUpSchema = new mongoose.Schema(
  {
    accountID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    dataAmount: { type: Number, required: true }, // Amount in MB/GB
    topUpDate: { type: Date, default: Date.now },
    expiryDate: { type: Date }, // Optional, based on plan duration
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataTopUp", DataTopUpSchema);

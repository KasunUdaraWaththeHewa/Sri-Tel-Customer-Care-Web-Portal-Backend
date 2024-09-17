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
    price: { type: Number, required: true },
    topUpDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataTopUp", DataTopUpSchema);

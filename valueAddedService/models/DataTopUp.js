const mongoose = require("mongoose");

const DataTopUpSchema = new mongoose.Schema(
  {
    packageName: { type: String, required: true },
    description: String,
    features: {
      type: Object,
      required: true,
    },
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
    packageID: { type: String, required: true },
    dataAmount: { type: Number, required: true }, // Amount in MB/GB
    price: { type: Number, required: true },
    topUpDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataTopUp", DataTopUpSchema);

const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
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
    activationDate: { type: Date, default: Date.now },
    deactivatedDate: { type: Date },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);

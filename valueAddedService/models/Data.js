const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
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
    packageID: { type: String, required: true },
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

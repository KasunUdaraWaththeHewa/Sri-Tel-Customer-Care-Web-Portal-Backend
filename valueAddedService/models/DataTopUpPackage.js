const mongoose = require("mongoose");

const DataTopUpPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    features: {
      type: Object,
      required: true,
    },
    dataAmount: { type: Number, required: true }, // Amount in MB/GB
    price: { type: Number, required: true },
    durationInDays: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataTopUpPackage", DataTopUpPackageSchema);

const mongoose = require("mongoose");

const DataPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    dataAmount: {
      type: Number,
      required: true,
    }, // Amount in MB/GB
    price: Number,
    durationInDays: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataPackage", DataPackageSchema);

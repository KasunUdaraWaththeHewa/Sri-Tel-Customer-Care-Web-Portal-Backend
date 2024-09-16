const mongoose = require("mongoose");

const ToneCatalogSchema = new mongoose.Schema(
  {
    toneId: {
      type: String,
      required: true,
      unique: true, // Ensures that each tone has a unique ID
    },
    toneName: {
      type: String,
      required: true,
    },
    toneDescription: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ToneCatalog", ToneCatalogSchema);

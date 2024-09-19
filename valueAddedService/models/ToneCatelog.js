const mongoose = require("mongoose");

const ToneCatalogSchema = new mongoose.Schema(
  {
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

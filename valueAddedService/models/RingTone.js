const mongoose = require("mongoose");

const RingToneSchema = new mongoose.Schema(
  {
    packageName: { type: String, required: true },
    toneDescription: String,
    accountID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    price: { type: Number, required: true },
    toneId: { type: String, required: true },
    activationDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RingTone", RingToneSchema);

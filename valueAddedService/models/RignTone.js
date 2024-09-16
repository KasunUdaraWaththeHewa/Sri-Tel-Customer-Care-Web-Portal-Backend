const mongoose = require("mongoose");

const RingToneSchema = new mongoose.Schema(
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
    toneId: { type: String, required: true },
    activationDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RingTone", RingToneSchema);

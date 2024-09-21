const mongoose = require("mongoose");

const RingToneSchema = new mongoose.Schema(
  {
    packageName: { type: String, required: true },
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
    price: { type: Number, required: true },
    toneId: { type: String, required: true },
    activationDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RingTone", RingToneSchema);

const mongoose = require("mongoose");

const VoiceSchema = new mongoose.Schema(
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
    packageID: { type: String, required: true },
    voiceMinutes: { type: Number, required: true }, // Minutes of voice usage
    price: { type: Number, required: true },
    activationDate: { type: Date, default: Date.now },
    deactivatedDate: { type: Date },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voice", VoiceSchema);

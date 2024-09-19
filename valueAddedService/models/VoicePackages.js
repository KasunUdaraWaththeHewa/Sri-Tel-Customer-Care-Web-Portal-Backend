const mongoose = require("mongoose");

const VoicePackageSchema = new mongoose.Schema(
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
    talkTime: {
      type: Number,
      required: true,
    }, // Talk time in minutes
    price: Number,
    durationInDays: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("VoicePackage", VoicePackageSchema);

const mongoose = require("mongoose");

const SubscriptionVASchema = new mongoose.Schema(
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
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    subscriptionDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionVAS", SubscriptionVASchema);

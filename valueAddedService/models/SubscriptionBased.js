const mongoose = require("mongoose");

const SubscriptionVASchema = new mongoose.Schema(
  {
    packageName: { type: String, required: true },
    accountID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    description: String,
    features: {
      type: Object,
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    price: {
      type: Number,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionVAS", SubscriptionVASchema);

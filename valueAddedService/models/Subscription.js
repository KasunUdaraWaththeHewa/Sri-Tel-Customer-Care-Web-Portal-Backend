const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  features: {
    type: Object,
    required: true,
  },
  price: Number,
  durationInDays: Number,
}, { timestamps: true });

module.exports = mongoose.model("Subscription", SubscriptionSchema);

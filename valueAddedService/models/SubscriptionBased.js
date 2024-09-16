const mongoose = require('mongoose');

const SubscriptionVASchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    serviceName: { type: String, required: true }, // E.g., SMS Pack, Premium Caller Tunes
    isActive: { type: Boolean, default: false },
    subscriptionDate: { type: Date },
    expiryDate: { type: Date }, // Based on subscription duration
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionVAS', SubscriptionVASchema);

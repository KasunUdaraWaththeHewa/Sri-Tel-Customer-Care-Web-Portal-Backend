const SubscriptionVAS = require('../models/SubscriptionBased');

const activateSubscription = async (req, res) => {
    const { customerId, serviceName } = req.body;
    try {
        const subscription = new SubscriptionVAS({
            customerId,
            serviceName,
            isActive: true,
            subscriptionDate: Date.now(),
        });
        await subscription.save();
        res.status(201).json({ message: `${serviceName} activated successfully!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deactivateSubscription = async (req, res) => {
    const { customerId, serviceName } = req.body;
    try {
        const subscription = await SubscriptionVAS.findOne({ customerId, serviceName });
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });
        subscription.isActive = false;
        await subscription.save();
        res.status(200).json({ message: `${serviceName} deactivated successfully!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { activateSubscription, deactivateSubscription };

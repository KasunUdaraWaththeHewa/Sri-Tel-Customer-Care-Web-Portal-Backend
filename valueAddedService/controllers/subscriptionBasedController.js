const SubscriptionVAS = require("../models/SubscriptionBased");
const Subscription = require("../models/Subscription");
const ApiResponse = require("../dto/responseDto");

const calculateExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

const activateSubscription = async (req, res) => {
  const { accountID, email, subscriptionId } = req.body;
  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      const response = new ApiResponse(
        false,
        404,
        "Subscription not found",
        null
      );
      return res.status(404).json(response);
    }

    let subscriptionVAS = await SubscriptionVAS.findOne({
      accountID,
      subscriptionId,
    });

    if (subscriptionVAS) {
      if (subscriptionVAS.isActive) {
        const response = new ApiResponse(
          false,
          400,
          "Subscription already active",
          null
        );
        return res.status(400).json(response);
      }

      // Update existing subscriptionVAS
      subscriptionVAS.isActive = true;
      subscriptionVAS.subscriptionDate = Date.now();
      subscriptionVAS.expiryDate = subscription.durationInDays
        ? calculateExpiryDate(subscription.durationInDays)
        : null;
    } else {
      // Create new subscriptionVAS
      subscriptionVAS = new SubscriptionVAS({
        accountID,
        email,
        subscriptionId,
        isActive: true,
        subscriptionDate: Date.now(),
        expiryDate: subscription.durationInDays
          ? calculateExpiryDate(subscription.durationInDays)
          : null,
      });
    }

    await subscriptionVAS.save();

    const response = new ApiResponse(
      true,
      201,
      `${subscription.name} activated successfully!`,
      subscriptionVAS
    );
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while activating subscription.",
      null
    );
    res.status(500).json(response);
  }
};

const deactivateSubscription = async (req, res) => {
  const { accountID, subscriptionId } = req.body;
  try {
    const subscriptionVAS = await SubscriptionVAS.findOne({
      accountID,
      subscriptionId,
    });
    if (!subscriptionVAS) {
      const response = new ApiResponse(
        false,
        404,
        "Subscription not found",
        null
      );
      return res.status(404).json(response);
    }

    if (!subscriptionVAS.isActive) {
      const response = new ApiResponse(
        false,
        400,
        "Subscription already inactive",
        null
      );
      return res.status(400).json(response);
    }

    subscriptionVAS.isActive = false;
    await subscriptionVAS.save();

    const response = new ApiResponse(
      true,
      200,
      "Subscription deactivated successfully!",
      subscriptionVAS
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while deactivating subscription.",
      null
    );
    res.status(500).json(response);
  }
};

module.exports = { activateSubscription, deactivateSubscription };

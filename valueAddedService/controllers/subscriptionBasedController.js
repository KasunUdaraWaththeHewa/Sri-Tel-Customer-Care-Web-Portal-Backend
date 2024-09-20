const SubscriptionVAS = require("../models/SubscriptionBased");
const Subscription = require("../models/Subscription");
const ApiResponse = require("../dto/responseDto");
const { checkExistingAccount } = require("../functions/checkExistingAccount");
const { decodeToken } = require('../functions/decodeToken'); 


const calculateExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

const activateSubscription = async (req, res) => {
  const { accountID, email, subscriptionId, price, durationInDays } = req.body;
  try {
    const existingAccount = await checkExistingAccount(accountID);
    if (!existingAccount) {
      return res.status(404).json(new ApiResponse(false, 404, "Account not found.", null));
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json(new ApiResponse(false, 404, "Subscription not found.", null));
    }

    let subscriptionVAS = await SubscriptionVAS.findOne({
      accountID,
      subscriptionId,
      isActive: true,
    });

    if (subscriptionVAS) {
      return res.status(400).json(new ApiResponse(false, 400, "Subscription already active.", null));
    }

    subscriptionVAS = await SubscriptionVAS.findOne({
      accountID,
      subscriptionId,
    });

    if (subscriptionVAS) {
      subscriptionVAS.isActive = true;
      subscriptionVAS.subscriptionDate = Date.now();
      subscriptionVAS.expiryDate = durationInDays
        ? calculateExpiryDate(durationInDays)
        : calculateExpiryDate(subscription.durationInDays || 30);
    } else {
      subscriptionVAS = new SubscriptionVAS({
        accountID,
        email,
        subscriptionId,
        price,
        isActive: true,
        subscriptionDate: Date.now(),
        expiryDate: durationInDays
          ? calculateExpiryDate(durationInDays)
          : calculateExpiryDate(subscription.durationInDays || 30),
      });
    }

    await subscriptionVAS.save();

    res.status(201).json(new ApiResponse(true, 201, `${subscription.name} activated successfully!`, subscriptionVAS));
  } catch (error) {
    res.status(500).json(new ApiResponse(false, 500, "Server error while activating subscription.", null));
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

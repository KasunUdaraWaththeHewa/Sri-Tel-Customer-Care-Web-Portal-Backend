const mongoose = require("mongoose");
const Voice = require("../models/Voice");
const SubscriptionVAS = require("../models/SubscriptionBased");
const RingTone = require("../models/RingTone");
const DataTopUp = require("../models/DataTopUp");
const { decodeToken } = require('../functions/decodeToken'); 


const getTotalBillingAmount = async (req, res) => {
  const { accountID } = req.params;

  try {
    // Validate accountID
    if (!mongoose.Types.ObjectId.isValid(accountID)) {
      return res.status(400).json({ error: "Invalid accountID format" });
    }

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    console.log("Start of month:", startOfMonth);
    console.log("End of month:", endOfMonth);
    console.log("Account ID:", accountID);

    const voiceCharges = await Voice.aggregate([
      {
        $match: {
          accountID: accountID,
          activationDate: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: "voice", total: { $sum: "$price" } } },
    ]);

    console.log("Voice charges:", voiceCharges);

    const subscriptionCharges = await SubscriptionVAS.aggregate([
      {
        $match: {
          accountID: accountID,
          subscriptionDate: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: "subscription", total: { $sum: "$price" } } },
    ]);

    console.log("Subscription charges:", subscriptionCharges);

    const ringToneCharges = await RingTone.aggregate([
      {
        $match: {
          accountID: accountID,
          activationDate: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: "ringtone", total: { $sum: "$price" } } },
    ]);

    console.log("RingTone charges:", ringToneCharges);

    const dataTopUpCharges = await DataTopUp.aggregate([
      {
        $match: {
          accountID: accountID,
          topUpDate: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: "dataTopUp", total: { $sum: "$price" } } },
    ]);

    console.log("DataTopUp charges:", dataTopUpCharges);

    const totalBillingAmount =
      (voiceCharges[0]?.total || 0) +
      (subscriptionCharges[0]?.total || 0) +
      (ringToneCharges[0]?.total || 0) +
      (dataTopUpCharges[0]?.total || 0);

    console.log("Total billing amount:", totalBillingAmount);

    return res.status(200).json({ totalBillingAmount });
  } catch (error) {
    console.error("Error calculating total billing amount:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTotalBillingAmount,
};

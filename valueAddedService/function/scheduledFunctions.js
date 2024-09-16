const Data = require("../models/Data");
const DataTopUp = require("../models/DataTopUp");
const RingTone = require("../models/RingTone");
const SubscriptionVAS = require("../models/SubscriptionBased");
const Voice = require("../models/Voice");

const expireData = async () => {
  try {
    const now = new Date();
    await Data.updateMany(
      { expiryDate: { $lte: now }, isActive: true },
      { isActive: false, deactivatedDate: now }
    );
    console.log("Data services expired successfully");
  } catch (error) {
    console.error("Error expiring data services:", error);
  }
};

const expireVoice = async () => {
  try {
    const now = new Date();
    await Voice.updateMany(
      { expiryDate: { $lte: now }, isActive: true },
      { isActive: false, deactivatedDate: now }
    );
    console.log("Voice services expired successfully");
  } catch (error) {
    console.error("Error expiring voice services:", error);
  }
};

const expireDataTopUp = async () => {
  try {
    const now = new Date();
    await DataTopUp.updateMany(
      { expiryDate: { $lte: now } },
      { $set: { dataAmount: 0, isActive: false } }
    );
    console.log("Data top-up services expired successfully");
  } catch (error) {
    console.error("Error expiring data top-up services:", error);
  }
};

const expireRingTone = async () => {
  try {
    const now = new Date();
    await RingTone.updateMany(
      { expiryDate: { $lte: now } },
      {
        $unset: { toneId: "" },
        $set: { isActive: false },
      }
    );
    console.log("Ring tones expired successfully");
  } catch (error) {
    console.error("Error expiring ring tones:", error);
  }
};

const expireSubscriptionBased = async () => {
  try {
    const now = new Date();
    await SubscriptionVAS.updateMany(
      { expiryDate: { $lte: now }, isActive: true },
      { isActive: false }
    );
    console.log("Subscription-based services expired successfully");
  } catch (error) {
    console.error("Error expiring subscription-based services:", error);
  }
};

module.exports = {
  expireData,
  expireVoice,
  expireDataTopUp,
  expireRingTone,
  expireSubscriptionBased,
};

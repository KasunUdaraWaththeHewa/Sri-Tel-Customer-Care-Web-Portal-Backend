const RingTone = require("../models/RingTone");
const ApiResponse = require("../dto/responseDto");
const { checkExistingAccount } = require("../function/checkExistingAccount");

const personalizeTone = async (req, res) => {
  const { accountID, email, price, toneId, durationInDays } = req.body;

  try {
    const existingAccount = checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }

    const expiryDate = durationInDays
      ? calculateExpiryDate(durationInDays)
      : null;

    const tone = new RingTone({
      accountID,
      email,
      price,
      toneId,
      expiryDate,
    });

    await tone.save();

    const response = new ApiResponse(
      true,
      201,
      "Ring-back tone personalized!",
      tone
    );
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while personalizing ring-back tone.",
      null
    );
    res.status(500).json(response);
  }
};

const calculateExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

module.exports = { personalizeTone };

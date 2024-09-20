const RingTone = require("../models/RingTone");
const ApiResponse = require("../dto/responseDto");
const { checkExistingAccount } = require("../functions/checkExistingAccount");
const { decodeToken } = require("../functions/decodeToken");

const personalizeTone = async (req, res) => {
  const { accountID, email, price, toneId, durationInDays } = req.body;

  try {
    const existingAccount = await checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }

    await RingTone.updateMany(
      { accountID, isActive: true },
      { $set: { isActive: false } }
    );

    const expiryDate = durationInDays
      ? calculateExpiryDate(durationInDays)
      : null;

    const tone = new RingTone({
      accountID,
      email,
      price,
      toneId,
      expiryDate,
      isActive: true,
    });

    await tone.save();

    const response = new ApiResponse(
      true,
      201,
      "Ring-back tone personalized and activated!",
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

const getAllActiveTones = async (req, res) => {
  const { accountID } = req.params;
  try {
    const tones = await RingTone.find({ isActive: true, accountID });
    const response = new ApiResponse(
      true,
      200,
      "Active ring-back tones retrieved successfully!",
      tones
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while retrieving active ring-back tones.",
      null
    );
    res.status(500).json(response);
  }
}


module.exports = { personalizeTone, getAllActiveTones };

const DataTopUp = require("../models/DataTopUp");
const ApiResponse = require("../dto/responseDto");

const calculateExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

const topUpData = async (req, res) => {
  const { accountID, email, dataAmount, durationInDays } = req.body;

  try {
    const expiryDate = durationInDays
      ? calculateExpiryDate(durationInDays)
      : null;

    const topUp = new DataTopUp({
      accountID,
      email,
      dataAmount,
      expiryDate,
    });

    await topUp.save();

    const response = new ApiResponse(
      true,
      201,
      "Data top-up successful!",
      topUp
    );
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while processing data top-up.",
      null
    );
    res.status(500).json(response);
  }
};

module.exports = { topUpData };

const Data = require("../models/Data");
const ApiResponse = require("../dto/responseDto");
const { checkExistingAccount } = require("../function/checkExistingAccount");

const calculateExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

const activateData = async (req, res) => {
  const { accountID, email, dataAmount, price, durationInDays } = req.body;
  try {
    const existingData = await Data.findOne({ accountID, email });
    const existingAccount = checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }

    if (existingData) {
      if (existingData.isActive) {
        const response = new ApiResponse(
          false,
          400,
          "Data package already active.",
          null
        );
        return res.status(400).json(response);
      }
      existingData.activationDate = Date.now();
      existingData.deactivatedDate = null;
      existingData.isActive = true;
      existingData.expiryDate = calculateExpiryDate(
        existingData.durationInDays || 30
      );
      await existingData.save();

      const response = new ApiResponse(
        true,
        200,
        "Data package activated successfully!",
        existingData
      );
      res.status(200).json(response);
    } else {
      const newData = new Data({
        accountID,
        email,
        dataAmount,
        price,
        activationDate: Date.now(),
        expiryDate: calculateExpiryDate(durationInDays),
      });
      await newData.save();

      const response = new ApiResponse(
        true,
        201,
        "Data package created and activated successfully!",
        newData
      );
      res.status(201).json(response);
    }
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while activating data package.",
      null
    );
    res.status(500).json(response);
  }
};

const deactivateData = async (req, res) => {
  const { accountID, email } = req.body;
  try {
    const existingAccount = checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }
    const data = await Data.findOne({ accountID, email });

    if (!data) {
      const response = new ApiResponse(
        false,
        404,
        "Data package not found.",
        null
      );
      return res.status(404).json(response);
    }

    if (!data.isActive) {
      const response = new ApiResponse(
        false,
        400,
        "Data package already inactive.",
        null
      );
      return res.status(400).json(response);
    }

    data.isActive = false;
    data.deactivatedDate = Date.now();
    await data.save();

    const response = new ApiResponse(
      true,
      200,
      "Data package deactivated successfully!",
      data
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while deactivating data package.",
      null
    );
    res.status(500).json(response);
  }
};

module.exports = { activateData, deactivateData };

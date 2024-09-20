const Data = require("../models/Data");
const ApiResponse = require("../dto/responseDto");
const { checkExistingAccount } = require("../functions/checkExistingAccount");
const { decodeToken } = require("../functions/decodeToken");

const calculateExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

const activateData = async (req, res) => {
  const { accountID, email, dataAmount, price, durationInDays, packageID } =
    req.body;
  try {
    const existingAccount = await checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }
    const isDataPackageActive = await Data.findOne({
      accountID,
      packageID,
      isActive: true,
    });

    if (isDataPackageActive) {
      const response = new ApiResponse(
        false,
        400,
        "Data package already active.",
        null
      );
      return res.status(400).json(response);
    }

    const newData = new Data({
      accountID,
      email,
      dataAmount,
      packageID,
      price,
      activationDate: Date.now(),
      expiryDate: calculateExpiryDate(durationInDays || 30),
      isActive: true,
    });

    await newData.save();

    const response = new ApiResponse(
      true,
      201,
      "New data package activated successfully!",
      newData
    );
    res.status(201).json(response);
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
  const { accountID, packageID } = req.body;
  try {
    const existingAccount = checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }
    const data = await Data.findOne({ accountID, packageID});

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

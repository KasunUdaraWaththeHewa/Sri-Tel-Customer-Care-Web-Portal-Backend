const DataTopUp = require("../models/DataTopUp");
const ApiResponse = require("../dto/responseDto");
const { checkExistingAccount } = require("../functions/checkExistingAccount");
const { decodeToken } = require('../functions/decodeToken'); 
const DataTopUpPackage = require("../models/DataTopUpPackage");


const calculateExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

const topUpData = async (req, res) => {
  const { accountID, email, dataAmount, durationInDays, price , packageID} = req.body;
  const existingAccount = checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }

    const isDataTopUpPackage = await DataTopUpPackage.findById(packageID);

    if (!isDataTopUpPackage) {
      const response = new ApiResponse(false, 404, "Data top-up package not found.", null);
      return res.status(404).json(response);
    }

  try {
    const expiryDate = durationInDays
      ? calculateExpiryDate(durationInDays)
      : null;

    const topUp = new DataTopUp({
      packageName : isDataTopUpPackage.name,
      features : isDataTopUpPackage.features,
      description : isDataTopUpPackage.description,
      accountID,
      email,
      dataAmount,
      packageID,
      expiryDate,
      price,
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

const getAllActiveDataTopUps = async (req, res) => {
  const { accountID } = req.params;
  try {
    const dataTopUps = await DataTopUp.find({ isActive: true , accountID });
    const response = new ApiResponse(
      true,
      200,
      "All active data top-ups retrieved.",
      dataTopUps
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while retrieving active data top-ups.",
      null
    );
    res.status(500).json(response);
  }

}

module.exports = { topUpData, getAllActiveDataTopUps };

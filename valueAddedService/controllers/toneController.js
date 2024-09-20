const ToneCatalog = require("../models/ToneCatelog");
const { decodeToken } = require("../functions/decodeToken");
const ApiResponse = require("../dto/responseDto");

const getAvailableTones = async (req, res) => {
  try {
    const tones = await ToneCatalog.find();
    const response = new ApiResponse(
      false,
      200,
      "Available tones fetched",
      tones
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Failed to fetch tones", null);
    res.status(500).json(response);
  }
};

const addToneToCatalog = async (req, res) => {
  const { toneName, toneDescription, price } = req.body;
  try {
    const newTone = new ToneCatalog({ toneName, toneDescription, price });
    await newTone.save();
    const response = new ApiResponse(
      true,
      201,
      "New tone added to catelog",
      null
    );
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Failed to add tone", null);
    res.status(500).json(response);
  }
};

module.exports = { getAvailableTones, addToneToCatalog };

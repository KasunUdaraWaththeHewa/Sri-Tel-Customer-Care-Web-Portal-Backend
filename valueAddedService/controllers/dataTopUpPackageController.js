const DataTopUpPackage = require("../models/DataTopUpPackage");
const ApiResponse = require("../dto/responseDto");
const { decodeToken } = require('../functions/decodeToken'); 


const createDataTopUpPackage = async (req, res) => {
  const { name, description, dataAmount, price, durationInDays, features } = req.body;
  try {
    const package = new DataTopUpPackage({
      name,
      description,
      dataAmount,
      price,
      features,
      durationInDays,
    });

    await package.save();

    const response = new ApiResponse(
      true,
      201,
      "Data top-up package created successfully!",
      package
    );
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while creating data top-up package.",
      null
    );
    res.status(500).json(response);
  }
};

const getAllDataTopUpPackages = async (req, res) => {
  try {
    const packages = await DataTopUpPackage.find();
    const response = new ApiResponse(
      true,
      200,
      "Data top-up packages retrieved successfully!",
      packages
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while retrieving data top-up packages.",
      null
    );
    res.status(500).json(response);
  }
};

const getDataTopUpPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const package = await DataTopUpPackage.findById(id);
    if (!package) {
      const response = new ApiResponse(
        false,
        404,
        "Data top-up package not found",
        null
      );
      return res.status(404).json(response);
    }

    const response = new ApiResponse(
      true,
      200,
      "Data top-up package retrieved successfully!",
      package
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while retrieving data top-up package.",
      null
    );
    res.status(500).json(response);
  }
};

const updateDataTopUpPackage = async (req, res) => {
  const { id } = req.params;
  const { name, description, dataAmount, price, durationInDays, features } = req.body;
  try {
    const package = await DataTopUpPackage.findByIdAndUpdate(
      id,
      { name, description, dataAmount, price, durationInDays, features },
      { new: true }
    );
    if (!package) {
      const response = new ApiResponse(
        false,
        404,
        "Data top-up package not found",
        null
      );
      return res.status(404).json(response);
    }

    const response = new ApiResponse(
      true,
      200,
      "Data top-up package updated successfully!",
      package
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while updating data top-up package.",
      null
    );
    res.status(500).json(response);
  }
};

const deleteDataTopUpPackage = async (req, res) => {
  const { id } = req.params;
  try {
    const package = await DataTopUpPackage.findByIdAndDelete(id);
    if (!package) {
      const response = new ApiResponse(
        false,
        404,
        "Data top-up package not found",
        null
      );
      return res.status(404).json(response);
    }

    const response = new ApiResponse(
      true,
      200,
      "Data top-up package deleted successfully!",
      package
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(
      false,
      500,
      "Server error while deleting data top-up package.",
      null
    );
    res.status(500).json(response);
  }
};

module.exports = {
  createDataTopUpPackage,
  getAllDataTopUpPackages,
  getDataTopUpPackageById,
  updateDataTopUpPackage,
  deleteDataTopUpPackage,
};

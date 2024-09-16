const DataPackage = require("../models/DataPackages");
const ApiResponse = require("../dto/responseDto");

const createDataPackage = async (req, res) => {
  const { name, description, dataAmount, price, durationInDays } = req.body;
  try {
    const dataPackage = new DataPackage({
      name,
      description,
      dataAmount,
      price,
      durationInDays,
    });

    await dataPackage.save();

    const response = new ApiResponse(true, 201, "Data package created successfully!", dataPackage);
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while creating data package.", null);
    res.status(500).json(response);
  }
};

const getAllDataPackages = async (req, res) => {
  try {
    const dataPackages = await DataPackage.find();
    const response = new ApiResponse(true, 200, "Data packages retrieved successfully!", dataPackages);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while retrieving data packages.", null);
    res.status(500).json(response);
  }
};

const getDataPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const dataPackage = await DataPackage.findById(id);
    if (!dataPackage) {
      const response = new ApiResponse(false, 404, "Data package not found", null);
      return res.status(404).json(response);
    }
    const response = new ApiResponse(true, 200, "Data package retrieved successfully!", dataPackage);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while retrieving data package.", null);
    res.status(500).json(response);
  }
};

const updateDataPackage = async (req, res) => {
  const { id } = req.params;
  const { name, description, dataAmount, price, durationInDays } = req.body;
  try {
    const dataPackage = await DataPackage.findByIdAndUpdate(
      id,
      { name, description, dataAmount, price, durationInDays },
      { new: true }
    );
    if (!dataPackage) {
      const response = new ApiResponse(false, 404, "Data package not found", null);
      return res.status(404).json(response);
    }
    const response = new ApiResponse(true, 200, "Data package updated successfully!", dataPackage);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while updating data package.", null);
    res.status(500).json(response);
  }
};

const deleteDataPackage = async (req, res) => {
  const { id } = req.params;
  try {
    const dataPackage = await DataPackage.findByIdAndDelete(id);
    if (!dataPackage) {
      const response = new ApiResponse(false, 404, "Data package not found", null);
      return res.status(404).json(response);
    }
    const response = new ApiResponse(true, 200, "Data package deleted successfully!", dataPackage);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while deleting data package.", null);
    res.status(500).json(response);
  }
};

module.exports = {
  createDataPackage,
  getAllDataPackages,
  getDataPackageById,
  updateDataPackage,
  deleteDataPackage,
};

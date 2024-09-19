const VoicePackage = require("../models/VoicePackages");
const ApiResponse = require("../dto/responseDto");
const { decodeToken } = require('../functions/decodeToken'); 


const createVoicePackage = async (req, res) => {
  const { name, description, talkTime, price, durationInDays , features } = req.body;
  try {
    const voicePackage = new VoicePackage({
      name,
      description,
      features,
      talkTime,
      price,
      durationInDays,
    });

    await voicePackage.save();

    const response = new ApiResponse(true, 201, "Voice package created successfully!", voicePackage);
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while creating voice package.", null);
    res.status(500).json(response);
  }
};

const getAllVoicePackages = async (req, res) => {
  try {
    const voicePackages = await VoicePackage.find();
    const response = new ApiResponse(true, 200, "Voice packages retrieved successfully!", voicePackages);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while retrieving voice packages.", null);
    res.status(500).json(response);
  }
};

const getVoicePackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const voicePackage = await VoicePackage.findById(id);
    if (!voicePackage) {
      const response = new ApiResponse(false, 404, "Voice package not found", null);
      return res.status(404).json(response);
    }
    const response = new ApiResponse(true, 200, "Voice package retrieved successfully!", voicePackage);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while retrieving voice package.", null);
    res.status(500).json(response);
  }
};

const updateVoicePackage = async (req, res) => {
  const { id } = req.params;
  const { name, description, talkTime, price, durationInDays , features } = req.body;
  try {
    const voicePackage = await VoicePackage.findByIdAndUpdate(
      id,
      { name, description, talkTime, price, durationInDays , features },
      { new: true }
    );
    if (!voicePackage) {
      const response = new ApiResponse(false, 404, "Voice package not found", null);
      return res.status(404).json(response);
    }
    const response = new ApiResponse(true, 200, "Voice package updated successfully!", voicePackage);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while updating voice package.", null);
    res.status(500).json(response);
  }
};

const deleteVoicePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const voicePackage = await VoicePackage.findByIdAndDelete(id);
    if (!voicePackage) {
      const response = new ApiResponse(false, 404, "Voice package not found", null);
      return res.status(404).json(response);
    }
    const response = new ApiResponse(true, 200, "Voice package deleted successfully!", voicePackage);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while deleting voice package.", null);
    res.status(500).json(response);
  }
};

module.exports = {
  createVoicePackage,
  getAllVoicePackages,
  getVoicePackageById,
  updateVoicePackage,
  deleteVoicePackage,
};

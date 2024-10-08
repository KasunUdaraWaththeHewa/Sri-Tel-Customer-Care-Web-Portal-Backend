const Voice = require("../models/Voice");
const VoicePackage = require("../models/VoicePackages");
const ApiResponse = require("../dto/responseDto");
const { checkExistingAccount } = require("../functions/checkExistingAccount");
const { decodeToken } = require('../functions/decodeToken'); 


const calculateExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

const activateVoice = async (req, res) => {
  const { accountID, voiceMinutes, price, durationInDays, packageID } = req.body; // Added packageID to identify specific voice package

  try {
    const existingAccount = checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }
    const isVoicePackage = await VoicePackage.findById(packageID);
    if (!isVoicePackage) {
      const response = new ApiResponse(false, 404, "Voice package not found.", null);
      return res.status(404).json(response);
    }

    const existingVoice = await Voice.findOne({ accountID, packageID });

    if (existingVoice) {
      if (existingVoice.isActive) {
        const response = new ApiResponse(true, 200, "This voice package is already active.", null);
        return res.status(200).json(response);
      }

      existingVoice.activationDate = Date.now();
      existingVoice.deactivatedDate = null;
      existingVoice.isActive = true;
      existingVoice.expiryDate = calculateExpiryDate(existingVoice.durationInDays || 30);
      await existingVoice.save();

      const response = new ApiResponse(true, 201, "Voice package activated successfully!", existingVoice);
      return res.status(200).json(response);
    }

    const newVoice = new Voice({
      packageName: isVoicePackage.name,
      features: isVoicePackage.features,
      description: isVoicePackage.description,
      accountID,
      voiceMinutes,
      price,
      packageID,
      activationDate: Date.now(),
      expiryDate: calculateExpiryDate(durationInDays),
      isActive: true,
    });

    await newVoice.save();

    const response = new ApiResponse(true, 201, "New voice package activated successfully!", newVoice);
    res.status(201).json(response);

  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while activating voice package.", null);
    res.status(500).json(response);
  }
};


const deactivateVoice = async (req, res) => {
  const { accountID, packageID } = req.body;
  try {
    const voice = await Voice.findOne({ accountID, packageID });
    
    if (!voice) {
      const response = new ApiResponse(false, 404, "Voice package not found.", null);
      return res.status(404).json(response);
    }
    
    if (!voice.isActive) {
      const response = new ApiResponse(true, 200, "Voice package already inactive.", null);
      return res.status(200).json(response);
    }
    
    voice.isActive = false;
    voice.deactivatedDate = Date.now();
    await voice.save();
    
    const response = new ApiResponse(true, 201, "Voice package deactivated successfully!", voice);
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while deactivating voice package.", null);
    res.status(500).json(response);
  }
};

const getAllActivatedVoice = async (req, res) => {
  const { accountID } = req.params;
  try {
    const voices = await Voice.find({ isActive: true , accountID });
    const response = new ApiResponse(true, 200, "All active voice packages found.", voices);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while fetching active voice packages.", null);
    res.status(500).json(response);
  }
};

module.exports = { activateVoice, deactivateVoice ,getAllActivatedVoice};

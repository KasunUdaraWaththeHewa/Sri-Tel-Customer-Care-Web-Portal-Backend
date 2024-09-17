const Voice = require("../models/Voice");
const ApiResponse = require("../dto/responseDto");
const { checkExistingAccount } = require("../function/checkExistingAccount");

const calculateExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

const activateVoice = async (req, res) => {
  const { accountID, email, voiceMinutes } = req.body;

  try {
    const existingAccount = checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }

    const existingVoice = await Voice.findOne({ accountID, email });
    
    if (existingVoice) {
      if (existingVoice.isActive) {
        const response = new ApiResponse(false, 400, "Voice package already active.", null);
        return res.status(400).json(response);
      }
      existingVoice.activationDate = Date.now();
      existingVoice.deactivatedDate = null;
      existingVoice.isActive = true;
      existingVoice.expiryDate = calculateExpiryDate(existingVoice.durationInDays || 30);
      await existingVoice.save();
      
      const response = new ApiResponse(true, 200, "Voice package activated successfully!", existingVoice);
      res.status(200).json(response);
    } else {
      const newVoice = new Voice({
        accountID,
        email,
        voiceMinutes,
        activationDate: Date.now(),
        expiryDate: calculateExpiryDate(30),
      });
      await newVoice.save();
      
      const response = new ApiResponse(true, 201, "Voice package created and activated successfully!", newVoice);
      res.status(201).json(response);
    }
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while activating voice package.", null);
    res.status(500).json(response);
  }
};

const deactivateVoice = async (req, res) => {
  const { accountID, email } = req.body;
  try {
    const voice = await Voice.findOne({ accountID, email });
    
    if (!voice) {
      const response = new ApiResponse(false, 404, "Voice package not found.", null);
      return res.status(404).json(response);
    }
    
    if (!voice.isActive) {
      const response = new ApiResponse(false, 400, "Voice package already inactive.", null);
      return res.status(400).json(response);
    }
    
    voice.isActive = false;
    voice.deactivatedDate = Date.now();
    await voice.save();
    
    const response = new ApiResponse(true, 200, "Voice package deactivated successfully!", voice);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while deactivating voice package.", null);
    res.status(500).json(response);
  }
};

module.exports = { activateVoice, deactivateVoice };

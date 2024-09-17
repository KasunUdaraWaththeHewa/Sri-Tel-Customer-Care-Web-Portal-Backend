const InternationalRoaming = require("../models/InternationalRoaming");
const ApiResponse = require("../dto/responseDto");
const { checkExistingAccount } = require("../function/checkExistingAccount");

const activateRoaming = async (req, res) => {
  const { email, accountID } = req.body;

  try {
    const existingAccount = checkExistingAccount(accountID);

    if (!existingAccount) {
      const response = new ApiResponse(false, 404, "Account not found.", null);
      return res.status(404).json(response);
    }
    
    let roaming = await InternationalRoaming.findOne({ accountID });

    if (roaming) {
      roaming.roamingStatus = true;
      roaming.activationDate = Date.now();
    } else {
      roaming = new InternationalRoaming({
        accountID,
        email,
        roamingStatus: true,
        activationDate: Date.now(),
      });
    }

    await roaming.save();

    const response = new ApiResponse(true, 201, "International roaming activated successfully!", roaming);
    res.status(201).json(response);

  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while activating roaming.", null);
    res.status(500).json(response);
  }
};

const deactivateRoaming = async (req, res) => {
  const { accountID } = req.body;

  try {
    const roaming = await InternationalRoaming.findOne({ accountID });

    if (!roaming) {
      const response = new ApiResponse(false, 404, "International roaming service not found.", null);
      return res.status(404).json(response);
    }

    roaming.roamingStatus = false;
    roaming.deactivationDate = Date.now();
    await roaming.save();

    const response = new ApiResponse(true, 200, "International roaming deactivated successfully!", roaming);
    res.status(200).json(response);

  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while deactivating roaming.", null);
    res.status(500).json(response);
  }
};

module.exports = { activateRoaming, deactivateRoaming };

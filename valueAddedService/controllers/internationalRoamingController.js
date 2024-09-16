const InternationalRoaming = require('../models/InternationalRoaming');
const ApiResponse = require("../utils/ApiResponse");

const activateRoaming = async (req, res) => {
    const { customerId } = req.body;
    try {
        const roaming = new InternationalRoaming({
            customerId,
            roamingStatus: true,
            activationDate: Date.now(),
        });
        await roaming.save();
        res.status(201).json({ message: "International roaming activated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deactivateRoaming = async (req, res) => {
    const { customerId } = req.body;
    try {
        const roaming = await InternationalRoaming.findOne({ customerId });
        if (!roaming) return res.status(404).json({ message: "Service not found" });
        roaming.roamingStatus = false;
        roaming.deactivationDate = Date.now();
        await roaming.save();
        res.status(200).json({ message: "International roaming deactivated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { activateRoaming, deactivateRoaming };

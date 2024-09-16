const RingTone = require('../models/RingTone');

const personalizeTone = async (req, res) => {
    const { customerId, toneId } = req.body;
    try {
        const tone = new RingTone({
            customerId,
            toneId,
        });
        await tone.save();
        res.status(201).json({ message: "Ring-back tone personalized!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { personalizeTone };

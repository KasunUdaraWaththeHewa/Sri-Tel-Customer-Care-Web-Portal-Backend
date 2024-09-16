const DataTopUp = require('../models/DataTopUp');

const topUpData = async (req, res) => {
    const { customerId, dataAmount } = req.body;
    try {
        const topUp = new DataTopUp({
            customerId,
            dataAmount,
        });
        await topUp.save();
        res.status(201).json({ message: "Data top-up successful!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { topUpData };

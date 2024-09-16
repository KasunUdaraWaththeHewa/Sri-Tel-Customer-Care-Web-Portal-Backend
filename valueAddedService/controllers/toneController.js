const ToneCatalog = require("../models/ToneCatalog");

const getAvailableTones = async (req, res) => {
  try {
    const tones = await ToneCatalog.find();
    res.json(tones);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tones" });
  }
};

const addToneToCatalog = async (req, res) => {
  const { toneId, toneName, toneDescription, price } = req.body;
  try {
    const newTone = new ToneCatalog({ toneId, toneName, toneDescription, price });
    await newTone.save();
    res.status(201).json(newTone);
  } catch (error) {
    res.status(400).json({ error: "Failed to add tone" });
  }
};

module.exports = { getAvailableTones, addToneToCatalog };

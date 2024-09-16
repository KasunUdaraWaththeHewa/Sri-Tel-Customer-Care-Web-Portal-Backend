const mongoose = require('mongoose');

const RingToneSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    toneId: { type: String, required: true }, // Reference to a tone catalog
    activationDate: { type: Date, default: Date.now },
    expiryDate: { type: Date } // Optional for temporary tones
}, { timestamps: true });

module.exports = mongoose.model('RingTone', RingToneSchema);

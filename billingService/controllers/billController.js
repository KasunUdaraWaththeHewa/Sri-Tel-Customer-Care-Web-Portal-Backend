const Bill = require('../models/billModel');

exports.getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find();
        res.status(200).json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBillById = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.status(200).json(bill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBill = async (req, res) => {
    try {
        const newBill = new Bill(req.body);
        await newBill.save();
        res.status(201).json(newBill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.status(200).json(bill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

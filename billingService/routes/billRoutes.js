const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// Define routes for bills
router.get('/', billController.getAllBills);
router.get('/:id', billController.getBillById);
router.post('/', billController.createBill);
router.put('/:id', billController.updateBill);
router.delete('/:id', billController.deleteBill);

module.exports = router;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillSchema = new Schema({
    billNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerID: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Pending'],
        default: 'Unpaid'
    },
    items: [{
        itemID: String,
        description: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number
    }],
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'Cash', 'Online'],
        required: false
    },
    paymentDate: {
        type: Date,
        required: false
    },
    notes: {
        type: String,
        required: false
    }
});

const Bill = mongoose.model('Bill', BillSchema);

module.exports = Bill;

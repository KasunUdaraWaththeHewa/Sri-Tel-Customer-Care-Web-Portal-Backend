const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    accountID: {
        type: String,
        required: true,
        unique: true
    },
    accountType: {
        type: String,
        enum: ['Prepaid', 'Postpaid'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active'
    },
    services: [{
        serviceID: String,
        serviceName: String,
        activationDate: Date,
        deactivationDate: Date
    }],
    billingInfo: {
        lastPaymentDate: {
            type: Date,
            required: false
        },
        totalOutstanding: {
            type: Number,
            required: false
        }
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

const CustomerSchema = new Schema({
    customerID: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    accounts: [AccountSchema],
    passwordHash: {
        type: String,
        required: true
    }
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;

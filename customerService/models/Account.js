const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  number: {
    type: String,
    required: [true, "Account number is required"],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[0-9]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid account number!`,
    },
  },
  userID: {
    type: String,
    required: [true, "User ID is required"],
  },
  accountType: {
    type: String,
    enum: ["Prepaid", "Postpaid"],
    required: [true, "Account type is required"],
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active",
  },
  billingInfo: {
    lastPaymentDate: {
      type: Date,
    },
    totalOutstanding: {
      type: Number,
      min: [0, "Total outstanding must be a positive number"],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;

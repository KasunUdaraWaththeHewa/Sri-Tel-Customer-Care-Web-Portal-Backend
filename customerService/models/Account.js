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
    required: true,
    unique: true,
    // validate: {
    //   validator: function (v) {
    //     return validator.isMobilePhone(v, "any", { strictMode: false });
    //   },
    //   message: "Invalid phone number",
    // },
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
      default: null,
    },
    totalOutstanding: {
      type: Number,
      min: [0, "Total outstanding must be a positive number"],
      default: 0,
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

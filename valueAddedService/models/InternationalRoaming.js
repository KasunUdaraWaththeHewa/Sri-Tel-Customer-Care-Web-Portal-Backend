const mongoose = require("mongoose");

const InternationalRoamingSchema = new mongoose.Schema(
  {
    accountID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    roamingStatus: {
      type: Boolean,
      default: false, // true = active, false = inactive
    },
    activationDate: {
      type: Date,
    },
    deactivationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InternationalRoaming",
  InternationalRoamingSchema
);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");
const sendEmail = require("../functions/sendMail");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email format"],
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: (v) => !v || v <= new Date(),
      message: "Invalid or future date for date of birth.",
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isMobilePhone(v, "any", { strictMode: false });
      },
      message: "Invalid phone number",
    },
  },
  address: {
    type: String,
    required: false,
  },
  nic: {
    type: String,
    required: false,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["customer", "admin", "staff"],
    default: "customer",
  },
  status: {
    type: String,
    required: false,
    default: "active",
    enum: ["active", "inactive"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpires: {
    type: Date,
    required: false,
  },
});

// Signup Method
userSchema.statics.signup = async function ({
  email,
  password,
  fullName,
  dateOfBirth,
  role = "customer",
  phoneNumber,
  address,
  nic,
}) {
  // Validation for mandatory fields
  if (!email || !password || !fullName) {
    throw Error("Email, password, and full name are required.");
  }

  // Email validation
  if (!validator.isEmail(email)) {
    throw Error("Invalid email format.");
  }

  // // Password strength check
  // if (!validator.isStrongPassword(password)) {
  //   throw Error(
  //     "Password is not strong enough. It must include uppercase, lowercase, numbers, and special characters."
  //   );
  // }

  // Check if email already exists
  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error("Email already exists.");
  }

  const phoneExists = await this.findOne({ phoneNumber });
  if (phoneExists) {
    throw new Error("Phone number already exists.");
  }

  const nicExists = await this.findOne({ nic });
  if (nicExists) {
    throw new Error("NIC already exists.");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create the new user
  const user = await this.create({
    email,
    password: hash,
    fullName,
    dateOfBirth,
    phoneNumber,
    address,
    nic,
    role,
  });

  return user;
};

userSchema.statics.login = async function ({ email, password }) {
  if (!email || !password) {
    throw new Error("All fields must be filled.");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Incorrect Email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect Password");
  }
  return user;
};

userSchema.statics.changePassword = async function ({
  email,
  currentPassword,
  newPassword,
  confirmNewPassword,
}) {
  if (!email || !currentPassword || !newPassword || !confirmNewPassword) {
    throw new Error("All fields must be filled.");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found.");
  }

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    throw new Error("Incorrect current password.");
  }

  if (currentPassword === newPassword) {
    throw new Error(
      "New password should be different from the current password."
    );
  }

  if (newPassword !== confirmNewPassword) {
    throw new Error("New passwords don't match.");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  user.password = hash;
  await user.save();

  return user;
};

userSchema.statics.forgotPassword = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("No account with that email found.");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour expiration

  await user.save();
  // Send the token to the user's email (mock function, replace with actual implementation)
  sendResetTokenEmail(user.email, resetToken);

  return resetToken;
};

userSchema.statics.resetPassword = async function (
  resetToken,
  newPassword,
  email
) {
  const user1 = await this.findOne({ email });
  if (!user1) {
    throw new Error("Invalid Email");
  }
  const user = await this.findOne({
    resetToken,
    resetTokenExpires: { $gt: Date.now() },
    email,
  });
  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  user.password = hash;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();

  return user;
};

const sendResetTokenEmail = (email, resetToken) => {
  console.log("RESET TOKEN: ", resetToken);
  sendEmail({
    email,
    subject: "Password Reset Token",
    message: `Your password reset token is: ${resetToken}`,
  });
};

module.exports = mongoose.model("User", userSchema);

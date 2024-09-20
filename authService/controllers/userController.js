const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const ApiResponse = require("../dto/responseDto");
const axios = require("axios");
const { decodeToken } = require("../functions/decodeToken");

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
    algorithm: "HS256",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login({ email, password });

    if (user.status === "inactive") {
      const response = new ApiResponse(
        false,
        403,
        "Account is deactivated. Please activate your account first",
        null
      );
      return res.status(403).json(response);
    }

    const token = createToken(user._id, user.role);
    const response = new ApiResponse(true, 200, "Login successful", {
      email,
      token,
      role: user.role,
      fullName: user.fullName,
    });
    res.status(200).json(response);
  } catch (err) {
    const response = new ApiResponse(false, 400, err.message, null);
    res.status(400).json(response);
  }
};

const signupUser = async (req, res) => {
  const {
    email,
    password,
    fullName,
    dateOfBirth,
    phoneNumber,
    address,
    nic,
    role,
  } = req.body;
  try {
    const user = await User.signup({
      email,
      password,
      fullName,
      dateOfBirth,
      phoneNumber,
      address,
      nic,
      role,
    });
    const token = createToken(user._id, user.role);
    console.log("token at signup in auth: " + token);

    const accountPayload = {
      email: user.email,
      number: user.phoneNumber,
      userID: user._id,
      accountType: "Postpaid",
    };
    const customerServiceURL = "http://bff:4901/api/proxy/forward/customer/";
    const customerResponse = await axios.post(
      customerServiceURL,
      accountPayload,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (customerResponse.status === 201) {
      console.log("Signup successful");
      const response = new ApiResponse(
        true,
        200,
        "Signup successful",
        customerResponse.data.data
      );
      res.status(200).json(response);
      return;
    }
    const response = new ApiResponse(false, 400, "Signup failed", null);
    res.status(400).json(response);
    return;
  } catch (err) {
    const response = new ApiResponse(false, 400, err.message, null);
    res.status(400).json(response);
    return;
  }
};

const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.changePassword({
      email,
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    const token = createToken(user._id, user.role);
    const response = new ApiResponse(
      true,
      200,
      "Password changed successfully",
      { email, token }
    );
    res.status(200).json(response);
  } catch (err) {
    const response = new ApiResponse(false, 400, err.message, null);
    res.status(400).json(response);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await User.forgotPassword(email);
    const response = new ApiResponse(
      true,
      200,
      "Password reset token sent to email",
      null
    );
    res.status(200).json(response);
  } catch (err) {
    const response = new ApiResponse(false, 400, err.message, null);
    res.status(400).json(response);
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword, email } = req.body;
  try {
    const user = await User.resetPassword(resetToken, newPassword, email);
    if (!user) {
      const response = new ApiResponse(
        false,
        400,
        "Invalid reset token or email",
        null
      );
      res.status(400).json(response);
      return;
    }
    const token = createToken(user._id, user.role);
    const response = new ApiResponse(true, 200, "Password reset successful", {
      email: user.email,
      token,
    });
    res.status(200).json(response);
  } catch (err) {
    const response = new ApiResponse(false, 400, err.message, null);
    res.status(400).json(response);
  }
};

const getProfileDetails = async (req, res) => {
  const id = decodeToken(req.headers.authorization)._id;

  try {
    const user = await User.findById(id);

    if (!user) {
      const response = new ApiResponse(false, 404, "User not found", null);
      return res.status(404).json(response);
      return;
    }

    const response = new ApiResponse(
      true,
      200,
      "User details fetched successfully",
      {
        email: user.email,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        phoneNumber: user.phoneNumber,
        address: user.address,
        nic: user.nic,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    );
    res.status(200).json(response);
    return;
  } catch (err) {
    const response = new ApiResponse(
      false,
      500,
      "An error occurred while fetching user details",
      null
    );
    res.status(500).json(response);
    return;
  }
};

const editProfileDetails = async (req, res) => {
  const { email, fullName, dateOfBirth, phoneNumber, address, nic } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const response = new ApiResponse(false, 404, "User not found", null);
      return res.status(404).json(response);
    }

    const isExistingNumber = await User.findOne({ phoneNumber });
    if (isExistingNumber) {
      const response = new ApiResponse(
        false,
        400,
        "Account with this number already exists.",
        null
      );
      res.status(400).json(response);
      return;
    }

    const isExistingNIC = await User.findOne({ nic });
    if (isExistingNIC) {
      const response = new ApiResponse(
        false,
        400,
        "Account with this NIC already exists.",
        null
      );
      res.status(400).json(response);
      return;
    }

    if (fullName) user.fullName = fullName;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (nic) user.nic = nic;

    user.updatedAt = Date.now();
    await user.save();

    const response = new ApiResponse(
      true,
      200,
      "Profile updated successfully",
      {
        email: user.email,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        phoneNumber: user.phoneNumber,
        address: user.address,
        nic: user.nic,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    );
    res.status(200).json(response);
  } catch (err) {
    const response = new ApiResponse(
      false,
      500,
      "An error occurred while updating profile details",
      null
    );
    res.status(500).json(response);
  }
};

const deactivateAccount = async (req, res) => {
  const { id } = req.params;
  console.log("id: " + id);

  try {
    const user = await User.findById(id);
    console.log("user: " + user);
    if (!user) {
      const response = new ApiResponse(false, 404, "User not found", null);
      return res.status(404).json(response);
    }

    if (user.status === "inactive") {
      const response = new ApiResponse(
        false,
        400,
        "Account is already inactive",
        null
      );
      return res.status(400).json(response);
    }

    user.status = "inactive";
    user.updatedAt = Date.now();
    await user.save();
    const response = new ApiResponse(
      true,
      200,
      "Account deactivated successfully",
      null
    );
    res.status(200).json(response);
  } catch (err) {
    const response = new ApiResponse(
      false,
      500,
      "An error occurred while deactivating the account",
      null
    );
    res.status(500).json(response);
  }
};

const activateAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      const response = new ApiResponse(false, 404, "User not found", null);
      return res.status(404).json(response);
    }

    if (user.status === "active") {
      const response = new ApiResponse(
        false,
        400,
        "Account is already active",
        null
      );
      return res.status(400).json(response);
    }

    user.status = "active";
    user.updatedAt = Date.now();
    await user.save();

    const response = new ApiResponse(
      true,
      200,
      "Account activated successfully",
      null
    );
    res.status(200).json(response);
  } catch (err) {
    const response = new ApiResponse(
      false,
      500,
      "An error occurred while activating the account",
      null
    );
    res.status(500).json(response);
  }
};

const isInActiveUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      const response = new ApiResponse(false, 404, "User not found", null);
      return res.status(404).json(response);
    }

    if (user.status === "inactive") {
      const response = new ApiResponse(true, 200, "User is inactive", null);
      return res.status(200).json(response);
    }
    const response = new ApiResponse(false, 400, "User is active", null);
    return res.status(400).json(response);
  } catch (err) {
    const response = new ApiResponse(
      false,
      500,
      "An error occurred while checking the account status",
      null
    );
    res.status(500).json(response);
  }
};

module.exports = {
  signupUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getProfileDetails,
  editProfileDetails,
  deactivateAccount,
  activateAccount,
  isInActiveUser,
};

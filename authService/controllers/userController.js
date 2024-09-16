const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const createToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: '3d' });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login({ email, password });
        const token = createToken(user._id, user.role);
        const role = user.role;
        const fullName = user.fullName;
        res.status(200).json({ email, token, role, fullName });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const signupUser = async (req, res) => {
    const { email, password, fullName, dateOfBirth, phoneNumber, address, nic } = req.body;

    try {
        const user = await User.signup({
            email,
            password,
            fullName,
            dateOfBirth,
            phoneNumber,
            address,
            nic,
        });

        const token = createToken(user._id, user.role);
        res.status(200).json({ email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
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
        res.status(200).json({ email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const resetToken = await User.forgotPassword(email);
      //model eken mail eka send krnw
      res.status(200).json({ message: "Password reset token sent to email." });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;
    try {
      const user = await User.resetPassword(resetToken, newPassword);
      const token = createToken(user._id, user.role);
      res.status(200).json({ email: user.email, token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  const getProfileDetails = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.status(200).json({
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
      });
    } catch (err) {
      res.status(500).json({ error: "An error occurred while fetching user details." });
    }
  };

  const editProfileDetails = async (req, res) => {
    const { email, fullName, dateOfBirth, phoneNumber, address, nic } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      if (fullName) user.fullName = fullName;
      if (dateOfBirth) user.dateOfBirth = dateOfBirth;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (address) user.address = address;
      if (nic) user.nic = nic;
  
      user.updatedAt = Date.now();
      await user.save();
  
      res.status(200).json({
        message: "Profile updated successfully.",
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
      });
    } catch (err) {
      res.status(500).json({ error: "An error occurred while updating profile details." });
    }
  };
  
  const deactivateAccount = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      if (user.status === 'inactive') {
        return res.status(400).json({ message: "Account is already inactive." });
      }
  
      user.status = 'inactive';
      user.updatedAt = Date.now();
      await user.save();
  
      res.status(200).json({ message: "Account deactivated successfully." });
    } catch (err) {
      res.status(500).json({ error: "An error occurred while deactivating the account." });
    }
  };

  const activateAccount = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      if (user.status === 'active') {
        return res.status(400).json({ message: "Account is already active." });
      }
  
      user.status = 'active';
      user.updatedAt = Date.now();
      await user.save();
  
      res.status(200).json({ message: "Account activated successfully." });
    } catch (err) {
      res.status(500).json({ error: "An error occurred while activating the account." });
    }
  };
  

  
  
  module.exports = { signupUser, loginUser, changePassword, forgotPassword, resetPassword, getProfileDetails , editProfileDetails , deactivateAccount , activateAccount};

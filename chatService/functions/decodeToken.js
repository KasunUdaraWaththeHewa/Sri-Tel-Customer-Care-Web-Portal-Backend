const jwt = require("jsonwebtoken");

const decodeToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET_KEY; 
    const decoded = jwt.verify(token, secret); 
    return decoded; // This contains user_id, role, and any other token data
  } catch (error) {
    console.error("Error decoding token: ", error.message);
    return null; 
  }
};

module.exports = { decodeToken };


//usage
// const decodeToken = require('../functions/decodeToken'); // Import the decode function

// const createAccount = async (req, res) => {
//   const token = req.headers.authorization;
//   const decodedToken = decodeToken(token); // Decode the token

//   const userId = decodedToken._id; // Extract the user ID
//   const userRole = decodedToken.role; // Extract the role

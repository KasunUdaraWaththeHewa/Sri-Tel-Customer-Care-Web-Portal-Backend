const axios = require("axios");

const checkExistingUser = async (email) => {
  const authServiceUrl = `http://localhost:4901/api/proxy/forward/auth/getProfileDetails/${email}`;
  const authResponse = await axios.get(authServiceUrl);
  return authResponse;
};

module.exports = { checkExistingUser };
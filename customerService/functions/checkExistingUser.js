const axios = require("axios");

const checkExistingUser = async (email) => {
  const authServiceUrl = `${process.env.AUTH_SERVICE_URL}/api/customers/${accountID}`;
  const authResponse = await axios.get(authServiceUrl);
  return authResponse;
};

module.exports = { checkExistingUser };
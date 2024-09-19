const axios = require("axios");

const checkExistingAccount = async (accountID) => {
  const customerServiceUrl = `http://bff:4901/api/proxy/forward/customer/check/${accountID}`;
  const customerResponse = await axios.get(customerServiceUrl);
  return customerResponse.data;
};

module.exports = { checkExistingAccount };

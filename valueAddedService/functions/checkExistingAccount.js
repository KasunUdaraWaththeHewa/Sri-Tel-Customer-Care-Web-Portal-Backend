const axios = require("axios");

const checkExistingAccount = async (accountID) => {
  const customerServiceUrl = `${process.env.CUSTOMER_SERVICE_URL}/api/customers/${accountID}`;
  const customerResponse = await axios.get(customerServiceUrl);
  return customerResponse;
};

module.exports = { checkExistingAccount };

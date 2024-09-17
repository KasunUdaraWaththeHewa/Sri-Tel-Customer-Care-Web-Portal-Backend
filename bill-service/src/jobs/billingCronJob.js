const cron = require("node-cron");
const axios = require("axios");
const Bill = require("../models/Bill");

// Cron job to run at the end of every month (last day at 11:59 PM)
const startBillingCronJob = () => {
  cron.schedule(
    "59 23 28-31 * *",
    async () => {
      try {
        // Check if it's the last day of the month
        const today = new Date();
        const lastDay = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();

        if (today.getDate() === lastDay) {
          console.log("Running monthly billing job...");

          // Fetch all accounts from the BFF (Customer Service via proxy)
          const customerServiceUrl =
            "http://bff-service-url/api/proxy/forward/customer/accounts"; // Replace with actual endpoint
          const accountsResponse = await axios.get(customerServiceUrl, {
            headers: { Authorization: "Bearer your_jwt_token" }, // Provide the appropriate JWT token
          });
          const accounts = accountsResponse.data.data; // Assuming BFF returns accounts in the "data" field

          for (const account of accounts) {
            // Fetch subscribed services from the Value-Added Service (via BFF proxy)
            const valueAddedServiceUrl = `http://bff-service-url/api/proxy/forward/value-added/services/${account._id}`; // Replace with actual endpoint
            const servicesResponse = await axios.get(valueAddedServiceUrl, {
              headers: { Authorization: "Bearer your_jwt_token" }, // Provide the appropriate JWT token
            });
            const subscribedServices = servicesResponse.data.data; // Assuming services data is in "data" field

            // Calculate the total bill amount based on the subscribed services
            const amount = calculateBillingAmount(subscribedServices);

            // Create a new bill for the account
            const newBill = new Bill({
              accountId: account._id,
              amount,
              dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 15), // Due on the 15th of the next month
              billDate: today,
              status: "Unpaid",
            });

            // Save the new bill to the database
            await newBill.save();
            console.log(`Bill generated for account ${account._id}`);
          }

          console.log("Monthly billing job completed.");
        }
      } catch (error) {
        console.error("Error in monthly billing job: ", error);
      }
    },
    {
      timezone: "UTC",
    }
  );
};

// Custom billing amount calculation function
function calculateBillingAmount(subscribedServices) {
  let totalAmount = 0;
  for (const service of subscribedServices) {
    totalAmount += service.price; // Assuming each service has a price field
  }
  return totalAmount;
}

module.exports = { startBillingCronJob };

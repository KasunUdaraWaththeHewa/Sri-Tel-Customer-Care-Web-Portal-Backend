const cron = require("node-cron");
const axios = require("axios");
const Bill = require("../models/Bill");

// Function to run the billing logic
const runBillingJob = async () => {
  try {
    // Check if it's the last day of the month
    const today = new Date();
    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    // if (today.getDate() === lastDay) {
    if (true) {
      console.log("Running monthly billing job...");

      // Fetch all accounts from the BFF (Customer Service via proxy)
      const customerServiceUrl = "http://bff:4901/api/proxy/forward/customer"; // Replace with actual endpoint
      const accountsResponse = await axios.get(customerServiceUrl, {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGY3YTdlMWI0ZTRhN2YyZDhjOGM0YjQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjY1NzE2NzIsImV4cCI6MjY3MzI5OTY3Mn0.QpKKDpMZ4bH7kXAHxGob_Vg7I3dLL0ogBxRdb-qfBp4",
        }, // Provide the appropriate JWT token
      });

      console.log("Accounts response:", accountsResponse.data);

      const accounts = accountsResponse.data.data; // Assuming BFF returns accounts in the "data" field
      // Filter out inactive accounts
      const activeAccounts = accounts.filter(
        (account) => account.status === "Active"
      );

      console.log("Active accounts:", activeAccounts);

      // // Filter out services that have been deactivated
      // activeAccounts.forEach((account) => {
      //   account.services = account.services.filter(
      //     (service) => !service.deactivationDate
      //   );
      //   console.log(
      //     `Active services for account ${account._id}:`,
      //     account.services
      //   );
      // });

      // for (const account of accounts) {
      //   // Fetch subscribed services from the Value-Added Service (via BFF proxy)
      //   const valueAddedServiceUrl = `http://bff-service-url/api/proxy/forward/value-added/services/${account._id}`; // Replace with actual endpoint
      //   const servicesResponse = await axios.get(valueAddedServiceUrl, {
      //     headers: { Authorization: "Bearer your_jwt_token" }, // Provide the appropriate JWT token
      //   });
      //   const subscribedServices = servicesResponse.data.data; // Assuming services data is in "data" field

      //   // Calculate the total bill amount based on the subscribed services
      //   const amount = calculateBillingAmount(subscribedServices);

      //   // Create a new bill for the account
      //   const newBill = new Bill({
      //     accountId: account._id,
      //     amount,
      //     dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 15), // Due on the 15th of the next month
      //     billDate: today,
      //     status: "Unpaid",
      //   });

      //   // Save the new bill to the database
      //   await newBill.save();
      //   console.log(`Bill generated for account ${account._id}`);
      // }

      console.log("Monthly billing job completed.");
    }
  } catch (error) {
    console.error("Error in monthly billing job: ", error);
  }
};

// Cron job to run at the end of every month (last day at 11:59 PM)
const startBillingCronJob = () => {
  cron.schedule("59 23 28-31 * *", runBillingJob, {
    timezone: "UTC",
  });
};

// Custom billing amount calculation function
function calculateBillingAmount(subscribedServices) {
  let totalAmount = 0;
  for (const service of subscribedServices) {
    totalAmount += service.price; // Assuming each service has a price field
  }
  return totalAmount;
}

// Export the cron job starter and the manual run function
module.exports = { startBillingCronJob, runBillingJob };

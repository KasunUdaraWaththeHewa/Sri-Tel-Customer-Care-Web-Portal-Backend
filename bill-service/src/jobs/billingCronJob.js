const cron = require("node-cron");
const axios = require("axios");
const Bill = require("../models/Bill");

// Function to run the billing logic
const runBillingJob = async () => {
  try {
    // Check if it's the last day of the month
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setMonth(today.getMonth() + 1);
    if (dueDate.getMonth() === 0) {
      // Handles case when moving from December to January
      dueDate.setFullYear(today.getFullYear() + 1);
    }
    dueDate.setDate(15); // Set due date to 15th of the next month

    dueDate.setMonth(today.getMonth() + 1);
    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    // if (today.getDate() === lastDay) {
    if (today.getDate() === lastDay) {
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

      // Iterate over each active account to fetch and calculate the total billing amount
      for (const account of activeAccounts) {
        try {
          const billingUrl = `http://bff:4901/api/proxy/forward/value-added/billing/${account._id}`;
          const billingResponse = await axios.get(billingUrl, {
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGY3YTdlMWI0ZTRhN2YyZDhjOGM0YjQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjY1NzE2NzIsImV4cCI6MjY3MzI5OTY3Mn0.QpKKDpMZ4bH7kXAHxGob_Vg7I3dLL0ogBxRdb-qfBp4",
            }, // Provide the appropriate JWT token
          });

          const totalBillingAmount = billingResponse.data.totalBillingAmount;

          console.log(
            `Total billing amount for account ${account._id}: ${totalBillingAmount}`
          );

          // Save the billing information to the database
          const newBill = new Bill({
            accountId: account._id,
            amount: totalBillingAmount,
            billDate: today,
            dueDate: dueDate,
          });

          await newBill.save();
          console.log(`Billing information saved for account ${account._id}`);
        } catch (error) {
          console.error(
            `Error fetching billing amount for account ${account._id}: `,
            error
          );
        }
      }

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

// Export the cron job starter and the manual run function
module.exports = { startBillingCronJob, runBillingJob };

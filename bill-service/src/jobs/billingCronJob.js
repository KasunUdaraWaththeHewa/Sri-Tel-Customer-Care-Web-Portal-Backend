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

          // Fetch all accounts from the BFF via HTTP request
          const bffUrl = "http://bff-service-url/api/accounts"; // Replace with the actual BFF URL
          const response = await axios.get(bffUrl);

          const accounts = response.data; // Assuming BFF returns the accounts as an array
          console.log(`Fetched ${accounts.length} accounts from BFF.`);

          for (const account of accounts) {
            // Define your billing logic
            const amount = calculateBillingAmount(account); // Custom function to calculate the amount

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

// Custom billing amount calculation function (modify as needed)
function calculateBillingAmount(account) {
  // Example: return a default amount, or calculate based on account data
  return 100.0; // Default bill amount for example
}

module.exports = { startBillingCronJob };

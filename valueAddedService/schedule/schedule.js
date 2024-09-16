const cron = require("node-cron");
const {
  expireData,
  expireVoice,
  expireDataTopUp,
  expireRingTone,
  expireSubscriptionBased,
} = require("../function/scheduledFunctions");

function schedule() {
  cron.schedule("0 0 0 * * *", async () => {
    expireData();
    expireVoice();
    expireDataTopUp();
    expireRingTone();
    expireSubscriptionBased();
  });
}

module.exports = schedule;

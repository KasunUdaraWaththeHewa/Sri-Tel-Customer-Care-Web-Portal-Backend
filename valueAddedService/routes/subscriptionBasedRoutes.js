const express = require("express");
const {
  activateSubscription,
  deactivateSubscription,
  getAllActiveSubscriptions,
} = require("../controllers/subscriptionBasedController");

const router = express.Router();

router.post("/activate-subscription", activateSubscription);
router.post("/deactivate-subscription", deactivateSubscription);
router.get("/active-subscriptions/:accountID", getAllActiveSubscriptions);

module.exports = router;

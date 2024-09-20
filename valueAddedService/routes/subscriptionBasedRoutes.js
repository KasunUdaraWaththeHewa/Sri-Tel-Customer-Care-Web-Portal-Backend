const express = require('express');
const { activateSubscription, deactivateSubscription } = require('../controllers/subscriptionBasedController');
const router = express.Router();

router.put('/activate-subscription', activateSubscription);
router.put('/deactivate-subscription', deactivateSubscription);
router.get('/active-subscriptions/:accountID', getAllActiveSubscriptions);

module.exports = router;

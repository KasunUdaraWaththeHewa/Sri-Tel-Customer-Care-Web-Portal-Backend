const express = require('express');
const { activateSubscription, deactivateSubscription } = require('../controllers/subscriptionBasedController');
const router = express.Router();

router.put('/activate-subscription', activateSubscription);
router.put('/deactivate-subscription', deactivateSubscription);

module.exports = router;

const express = require('express');
const { topUpData } = require('../controllers/dataTopUpController');
const router = express.Router();

router.post('/top-up', topUpData);

module.exports = router;

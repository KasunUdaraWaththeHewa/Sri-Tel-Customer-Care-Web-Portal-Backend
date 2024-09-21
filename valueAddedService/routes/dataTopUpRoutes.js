const express = require('express');
const { topUpData, getAllActiveDataTopUps } = require('../controllers/dataTopUpController');
const router = express.Router();

router.post('/top-up', topUpData);
router.get('/active-data-top-ups/:accountID', getAllActiveDataTopUps);


module.exports = router;

const express = require('express');
const { personalizeTone } = require('../controllers/ringToneController');
const router = express.Router();

router.post('/personalize-tone', personalizeTone);

module.exports = router;

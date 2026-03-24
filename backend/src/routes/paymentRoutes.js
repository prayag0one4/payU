const express = require('express');
const { webhook } = require('../controllers/paymentController');

const router = express.Router();

// Webhook needs raw body for HMAC verification
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

module.exports = router;

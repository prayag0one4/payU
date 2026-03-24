const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getTransactions } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', authMiddleware, getTransactions);

module.exports = router;

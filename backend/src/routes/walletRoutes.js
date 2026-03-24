const express = require('express');
const authMiddleware = require('../middleware/auth');
const { addMoney, transfer } = require('../controllers/walletController');

const router = express.Router();

router.post('/add-money', authMiddleware, addMoney);
router.post('/transfer', authMiddleware, transfer);

module.exports = router;

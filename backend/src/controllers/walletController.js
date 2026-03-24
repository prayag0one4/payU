const walletService = require('../services/walletService');

const addMoney = async (req, res, next) => {
    try {
        const { amount } = req.body;
        if (!amount) return res.status(400).json({ success: false, message: 'Amount is required.' });
        const result = await walletService.addMoney(req.userId, parseFloat(amount));
        res.status(200).json({ success: true, message: result.message, data: result });
    } catch (err) {
        next(err);
    }
};

const transfer = async (req, res, next) => {
    try {
        const { recipientEmail, amount, note } = req.body;
        if (!recipientEmail || !amount) {
            return res.status(400).json({ success: false, message: 'Recipient email and amount are required.' });
        }
        const result = await walletService.transfer(req.userId, {
            recipientEmail,
            amount: parseFloat(amount),
            note,
        });
        res.status(200).json({ success: true, message: 'Transfer successful.', data: result });
    } catch (err) {
        next(err);
    }
};

module.exports = { addMoney, transfer };

const transactionService = require('../services/transactionService');

const getTransactions = async (req, res, next) => {
    try {
        const { page, limit, type, status } = req.query;
        const result = await transactionService.getTransactions(req.userId, { page, limit, type, status });
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

module.exports = { getTransactions };

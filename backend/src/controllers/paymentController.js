const paymentService = require('../services/paymentService');

/**
 * Webhook must receive raw body for HMAC verification.
 * Express must be configured with express.raw() on this route.
 */
const webhook = async (req, res, next) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        if (!signature) {
            return res.status(400).json({ success: false, message: 'Missing signature header.' });
        }
        const rawBody = req.body; // raw Buffer
        const result = await paymentService.handleWebhook(rawBody, signature);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

module.exports = { webhook };

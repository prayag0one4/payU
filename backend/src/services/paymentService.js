const crypto = require('crypto');
const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

/**
 * Verify Razorpay webhook signature and update transaction + balance.
 */
const handleWebhook = async (rawBody, signature) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Verify HMAC-SHA256 signature
    const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

    if (expectedSig !== signature) {
        throw new AppError('Invalid webhook signature.', 400);
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured') {
        const payment = payload.payload.payment.entity;
        const orderId = payment.order_id;
        const paymentId = payment.id;

        // Find the pending transaction
        const transaction = await prisma.transaction.findFirst({
            where: { razorpayOrderId: orderId, status: 'PENDING', type: 'ADD_MONEY' },
        });
        if (!transaction) {
            console.warn(`[Webhook] No pending transaction found for order: ${orderId}`);
            return { received: true };
        }

        // Atomic: update balance + mark success
        await prisma.$transaction(async (tx) => {
            await tx.transaction.update({
                where: { id: transaction.id },
                data: { status: 'SUCCESS', razorpayPaymentId: paymentId },
            });

            await tx.account.update({
                where: { userId: transaction.receiverId },
                data: { balance: { increment: transaction.amount } },
            });
        });

        console.log(`[Webhook] Payment captured: ${paymentId} for order: ${orderId}`);
    }

    if (event === 'payment.failed') {
        const payment = payload.payload.payment.entity;
        const orderId = payment.order_id;

        await prisma.transaction.updateMany({
            where: { razorpayOrderId: orderId, status: 'PENDING' },
            data: { status: 'FAILED' },
        });

        console.log(`[Webhook] Payment failed for order: ${orderId}`);
    }

    return { received: true };
};

module.exports = { handleWebhook };

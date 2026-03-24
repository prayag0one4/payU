const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

/**
 * Simulate adding money — directly credits wallet balance.
 * No payment gateway. Just validates amount and updates balance.
 */
const addMoney = async (userId, amount) => {
    if (!amount || amount <= 0) throw new AppError('Amount must be greater than 0.', 400);
    if (amount > 500000) throw new AppError('Maximum add money limit is ₹5,00,000.', 400);

    let transaction;

    await prisma.$transaction(async (tx) => {
        // Credit the user's wallet
        await tx.account.update({
            where: { userId },
            data: { balance: { increment: amount } },
        });

        // Record transaction as SUCCESS immediately (simulated)
        transaction = await tx.transaction.create({
            data: {
                receiverId: userId,
                amount,
                type: 'ADD_MONEY',
                status: 'SUCCESS',
            },
        });
    });

    return {
        transactionId: transaction.id,
        amount,
        status: 'SUCCESS',
        message: `₹${amount.toFixed(2)} added to your wallet.`,
    };
};

/**
 * Atomic P2P transfer with SELECT FOR UPDATE to prevent race conditions.
 */
const transfer = async (senderId, { recipientEmail, amount, note }) => {
    if (!amount || amount <= 0) throw new AppError('Transfer amount must be greater than 0.', 400);
    if (!recipientEmail) throw new AppError('Recipient email is required.', 400);

    // Find recipient
    const recipient = await prisma.user.findUnique({ where: { email: recipientEmail } });
    if (!recipient) throw new AppError('Recipient not found.', 404);
    if (recipient.id === senderId) throw new AppError('Cannot transfer money to yourself.', 400);

    let transaction;

    await prisma.$transaction(async (tx) => {
        // Read sender balance inside Serializable tx — SSI detects concurrent conflicts automatically
        const senderAccount = await tx.account.findUnique({ where: { userId: senderId } });
        if (!senderAccount) throw new AppError('Sender account not found.', 404);

        const senderBalance = parseFloat(senderAccount.balance);
        if (senderBalance < amount) {
            throw new AppError(`Insufficient balance. Available: ₹${senderBalance.toFixed(2)}`, 400);
        }

        // Verify receiver account exists
        const receiverAccount = await tx.account.findUnique({ where: { userId: recipient.id } });
        if (!receiverAccount) throw new AppError('Recipient account not found.', 404);

        // Deduct from sender
        await tx.account.update({
            where: { userId: senderId },
            data: { balance: { decrement: amount } },
        });

        // Credit receiver
        await tx.account.update({
            where: { userId: recipient.id },
            data: { balance: { increment: amount } },
        });

        // Record transaction
        transaction = await tx.transaction.create({
            data: {
                senderId,
                receiverId: recipient.id,
                amount,
                type: 'TRANSFER',
                status: 'SUCCESS',
                note: note || null,
            },
        });
    }, {
        isolationLevel: 'Serializable', // PostgreSQL SSI prevents double-spend without raw locks
    });


    return {
        transactionId: transaction.id,
        amount,
        recipient: { name: recipient.name, email: recipient.email },
        status: 'SUCCESS',
    };
};

module.exports = { addMoney, transfer };

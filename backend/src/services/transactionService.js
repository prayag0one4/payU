const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

/**
 * Paginated transaction history for authenticated user.
 */
const getTransactions = async (userId, { page = 1, limit = 10, type, status }) => {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {
        OR: [{ senderId: userId }, { receiverId: userId }],
        ...(type && { type }),
        ...(status && { status }),
    };

    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum,
            include: {
                sender: { select: { id: true, name: true, email: true } },
                receiver: { select: { id: true, name: true, email: true } },
            },
        }),
        prisma.transaction.count({ where }),
    ]);

    return {
        transactions,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
            hasNext: pageNum < Math.ceil(total / limitNum),
            hasPrev: pageNum > 1,
        },
    };
};

module.exports = { getTransactions };

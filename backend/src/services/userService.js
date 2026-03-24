const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            account: { select: { balance: true } },
        },
    });
    if (!user) throw new AppError('User not found.', 404);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.account?.balance ?? 0,
        createdAt: user.createdAt,
    };
};

module.exports = { getMe };

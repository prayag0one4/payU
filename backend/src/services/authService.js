const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

const register = async ({ name, email, password }) => {
    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already registered.', 409);

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user + account in one transaction
    const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: { name, email, password: hashedPassword },
        });
        await tx.account.create({
            data: { userId: newUser.id, balance: 0 },
        });
        return newUser;
    });

    const token = generateToken(user.id);
    return { user: sanitizeUser(user), token };
};

const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid email or password.', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid email or password.', 401);

    const token = generateToken(user.id);
    return { user: sanitizeUser(user), token };
};

const generateToken = (userId) =>
    jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

const sanitizeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
});

module.exports = { register, login };

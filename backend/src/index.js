require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { globalLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/walletRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Trust proxy (for rate limiter behind reverse proxy)
app.set('trust proxy', 1);

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

// Global rate limiter
app.use(globalLimiter);

// Body parsers — order matters: payment webhook needs raw body
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 PayU Backend running at http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;

const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL && process.env.payu_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.payu_DATABASE_URL;
}

let prisma;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'test') {
    console.log('Database connected');
  }
} catch (error) {
  prisma = null;
  console.error('Database connection failed:', error.message);
}

module.exports = prisma;

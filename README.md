# PayU — Digital Wallet Application

A full-stack digital wallet built with **React + Vite**, **Node.js + Express**, **PostgreSQL + Prisma**, and **JWT** authentication. Simulates a real-world wallet app (like Paytm / PhonePe).

---

## 🏗 Architecture

```
PayU/
├── backend/        → Express REST API + Prisma ORM
│   ├── prisma/     → schema.prisma + migrations
│   └── src/
│       ├── config/       → Prisma client
│       ├── middleware/    → JWT auth, errorHandler, rateLimiter
│       ├── routes/        → /auth /user /wallet /transactions
│       ├── controllers/   → thin HTTP layer
│       └── services/      → business logic (ACID-safe)
└── frontend/       → React + Vite + Tailwind CSS
    └── src/
        ├── api/           → Axios instance with interceptors
        ├── context/       → AuthContext (JWT state)
        ├── components/    → Layout, Sidebar, ProtectedRoute
        └── pages/         → Login, Register, Dashboard, AddMoney, SendMoney, Transactions
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

---

### 1. Backend Setup

```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Start dev server
npm run dev
# → http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random secret (min 32 chars) |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |
| `PORT` | Backend port (default: 5000) |
| `FRONTEND_URL` | For CORS (default: http://localhost:5173) |

### Frontend
No environment variables needed — API calls proxy through Vite to `http://localhost:5000`.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register (creates user + wallet) |
| POST | `/api/auth/login` | ❌ | Login → JWT token |
| GET | `/api/user/me` | ✅ | Get profile + balance |
| POST | `/api/wallet/add-money` | ✅ | Add money (simulated payment) |
| POST | `/api/wallet/transfer` | ✅ | Atomic P2P transfer |
| GET | `/api/transactions` | ✅ | Paginated history (`?page&limit&type&status`) |

---

## 🔒 Security & Reliability

- **Atomic transfers**: PostgreSQL `$transaction` with `Serializable` isolation
- **No double-spending**: ACID-compliant, race conditions prevented
- **Password security**: `bcrypt` with cost 12
- **Rate limiting**: 100 req/15m global, 10 req/15m on auth routes
- **Money precision**: `Decimal(18,2)` — never floats

---

## 🧪 Testing with Postman

1. Import `PayU.postman_collection.json`
2. Set `baseUrl` variable to `http://localhost:5000`
3. Run **Register** → **Login** (token auto-saves) → all routes work

---

## 🚀 Production Notes

- Use `npm start` (not `npm run dev`) in production
- Set `NODE_ENV=production` in environment
- Use a reverse proxy (Nginx) in front of Express
- Use connection pooling (PgBouncer) for PostgreSQL at scale

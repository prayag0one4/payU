# PayU - Digital Wallet System

A complete digital wallet system with backend (Node.js/Express/MongoDB) and frontend (React/TypeScript/Vite).

## 🎯 Features

- **User Authentication** - Secure login/register with JWT tokens
- **Digital Wallets** - Each user gets a personal wallet with initial balance
- **Money Transfers** - Send and receive money between wallets
- **Cash-In Operations** - Add funds to wallets
- **Transaction History** - View all transactions with pagination and filtering
- **Role-Based Access** - Support for USER, AGENT, and ADMIN roles
- **Real-time Balance Updates** - Instant wallet balance updates
- **Responsive Design** - Works on desktop and mobile devices

## 📁 Project Structure

```
PayU/
├── Digital-Wallet-backend/    # Node.js/Express backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/        # Configuration files
│   │   │   ├── middlewares/   # Express middlewares
│   │   │   ├── modules/       # Feature modules
│   │   │   │   ├── auth/      # Authentication
│   │   │   │   ├── user/      # User management
│   │   │   │   ├── wallet/    # Wallet operations
│   │   │   │   └── transaction/ # Transactions
│   │   │   ├── routes/        # API routes
│   │   │   └── utils/         # Utility functions
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
└── Digital-Wallet-frontend/   # React/TypeScript frontend
    ├── src/
    │   ├── components/        # Reusable components
    │   ├── pages/            # Page components
    │   ├── services/         # API services
    │   ├── store/            # State management (Zustand)
    │   ├── types/            # TypeScript types
    │   └── App.tsx
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd Digital-Wallet-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
NODE_ENV=development
BCRIPT_SOLT_ROUND=10

# JWT
JWT_ACCESS_SECRET=your_access_secret_key
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES=30d

# Express Session
EXPRESS_SESSION_SECRET=your_session_secret

# Admin credentials (will be auto-created)
ADMIN_EMAIL=admin@payu.com
ADMIN_PASS=Admin@123
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd Digital-Wallet-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, Passport.js
- **Validation:** Zod
- **Security:** bcryptjs, express-session

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/reset-password` - Reset password

### Users
- `POST /api/v1/user` - Register new user
- `GET /api/v1/user/me` - Get current user

### Wallets
- `GET /api/v1/wallets/my-wallet` - Get user's wallet
- `GET /api/v1/wallets/:id` - Get wallet by ID
- `PATCH /api/v1/wallets/:id` - Update wallet status

### Transactions
- `POST /api/v1/transactions/send-money` - Send money
- `POST /api/v1/transactions/cash-in` - Cash in
- `GET /api/v1/transactions/my-transactions` - Get user transactions
- `GET /api/v1/transactions` - Get all transactions (Admin)

## 🎨 Features Overview

### User Dashboard
- View wallet balance and status
- Quick actions for sending money
- Recent transactions list
- Profile management

### Send Money
- Send money to any wallet using Wallet ID
- Add optional notes to transactions
- Real-time balance validation
- Success confirmation

### Transaction History
- View all transactions
- Filter by type (Send, Receive, Cash In)
- Pagination support
- Transaction status tracking

### Profile
- View user information
- See wallet details
- Check verification status
- Role and status badges

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- HTTP-only cookies for tokens
- Token refresh mechanism
- CORS protection
- Input validation with Zod
- Role-based access control

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for PayU Digital Wallet System

## 🔗 Links

- [Backend Documentation](./Digital-Wallet-backend/readme.md)
- [Frontend Documentation](./Digital-Wallet-frontend/README.md)
- [Live Demo](https://digital-wallet-backend-sigma.vercel.app/)

## 📞 Support

For support, email support@payu.com or open an issue in the repository.

# Quick Start Guide - PayU Digital Wallet

## 🚀 Quick Setup (5 minutes)

### Step 1: Clone the Repository
```bash
git clone git@github.com:prayag0one4/payU.git
cd payU
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd Digital-Wallet-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
PORT=5000
MONGODB_URL=mongodb://localhost:27017/digital-wallet
NODE_ENV=development
BCRIPT_SOLT_ROUND=10

# JWT
JWT_ACCESS_SECRET=your_secret_key_here_change_in_production
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret_here_change_in_production
JWT_REFRESH_EXPIRES=30d

# Express Session
EXPRESS_SESSION_SECRET=your_session_secret_here

# Admin
ADMIN_EMAIL=admin@payu.com
ADMIN_PASS=Admin@123
EOL

# Start backend
npm run dev
```

Backend will run on: http://localhost:5000

### Step 3: Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd Digital-Wallet-frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on: http://localhost:5173

### Step 4: Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign up" to create a new account
3. After registration, you'll automatically get a wallet with 50 BDT
4. Explore the dashboard, send money, and view transactions

## 📋 Default Admin Account

After the backend starts for the first time, an admin account will be created:

- **Email:** admin@payu.com (or as set in .env)
- **Password:** Admin@123 (or as set in .env)

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:** Make sure MongoDB is running locally or use a MongoDB Atlas connection string

### Issue: Port Already in Use
**Solution:** Change the PORT in backend .env file or kill the process using:
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: CORS Error
**Solution:** Make sure both frontend and backend are running and the VITE_API_URL in frontend .env is correct

## 📱 Features to Test

1. **User Registration & Login**
   - Register with email/password
   - Login and automatic token refresh
   - Logout functionality

2. **Dashboard**
   - View wallet balance
   - Quick actions
   - Recent transactions

3. **Send Money**
   - Use another user's wallet ID to send money
   - Add notes to transactions
   - Real-time balance updates

4. **Transaction History**
   - Filter transactions by type
   - Pagination
   - Transaction status

5. **Profile**
   - View user information
   - Check wallet details
   - See verification status

## 🎯 API Testing (Optional)

Use the provided Postman collection:
[Postman Collection Link](https://web.postman.co/workspace/My-Workspace~45a83938-7975-4adf-889e-84300d1f71d4/collection/40173815-838fece3-4330-4f8e-bcf4-03cfaef89359?action=share&source=copy-link&creator=40173815)

## 📚 Documentation

- Full API Documentation: [Google Docs](https://docs.google.com/document/d/1yxpyT1NXPX23i-rtYfDRmAbfG3qGy0nrBcQLCkMpBm8/edit?usp=sharing)
- Video Explanation: [Drive Link](https://drive.google.com/file/d/1lcXZs5jZWK-qYmyyAvDvM6zshcpQPBrb/view?usp=sharing)

## 🛠 Development Commands

### Backend
```bash
npm run dev      # Start development server
npm run lint     # Run ESLint
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Tech Stack

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Passport.js, Zod

**Frontend:** React 18, TypeScript, Vite, React Router, Zustand, Axios, Lucide React

## 🤝 Need Help?

- Check the main [README.md](README.md)
- Review the [Backend Documentation](Digital-Wallet-backend/readme.md)
- Review the [Frontend Documentation](Digital-Wallet-frontend/README.md)

---

Happy coding! 🎉

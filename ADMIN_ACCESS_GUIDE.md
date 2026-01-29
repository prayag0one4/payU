# Admin Dashboard Access Guide

## ✅ Admin User Setup

The admin user is automatically created when the backend server starts (seeded on startup).

### Admin Credentials

- **Email:** `admin@payu.com`
- **Password:** `Admin@123`

## 🚀 How to Access Admin Dashboard

1. **Login** with admin credentials at `/login`
   - Email: `admin@payu.com`
   - Password: `Admin@123`

2. **Navigation** will automatically change to admin menu showing:
   - Admin Dashboard
   - Users Management
   - Transactions  
   - Agents Management

3. **Admin Routes:**
   - `/admin/dashboard` - System overview with statistics
   - `/admin/users` - User management (block/unblock wallets)
   - `/admin/transactions` - View all system transactions
   - `/admin/agents` - Approve or suspend agent requests

## 📊 Admin Dashboard Features

### Dashboard Stats
- Total users count
- Total transactions count
- Total transaction volume
- System status

### User Management
- View all users with pagination
- Search by name or email
- Block/unblock user wallets with confirmation
- See user role, status, and verification

### Transaction Viewer
- View all system transactions with pagination
- Transaction types: SEND, WITHDRAW, CASH_IN, BONUS
- Filter by status: COMPLETED, PENDING, FAILED
- See transaction details: amount, fees, dates

### Agent Management
- View all registered agents
- Approve pending agents for cash-in operations
- Suspend approved agents if needed
- Track agent status changes

## 🔒 Security Features

- Role-based access control (RBAC)
- Only ADMIN role can access `/admin/*` routes
- Regular users are redirected to their dashboard
- Confirmation dialogs for sensitive operations
- All actions are logged and stored in transactions

## 💡 Tips

- Admin does NOT see wallet balance in header
- Admin logo click redirects to `/admin/dashboard` (not user dashboard)
- All operations require confirmation for critical actions
- Toast notifications show success/error feedback
- Pagination is set to 10 items per page for performance

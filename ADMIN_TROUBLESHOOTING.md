# Admin Dashboard Troubleshooting

## If admin page shows nothing:

### Step 1: Verify Backend is Running
```bash
# Make sure backend is running on localhost:5000
curl http://localhost:5000/api/v1/
```

Should return: `{"message":"Welcome to Digital Wallet Backend"}`

### Step 2: Clear Browser Cache
- Clear browser cookies and cache
- Or use private/incognito window
- Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

### Step 3: Login with Admin Credentials
- Navigate to: `http://localhost:3000/login`
- Email: `admin@payu.com`
- Password: `Admin@123`
- Click "Log In"

### Step 4: Access Admin Dashboard
After login, click logo or navigate to:
- `http://localhost:3000/admin/dashboard`

## If you still see nothing:

### Check Browser Console
Open DevTools (F12) and check the Console tab for errors:
- Look for any red errors
- Check Network tab for failed API calls

### Common Issues:

**1. Login Fails**
- Make sure backend MongoDB is connected
- Check backend `.env` file has correct credentials

**2. Admin page redirects to /dashboard**
- User role is not ADMIN
- Try creating a new admin user in MongoDB directly:
```javascript
// In MongoDB shell:
use digital-wallet
db.users.updateOne(
  { email: "admin@payu.com" },
  { $set: { role: "ADMIN" } }
)
```

**3. API errors (500)**
- Check backend console logs
- Make sure all services are running
- Restart backend server

**4. Blank page with no content**
- Check browser console (F12)
- Check Network tab for failed requests
- Clear LocalStorage: `localStorage.clear()`

## Quick Test Commands:

```bash
# Check if backend is running
curl -X GET http://localhost:5000/api/v1/

# Login and get tokens
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@payu.com","password":"Admin@123"}'

# Get all users (requires admin token)
curl -X GET http://localhost:5000/api/v1/user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Admin Features Available:

✅ View system statistics
✅ Manage users (block/unblock)
✅ View all transactions
✅ Approve/suspend agents
✅ Search and pagination
✅ Confirmation dialogs

All features require ADMIN role!

# Privora 14 - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (or your database)

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
```

#### 2. Configure Backend Environment
Create `.env` file in backend directory:
```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/privora
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

#### 3. Run Database Migrations
```bash
npm run prisma:migrate
```

#### 4. Start Backend
```bash
npm run start
# or for development with hot reload
npm run start:dev
```

#### 5. Frontend Setup
```bash
cd frontend
npm install
```

#### 6. Configure Frontend Environment
Create `.env.local` file in frontend directory:
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

#### 7. Start Frontend
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📝 Creating Test Accounts

1. Navigate to Sign Up page
2. Enter email and password (must have: uppercase, lowercase, number, special character)
3. Create account
4. Login with credentials

---

## 🧪 Testing File Transfer

### Setup Two Users
1. Open two browser windows (or use incognito)
2. Sign up/login as User A in window 1
3. Sign up/login as User B in window 2

### Send File
1. In User A's window, go to "Send File"
2. Enter User B's email
3. Set an encryption key (remember this!)
4. Select a file (max 50MB)
5. Click "Send File Securely"

### Receive File
1. In User B's window, go to "Receive Files"
2. You should see the file from User A
3. Enter the encryption key
4. Click "Download"
5. File is automatically decrypted

---

## 🔍 Online Users Feature

### View Online Users
1. Go to "Online Users" page
2. See all currently logged-in users with "Online" status
3. Click "Send File" to quickly send to any online user

### Real-time Detection
- When a user logs in, they appear instantly on Online Users page for others
- When a user logs out, they disappear from the list
- Status updates in real-time via WebSocket

---

## 🐛 Troubleshooting

### Issue: "Failed to connect to API"
- **Solution**: Ensure backend is running on the correct port
- Check `NEXT_PUBLIC_API_BASE` in frontend `.env.local`
- Verify network connectivity

### Issue: "File upload failed"
- **Solution**: 
  - Check file size (max 50MB)
  - Ensure encryption key is provided
  - Check backend logs for errors

### Issue: "Decryption failed"
- **Solution**: 
  - Verify encryption key matches what was used to send
  - Encryption keys are case-sensitive

### Issue: "User not found"
- **Solution**: 
  - Ensure recipient email is registered in the system
  - Check for typos in email address

### Issue: "Session expired"
- **Solution**: 
  - Refresh the page
  - Login again with credentials

---

## 📊 Monitoring

### Backend Logs
Watch terminal where backend is running for:
- Connection events
- File transfer operations
- Errors and warnings

### Frontend Console
Open browser developer tools (F12) and check Console tab for:
- Network requests
- WebSocket events
- Errors and warnings

### Network Activity
Open Network tab in developer tools to see:
- API request details
- Response times
- Error responses

---

## 🔒 Security Notes

1. **Encryption Keys**: Never share your encryption key in public
2. **Passwords**: Use strong passwords (min 8 characters, mixed case, numbers, symbols)
3. **URLs**: Only use HTTPS in production
4. **Database**: Secure database credentials in environment variables
5. **JWT Secret**: Change `JWT_SECRET` in production

---

## 📱 Testing on Mobile

### Using Local Network
1. Find your computer's local IP: 
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` (look for inet)

2. Update frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE=http://<your-ip>:3001
   ```

3. Access from mobile: `http://<your-ip>:3000`

### Using Ngrok (For Remote Testing)
1. Install ngrok: `npm install -g ngrok`
2. Run: `ngrok http 3001`
3. Update frontend with the provided ngrok URL

---

## 🛠️ Development Commands

### Backend
```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Run migrations
npm run prisma:migrate

# View database
npm run prisma:studio

# Run tests
npm run test
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production build locally
npm run start

# Run tests
npm run test

# Lint code
npm run lint
```

---

## 📚 Key Files

### Backend
- `src/app.module.ts` - Main application module
- `src/auth/` - Authentication logic
- `src/files/` - File transfer logic
- `src/events/` - Real-time events (WebSocket)
- `prisma/schema.prisma` - Database schema

### Frontend
- `src/contexts/` - React contexts (Auth, Socket)
- `src/app/` - Page components
- `src/components/` - Reusable components
- `src/utils/` - Utility functions and helpers
- `public/` - Static assets

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend starts without errors
- [ ] Frontend loads on localhost:3000
- [ ] Can sign up new user
- [ ] Can login with credentials
- [ ] Online Users page shows users
- [ ] Can send file to another user
- [ ] Can receive and download file
- [ ] Decryption works correctly
- [ ] No console errors

---

## 🆘 Getting Help

1. Check browser console (F12) for error messages
2. Check backend terminal for logs
3. Review STABILITY_REPORT.md for known issues
4. Check error boundary messages on the page

---

**Version**: 1.0.0  
**Last Updated**: January 22, 2026  
**Status**: ✅ Production Ready

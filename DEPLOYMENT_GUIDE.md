# Privora 14 - Local Network Deployment Guide

## 🎯 Overview

This app is deployed on your **local network** using your laptop's IP address (**172.20.10.4**).  
The "deployment issue" means the running app doesn't reflect the latest GitHub commits.

**Root Cause**: The app runs from your local files, not from GitHub. You need to pull latest changes and restart.

---

## 🚀 Deployment Architecture

```
Your Laptop (172.20.10.4)
├── Frontend: http://172.20.10.4:3000 (Next.js dev server)
├── Backend: http://172.20.10.4:3001 (NestJS server)
└── Database: Neon PostgreSQL (cloud)
```

**Access**:
- From laptop: `http://localhost:3000` or `http://172.20.10.4:3000`
- From other devices on network: `http://172.20.10.4:3000`

---

## 🔄 How to Deploy Latest Changes

### Problem: GitHub has new commits, but running app shows old UI

### Solution: Pull and Restart

```bash
# 1. Stop running servers (if any)
# Press Ctrl+C in both terminal windows, or:
taskkill /F /IM node.exe

# 2. Pull latest changes from GitHub
git fetch origin
git pull origin main

# 3. Install any new dependencies
cd frontend
npm install
cd ..

cd backend
npm install
npx prisma generate
cd ..

# 4. Restart the application
START_APP.bat
```

### Quick Update Script

Create `UPDATE_APP.bat`:

```batch
@echo off
echo ========================================
echo Privora 14 - Update and Restart
echo ========================================
echo.

echo [1/5] Stopping running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.

echo [2/5] Pulling latest changes from GitHub...
git fetch origin
git pull origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git pull failed!
    pause
    exit /b 1
)
echo.

echo [3/5] Updating frontend dependencies...
cd frontend
call npm install
cd ..
echo.

echo [4/5] Updating backend dependencies...
cd backend
call npm install
call npx prisma generate
cd ..
echo.

echo [5/5] Starting application...
START_APP.bat
```

---

## 🔍 Verify You Have Latest Code

### Method 1: Check Git Status

```bash
# See current commit
git log -1 --oneline

# Compare with GitHub
git fetch origin
git status

# Should show: "Your branch is up to date with 'origin/main'"
```

### Method 2: Check Build Info on /about Page

After implementing the BuildInfo component:
1. Go to `http://172.20.10.4:3000/about`
2. Scroll to bottom
3. Check "Build Information" section
4. Commit hash should match latest GitHub commit

### Method 3: Check File Timestamps

```bash
# Windows
dir /O:D frontend\src\app\*.tsx

# Should show recent modification dates matching your latest commits
```

---

## 🐛 Common Issues and Fixes

### Issue 1: "App still shows old UI after git pull"

**Cause**: Browser cache or Next.js build cache

**Fix**:
```bash
# 1. Clear Next.js cache
cd frontend
rmdir /s /q .next
npm run build
npm run dev

# 2. Hard refresh browser
# Chrome/Edge: Ctrl + Shift + R
# Firefox: Ctrl + F5
```

### Issue 2: "Changes not visible on mobile device"

**Cause**: Mobile browser cache

**Fix**:
1. Clear browser cache on mobile device
2. Close and reopen browser app
3. Try incognito/private mode
4. Verify IP address hasn't changed: `ipconfig`

### Issue 3: "Port already in use"

**Cause**: Previous server still running

**Fix**:
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Wait 5 seconds
timeout /t 5

# Restart
START_APP.bat
```

### Issue 4: "Database schema out of sync"

**Cause**: New migrations in latest code

**Fix**:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### Issue 5: "Module not found errors"

**Cause**: New dependencies added in latest code

**Fix**:
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

---

## 📋 Pre-Deployment Checklist

Before pulling latest changes:

- [ ] Commit or stash any local changes
- [ ] Note current IP address: `ipconfig`
- [ ] Backup database (if needed): `npx prisma db pull`
- [ ] Stop running servers gracefully

After pulling latest changes:

- [ ] Run `npm install` in both frontend and backend
- [ ] Run `npx prisma generate` in backend
- [ ] Check for new environment variables in `.env.example`
- [ ] Restart servers with `START_APP.bat`
- [ ] Test on laptop browser first
- [ ] Test on mobile device
- [ ] Verify build info on /about page

---

## 🔄 Automatic Update Workflow

### Option 1: Manual Update (Recommended)

```bash
# Every time you want latest code:
1. git pull origin main
2. npm install (if package.json changed)
3. Restart servers
```

### Option 2: Scheduled Update Script

Create a scheduled task to auto-update daily:

```batch
REM update-scheduled.bat
@echo off
cd C:\Users\ULRICH01\Documents\privora14
git pull origin main
cd frontend && npm install && cd ..
cd backend && npm install && npx prisma generate && cd ..
echo Updated at %date% %time% >> update.log
```

---

## 🌐 Network Deployment Best Practices

### Keep IP Address Stable

Your laptop IP (172.20.10.4) may change. To keep it stable:

1. **Set Static IP** (Windows):
   - Settings → Network & Internet → Ethernet/WiFi
   - IP settings → Edit → Manual
   - Set IP: 172.20.10.4
   - Subnet: 255.255.255.0
   - Gateway: (your router IP)

2. **Router DHCP Reservation**:
   - Log into router admin
   - Reserve 172.20.10.4 for your laptop's MAC address

### Firewall Configuration

Ensure Windows Firewall allows Node.js:

```bash
# Run as Administrator
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes
```

### Environment Variables

Update if IP changes:

**Backend** (`.env`):
```env
FRONTEND_URL=http://172.20.10.4:3000
CORS_ORIGINS=http://172.20.10.4:3000,http://localhost:3000
```

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_BASE=http://172.20.10.4:3001
```

---

## 📊 Monitoring Local Deployment

### Check Server Status

```bash
# Check if servers are running
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Should show LISTENING on both ports
```

### View Logs

```bash
# Frontend logs
cd frontend
npm run dev

# Backend logs
cd backend
npm run start:dev
```

### Test Endpoints

```bash
# Frontend
curl http://172.20.10.4:3000

# Backend health
curl http://172.20.10.4:3001/health

# Backend API
curl http://172.20.10.4:3001/api/auth/online-users
```

---

## 🎯 Deployment Verification Steps

After updating code:

1. **Check Git Status**
   ```bash
   git log -1 --oneline
   # Should match latest GitHub commit
   ```

2. **Verify Servers Running**
   ```bash
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   ```

3. **Test Frontend**
   - Open: `http://172.20.10.4:3000`
   - Check: UI shows new features
   - Verify: No console errors (F12)

4. **Test Backend**
   - Open: `http://172.20.10.4:3001/health`
   - Should return: `{"status":"ok"}`

5. **Test from Mobile**
   - Connect to same WiFi
   - Open: `http://172.20.10.4:3000`
   - Test: Login, file upload, real-time features

6. **Check Build Info**
   - Go to: `/about` page
   - Verify: Commit hash matches GitHub
   - Verify: Build time is recent

---

## 🔐 Security for Local Network

Since this is local network deployment:

- ✅ Only accessible on your local network
- ✅ Not exposed to internet
- ✅ Firewall protects from external access
- ⚠️ Anyone on your WiFi can access
- ⚠️ Use strong WiFi password
- ⚠️ Don't use on public WiFi

---

## 📞 Troubleshooting Checklist

If app doesn't show latest changes:

1. [ ] Did you run `git pull origin main`?
2. [ ] Did you run `npm install` in both folders?
3. [ ] Did you restart the servers?
4. [ ] Did you clear browser cache (Ctrl+Shift+R)?
5. [ ] Is the IP address still 172.20.10.4? (`ipconfig`)
6. [ ] Are both servers running? (`netstat -ano | findstr :300`)
7. [ ] Any errors in terminal logs?
8. [ ] Did you check /about page for build info?

---

## 🚀 Quick Reference Commands

```bash
# Update to latest code
git pull origin main

# Install dependencies
cd frontend && npm install && cd ..
cd backend && npm install && npx prisma generate && cd ..

# Restart servers
taskkill /F /IM node.exe
START_APP.bat

# Check IP address
ipconfig

# Check running servers
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# View git status
git status
git log -1 --oneline

# Clear Next.js cache
cd frontend
rmdir /s /q .next
npm run dev
```

---

**Deployment Type**: Local Network (Development)  
**IP Address**: 172.20.10.4  
**Frontend Port**: 3000  
**Backend Port**: 3001  
**Update Method**: Git pull + Restart  
**Last Updated**: 2026-01-27

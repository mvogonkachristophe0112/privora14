# Privora 14 - Network Deployment Guide

## Your Laptop IP Address
**`172.20.10.4`**

## Access the Application

### From Your Laptop:
- **Frontend**: http://localhost:3000 or http://172.20.10.4:3000
- **Backend API**: http://172.20.10.4:3001

### From Other Devices on Your Network:
- **Frontend**: http://172.20.10.4:3000
- **Backend API**: http://172.20.10.4:3001

## Running the Servers

### Backend Server (Port 3001)
```bash
cd backend
npx nest start --watch
```

### Frontend Server (Port 3000)
```bash
cd frontend
npx next dev --hostname 0.0.0.0
```

## Environment Configuration

- **Backend** (.env): `FRONTEND_URL=http://172.20.10.4:3000`
- **Frontend** (.env.local): `NEXT_PUBLIC_API_BASE=http://172.20.10.4:3001`

## Features Available

✅ **User Authentication** - Sign up, login, JWT tokens  
✅ **File Transfer** - Encrypted file uploads/downloads  
✅ **Online Users** - Real-time user detection via WebSocket  
✅ **File Management** - View, manage, and transfer files  
✅ **Cross-Device** - Works on desktop, tablet, mobile  
✅ **Encryption** - AES-256-GCM for file security  
✅ **Error Handling** - Comprehensive error recovery  
✅ **Real-time Updates** - Socket.IO with automatic reconnection  

## Network Accessibility

The application is now accessible from any device on your network using the IP address **172.20.10.4**.

### To Access from Another Device:
1. Make sure the device is on the same network as your laptop
2. Open a web browser
3. Go to: **http://172.20.10.4:3000**
4. The application will connect to the backend at **http://172.20.10.4:3001**

### Testing Recommendations:
- [ ] Test from desktop browser (http://172.20.10.4:3000)
- [ ] Test from mobile device on same network
- [ ] Test file upload and encryption/decryption
- [ ] Test online users display (should update in real-time)
- [ ] Test file transfer between different devices

## Troubleshooting

If devices cannot reach the application:
1. Verify both are on the same network
2. Check Windows Firewall allows Node.js on ports 3000 and 3001
3. Ensure servers are running in terminals
4. Check the network IP is correct: `ipconfig`

## Database

- **Type**: PostgreSQL (Neon)
- **Connection**: Cloud-based via Neon
- **ORM**: Prisma

---

**All code fixes, stability improvements, and cross-device features are enabled.**

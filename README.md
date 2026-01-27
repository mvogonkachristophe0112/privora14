# Privora 14 - Secure File Sharing Platform

End-to-end encrypted file sharing with real-time notifications and advanced security features.

## 🚀 Features

- **End-to-End Encryption**: AES-256-GCM encryption for all file transfers
- **Real-time Presence**: See who's online and get instant notifications
- **Secure File Transfer**: Send and receive encrypted files with unique decryption keys
- **File Management**: Organize, search, and manage your files
- **Transfer History**: Track all sent and received files with detailed logs
- **Multi-language Support**: English, French, and Chinese
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

## 🛠️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mvogonkachristophe0112/privora14.git
cd privora14
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env and configure:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (generate a strong random string)

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start backend server
npm run start:dev
```

Backend will run on http://localhost:3001

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env.local

# Start frontend server
npm run dev
```

Frontend will run on http://localhost:3000

### 4. Quick Start (Windows)

Simply run the batch file from the project root:

```bash
START_APP.bat
```

This will start both backend and frontend servers automatically.

## 🔐 How It Works

### Encryption Workflow

1. **Sender Side**:
   - User selects a file and recipient
   - File is encrypted client-side using AES-256-GCM
   - Encrypted file + metadata sent to server
   - Decryption key displayed to sender (must be shared with recipient)

2. **Server Side**:
   - Stores encrypted file (cannot decrypt)
   - Creates transfer record
   - Sends real-time notification to recipient

3. **Receiver Side**:
   - Receives notification of incoming file
   - Downloads encrypted file
   - Enters decryption key
   - File decrypted client-side and available for preview/download

### Presence Tracking

- WebSocket connection established on login
- User marked as "online" in real-time
- Heartbeat mechanism maintains connection
- Automatic cleanup on disconnect

## 📱 Pages

- **Home**: Landing page with features and call-to-action
- **About**: Detailed feature documentation
- **Login/Signup**: User authentication
- **Dashboard**: Overview of activity and quick actions
- **Send**: Upload and send encrypted files
- **Receive**: View and decrypt incoming files
- **File Manager**: Manage all your files
- **History**: View transfer history with filters
- **Online Users**: See who's online and send files directly
- **Settings**: User preferences and account settings
- **Help**: Documentation and support

## 🔧 Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/privora14
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for Render, Vercel, and other platforms.

## 🏗️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Socket.IO Client
- Web Crypto API (for encryption)

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT Authentication
- bcrypt

## 🔒 Security Features

- Client-side encryption (files never stored unencrypted)
- JWT-based authentication
- Protected API endpoints
- CORS configuration
- Input validation
- Rate limiting (production)

## 📝 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/online-users` - Get list of online users

### Files
- `POST /files/upload` - Upload encrypted file
- `GET /files` - List user's files
- `GET /files/:id` - Get file details
- `GET /files/:id/download` - Download encrypted file
- `DELETE /files/:id` - Delete file

### WebSocket Events
- `user_online` - User comes online
- `user_offline` - User goes offline
- `online_users_list` - List of online users
- `file_transfer_notification` - Incoming file notification

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
taskkill /F /IM node.exe

# Then restart the app
START_APP.bat
```

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Run `npx prisma migrate deploy` in backend directory

### Blank Page Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check browser console for errors

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

## 📞 Support

For issues and questions, please open a GitHub issue or contact support@privora14.com

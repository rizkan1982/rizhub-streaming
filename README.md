# 🎬 RizHub - Premium Entertainment Platform

A modern, full-stack video streaming platform with beautiful UI/UX, real-time analytics, and admin panel.

![RizHub](https://img.shields.io/badge/RizHub-Premium-purple?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (Atlas or Local)
- VPN (for video streaming)

### Installation

1. **Clone & Install:**
```bash
# Install backend
cd backend
npm install

# Install frontend (in new terminal)
cd ..
npm install
```

2. **Configure Environment:**
```bash
# backend/.env
MONGO_URI=mongodb://localhost:27017/rizhub
# OR use MongoDB Atlas
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/rizhub

PORT=3000
JWT_SECRET=your-secret-key
```

3. **Start Development:**
```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
npm run dev
```

4. **Access:**
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **Admin:** http://localhost:5173/admin

---

## ✨ Features

### 🎥 Video Streaming
- Multi-platform support (XVideos, Pornhub, etc.)
- Backend proxy for ISP bypass
- HTML5 video player
- Related videos with smart fallback

### 🎨 Beautiful UI/UX
- Black elegant theme with glassmorphism
- Responsive design (mobile-first)
- Smooth animations & transitions
- Movie poster style cards (9:14 ratio)

### 📄 Navigation
- Pagination (Next/Previous)
- Search functionality
- Filter by genre & duration
- Trending videos (randomized)

### 💬 Social Features
- Comment system (no login required)
- Like/Unlike videos
- Anonymous user tracking
- Real-time updates

### 👨‍💼 Admin Panel
- Real-time analytics dashboard
- User activity monitoring
- Comment moderation
- Hourly statistics
- JWT authentication

### 🌐 Internationalization
- English / Indonesian
- Context-based switching
- Persistent preference

---

## 📊 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js + Express** - Server
- **TypeScript** - Type safety
- **Cheerio** - Web scraping
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Database
- **MongoDB** - Data storage
- **MongoDB Atlas** - Cloud hosting (optional)

---

## 🔐 Default Admin Credentials

```
Username: rizhub_admin
Password: RizHub2025!@#SecurePass
```

⚠️ **CHANGE THIS IMMEDIATELY IN PRODUCTION!**

---

## 📁 Project Structure

```
lustpress/
├── backend/              # Express backend
│   ├── src/
│   │   ├── controller/   # API endpoints
│   │   ├── scraper/      # Web scraping
│   │   ├── models/       # MongoDB schemas
│   │   ├── middleware/   # Auth, tracking
│   │   └── config/       # Database config
│   └── .env              # Environment variables
│
├── src/                  # React frontend
│   ├── pages/            # Route pages
│   ├── components/       # Reusable components
│   └── contexts/         # React contexts
│
└── RIZHUB_FINAL_GUIDE.md # Complete documentation
```

---

## 🐛 Common Issues

### Video Not Playing
- ✅ Enable VPN (Urban VPN recommended)
- ✅ Check backend is running
- ✅ Clear browser cache

### Admin Panel Login Failed
- ✅ Check MongoDB connection
- ✅ Verify credentials (case-sensitive)
- ✅ Disable VPN (if using MongoDB Atlas)

### Backend Port Already in Use
```bash
netstat -ano | findstr :3000
taskkill /F /PID [PID_NUMBER]
```

---

## 📖 Documentation

For complete documentation, see:
- **[RIZHUB_FINAL_GUIDE.md](./RIZHUB_FINAL_GUIDE.md)** - Complete setup & troubleshooting
- **[START.md](./START.md)** - Original backend documentation

---

## 🎯 Key Highlights

✅ **Production Ready** - Fully tested and optimized  
✅ **ISP Bypass** - Backend proxy for blocked content  
✅ **Anonymous Tracking** - No login required for users  
✅ **Real-time Analytics** - Monitor everything  
✅ **Beautiful Design** - Premium UI/UX  
✅ **i18n Support** - Multi-language  
✅ **Pagination & Filters** - Easy navigation  

---

## 📝 License

This project is for **educational purposes only**.

---

## 🙏 Acknowledgments

Built with ❤️ using:
- Express.js
- React
- MongoDB
- Tailwind CSS
- TypeScript

---

## 📞 Support

For issues or questions, check:
1. [RIZHUB_FINAL_GUIDE.md](./RIZHUB_FINAL_GUIDE.md) - Troubleshooting section
2. Backend console logs
3. Browser developer console

---

**RizHub - Premium Entertainment Platform** 🎬✨

Made with passion and lots of coffee ☕

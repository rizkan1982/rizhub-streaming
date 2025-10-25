# 🚀 RIZHUB DEPLOY - QUICK START

## 📝 TL;DR (Too Long Didn't Read)

**5 Langkah Deploy ke Vercel:**

### 1️⃣ Push to GitHub (5 min)
```bash
cd "C:\Users\PC GAMING\Downloads\lustpress"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/rizkan1982/rizhub-streaming.git
git push -u origin main
```

### 2️⃣ Deploy Backend (5 min)
1. Go to https://vercel.com/new
2. Import `rizkan1982/rizhub-streaming`
3. Root Directory: `backend`
4. Add env vars:
   - `MONGO_URI`: `mongodb+srv://rizhub_admin:RizHub2025@cluster0.xf3swck.mongodb.net/rizhub?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `rizhub-super-secret-key-2025-production`
   - `NODE_ENV`: `production`
5. Deploy!
6. Copy backend URL

### 3️⃣ Update Frontend (2 min)
Frontend sudah auto-configured! API_BASE akan pakai environment variable.

### 4️⃣ Deploy Frontend (5 min)
1. Go to https://vercel.com/new
2. Import same repo
3. Root Directory: `.` (root)
4. Framework: Vite
5. Add env var:
   - `VITE_API_BASE`: `https://your-backend-url.vercel.app`
6. Deploy!

### 5️⃣ Done! 🎉
Access your site at: `https://rizhub-streaming.vercel.app`

---

## ⚠️ KNOWN ISSUES

### **Issue 1: Function Timeout**
**Problem:** Vercel free tier has 10s timeout
**Solution:** Use Railway for backend instead
- Railway: https://railway.app
- Free: 500 hours
- No timeout limits

### **Issue 2: Video Proxy Slow**
**Problem:** Serverless not ideal for video streaming
**Solution:** 
- Deploy backend to Railway/Render
- Or use CDN for videos

---

## 🎯 RECOMMENDED SETUP

**Best Practice:**
1. **Frontend:** Vercel (perfect for React)
2. **Backend:** Railway (better for API + video proxy)
3. **Database:** MongoDB Atlas (already setup)

**Why Railway for Backend?**
- ✅ No timeout limits
- ✅ Better performance
- ✅ Persistent connections
- ✅ Free 500 hours/month
- ✅ $5/month unlimited

---

## 📋 Environment Variables Needed

### **Backend (.env):**
```env
MONGO_URI=mongodb+srv://rizhub_admin:RizHub2025@cluster0.xf3swck.mongodb.net/rizhub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=rizhub-super-secret-key-2025-production
SESSION_SECRET=rizhub-session-secret-2025
NODE_ENV=production
PORT=3000
```

### **Frontend (Vercel Dashboard):**
```env
VITE_API_BASE=https://rizhub-backend.vercel.app
```

---

## 🔄 Update After First Deploy

After first deployment, update backend URL:

1. Get backend URL from Vercel
2. Go to frontend project in Vercel
3. Settings → Environment Variables
4. Update `VITE_API_BASE` with actual backend URL
5. Redeploy frontend

---

## ✅ Deployment Checklist

- [ ] GitHub repo created
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Vercel/Railway
- [ ] Backend URL copied
- [ ] Frontend env vars updated
- [ ] Frontend deployed to Vercel
- [ ] Test homepage
- [ ] Test video playback
- [ ] Test all features

---

## 🆘 Quick Troubleshooting

**Can't push to GitHub?**
```bash
# Generate Personal Access Token:
# https://github.com/settings/tokens
# Use token as password
```

**Build fails on Vercel?**
```bash
# Check Build & Development Settings:
# - Build Command: npm run build
# - Output Directory: dist
# - Install Command: npm install
```

**CORS error?**
```bash
# Update backend/src/index.ts
# Add your frontend URL to cors origin
```

**MongoDB connection fails?**
```bash
# MongoDB Atlas → Network Access
# Add IP: 0.0.0.0/0
```

---

## 📱 After Deploy

Your app is now live at:
- **Frontend:** `https://rizhub-streaming.vercel.app`
- **Backend:** `https://rizhub-backend.vercel.app`

Share with friends! 🎉

---

**Full Guide:** See `DEPLOY_GUIDE_VERCEL.md`

**Happy Deploying!** 🚀


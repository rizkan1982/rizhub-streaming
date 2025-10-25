# 🚀 RIZHUB - DEPLOY TO VERCEL (COMPLETE GUIDE)

**Username GitHub:** `rizkan1982`

---

## 📋 OVERVIEW

Kita akan deploy RizHub dalam **2 bagian:**
1. **Frontend** → Vercel (React app)
2. **Backend** → Vercel Serverless Functions (API)

**Estimated Time:** 30-45 minutes

---

## ✅ PREREQUISITES

- [x] GitHub account (`rizkan1982`)
- [ ] Vercel account (sign up dengan GitHub)
- [ ] MongoDB Atlas running
- [ ] Git installed di laptop
- [ ] Project RizHub ready

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### **STEP 1: SETUP GIT & GITHUB (15 menit)**

#### 1.1. Initialize Git Repository

Buka terminal di folder project:

```bash
cd "C:\Users\PC GAMING\Downloads\lustpress"

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit - RizHub streaming platform"
```

#### 1.2. Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `rizhub-streaming`
3. **Description:** "Professional video streaming platform with advanced features"
4. **Visibility:** Private (recommended) atau Public
5. **DON'T** initialize with README, .gitignore, or license (sudah ada)
6. **Click:** "Create repository"

#### 1.3. Push to GitHub

GitHub akan kasih command, tapi ini yang pasti work:

```bash
# Add remote
git remote add origin https://github.com/rizkan1982/rizhub-streaming.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Kalau diminta login:**
- Username: `rizkan1982`
- Password: Pakai **Personal Access Token** (bukan password biasa)

**Cara buat PAT (Personal Access Token):**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `RizHub Deploy`
4. Expiration: 90 days
5. Select scopes: ✅ `repo` (all)
6. Click "Generate token"
7. **COPY TOKEN** (ga bisa di-copy lagi nanti!)
8. Use token as password saat push

---

### **STEP 2: DEPLOY BACKEND TO VERCEL (10 menit)**

#### 2.1. Sign Up Vercel

1. **Go to:** https://vercel.com/signup
2. **Click:** "Continue with GitHub"
3. **Authorize** Vercel to access GitHub
4. **Complete** profile setup

#### 2.2. Install Vercel CLI (Optional tapi recommended)

```bash
npm install -g vercel
```

#### 2.3. Deploy Backend

**Option A: Via Vercel Dashboard (Easier)**

1. **Go to:** https://vercel.com/new
2. **Import Git Repository**
3. **Select:** `rizkan1982/rizhub-streaming`
4. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build` (atau leave empty)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

5. **Environment Variables** (VERY IMPORTANT!)
   Click "Environment Variables" dan add:
   
   ```
   Name: MONGO_URI
   Value: mongodb+srv://rizhub_admin:RizHub2025@cluster0.xf3swck.mongodb.net/rizhub?retryWrites=true&w=majority&appName=Cluster0
   
   Name: JWT_SECRET
   Value: rizhub-super-secret-key-2025-production
   
   Name: NODE_ENV
   Value: production
   
   Name: PORT
   Value: 3000
   ```

6. **Click:** "Deploy"
7. **Wait** ~2-3 minutes
8. **Copy** deployment URL (e.g., `https://rizhub-backend.vercel.app`)

**Option B: Via CLI**

```bash
cd backend
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: rizhub-backend
# - Directory: ./
# - Override settings? N

# Add environment variables
vercel env add MONGO_URI
# Paste: mongodb+srv://rizhub_admin:RizHub2025@cluster0.xf3swck.mongodb.net/rizhub?retryWrites=true&w=majority&appName=Cluster0

vercel env add JWT_SECRET
# Paste: rizhub-super-secret-key-2025-production

# Deploy to production
vercel --prod
```

---

### **STEP 3: UPDATE FRONTEND API URL (5 menit)**

Backend sekarang live! Sekarang update frontend untuk connect ke backend yang baru.

#### 3.1. Create Environment File

Create file: `.env.production`

```env
VITE_API_BASE=https://rizhub-backend.vercel.app
```

#### 3.2. Update API Calls

Update files yang pakai `http://localhost:3000`:

**File 1: `src/pages/HomePage.jsx`**

```javascript
// Change this:
const API_BASE = "http://localhost:3000";

// To this:
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
```

**File 2: `src/pages/WatchPage.jsx`**

```javascript
// Change this:
const API_BASE = "http://localhost:3000";

// To this:
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
```

#### 3.3. Commit Changes

```bash
git add .
git commit -m "Update API URL for production"
git push
```

---

### **STEP 4: DEPLOY FRONTEND TO VERCEL (10 menit)**

#### 4.1. Deploy Frontend

**Via Vercel Dashboard:**

1. **Go to:** https://vercel.com/new
2. **Import** same repository: `rizkan1982/rizhub-streaming`
3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (root, bukan `backend`)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables:**
   
   ```
   Name: VITE_API_BASE
   Value: https://rizhub-backend.vercel.app
   ```

5. **Click:** "Deploy"
6. **Wait** ~2-3 minutes
7. **Copy** frontend URL (e.g., `https://rizhub-streaming.vercel.app`)

---

### **STEP 5: CONFIGURE CUSTOM DOMAIN (Optional)**

#### 5.1. Add Custom Domain

1. **Go to:** Project Settings → Domains
2. **Add Domain:** `rizhub.yourdomain.com`
3. **Follow** DNS configuration instructions
4. **Wait** for DNS propagation (~10-60 minutes)

---

### **STEP 6: ENABLE CORS ON BACKEND**

Backend perlu allow frontend domain.

#### 6.1. Update CORS Settings

Update `backend/src/index.ts`:

```typescript
// Add frontend domain to CORS
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://rizhub-streaming.vercel.app', // Your frontend URL
      'https://rizhub.yourdomain.com' // Custom domain if any
    ],
    credentials: true
  })
);
```

#### 6.2. Commit and Redeploy

```bash
git add .
git commit -m "Update CORS for production"
git push
```

Vercel akan auto-redeploy!

---

### **STEP 7: TEST DEPLOYMENT**

#### 7.1. Test Backend

Open browser:
```
https://rizhub-backend.vercel.app/
```

Should see: API info atau "RizHub Backend Running"

#### 7.2. Test Frontend

```
https://rizhub-streaming.vercel.app
```

Should see: RizHub homepage!

#### 7.3. Test Features

- [ ] Homepage loads
- [ ] Search works
- [ ] Click video → Watch page
- [ ] Video player works
- [ ] Favorites work
- [ ] Share button works
- [ ] Comments work

---

## ⚠️ IMPORTANT NOTES

### **1. Vercel Serverless Limitations**

**Free Tier:**
- ⏱️ **Timeout:** 10 seconds per request
- 💾 **Memory:** 1024 MB
- 🚀 **Bandwidth:** 100 GB/month
- 🔄 **Builds:** 100 per day

**Problem:** Video scraping bisa lebih dari 10 detik!

**Solution:** 
- Upgrade ke Vercel Pro ($20/month) → 60s timeout
- Atau deploy backend ke **Railway** atau **Render** (free tier lebih generous)

### **2. Video Streaming**

Vercel serverless **NOT IDEAL** untuk video proxy karena:
- Timeout limits
- Memory limits
- Bandwidth costs

**Recommended:** Deploy backend ke:
- **Railway.app** (Free: 500 hours, $5/month unlimited)
- **Render.com** (Free: 750 hours)
- **Fly.io** (Free: 3 VMs)

### **3. MongoDB Atlas**

- Pastikan **IP Whitelist** allow `0.0.0.0/0` (all IPs)
- Vercel serverless IP addresses berubah-ubah
- MongoDB Atlas free tier: 512 MB storage

### **4. Environment Variables**

**NEVER** commit `.env` files!
- Use Vercel dashboard untuk add env vars
- Atau use `vercel env add` command

---

## 🔄 AUTO-DEPLOYMENT

Sekarang setiap kali kamu push ke GitHub:

```bash
git add .
git commit -m "Update feature X"
git push
```

Vercel akan **automatically**:
1. ✅ Pull latest code
2. ✅ Build project
3. ✅ Deploy to production
4. ✅ Notify kamu via email

**GitHub → Vercel = Instant deployment!** ⚡

---

## 🎯 ALTERNATIVE: DEPLOY BACKEND TO RAILWAY

Kalau Vercel timeout jadi masalah, pakai Railway untuk backend:

### **Quick Railway Setup:**

1. **Sign up:** https://railway.app (pakai GitHub)
2. **New Project** → Deploy from GitHub
3. **Select:** `rizkan1982/rizhub-streaming`
4. **Root directory:** `backend`
5. **Add variables:** MONGO_URI, JWT_SECRET
6. **Deploy!**
7. **Copy** Railway URL
8. **Update** `VITE_API_BASE` di Vercel frontend

**Benefits:**
- ⏱️ No 10s timeout
- 💾 More memory
- 🚀 Better for long-running requests
- 💰 $5/month for unlimited (or free 500 hours)

---

## 📊 DEPLOYMENT CHECKLIST

### **Pre-Deploy:**
- [ ] Git repository created
- [ ] GitHub repository created and pushed
- [ ] MongoDB Atlas running
- [ ] Environment variables ready
- [ ] .gitignore configured

### **Backend Deploy:**
- [ ] Vercel account created
- [ ] Backend deployed
- [ ] Environment variables added
- [ ] Backend URL copied
- [ ] Test backend API

### **Frontend Deploy:**
- [ ] API_BASE updated
- [ ] .env.production created
- [ ] Frontend deployed
- [ ] CORS configured
- [ ] Test frontend

### **Post-Deploy:**
- [ ] All features tested
- [ ] Custom domain added (optional)
- [ ] Auto-deployment working
- [ ] Monitor errors (Vercel dashboard)

---

## 🐛 TROUBLESHOOTING

### **Problem 1: "Function Timeout"**

**Cause:** Serverless timeout (10s free tier)

**Solution:**
- Upgrade Vercel Pro
- Or deploy backend to Railway/Render

### **Problem 2: "CORS Error"**

**Cause:** Frontend domain not in CORS whitelist

**Solution:**
Update `backend/src/index.ts` cors origin

### **Problem 3: "MongoDB Connection Failed"**

**Cause:** IP not whitelisted

**Solution:**
MongoDB Atlas → Network Access → Add `0.0.0.0/0`

### **Problem 4: "Environment Variables Not Found"**

**Cause:** Env vars not set in Vercel

**Solution:**
Vercel Dashboard → Project Settings → Environment Variables

### **Problem 5: "Video Won't Play"**

**Cause:** Proxy timeout or ISP blocking

**Solution:**
- Use VPN on client side
- Or deploy backend to non-serverless platform

---

## 📱 MOBILE ACCESS

Setelah deploy:
- ✅ Access dari HP: `https://rizhub-streaming.vercel.app`
- ✅ Share link ke teman
- ✅ Works di semua devices
- ✅ PWA ready (bisa di-install ke home screen!)

---

## 🎉 DONE!

**Your RizHub is now LIVE!** 🚀

**Links:**
- Frontend: `https://rizhub-streaming.vercel.app`
- Backend: `https://rizhub-backend.vercel.app`
- GitHub: `https://github.com/rizkan1982/rizhub-streaming`

---

## 💡 NEXT STEPS

1. **Monitor:** Check Vercel analytics
2. **Optimize:** Add caching, CDN
3. **Scale:** Upgrade if needed
4. **Backup:** Regularly backup MongoDB
5. **Update:** Keep dependencies updated

---

## 🆘 NEED HELP?

**Vercel Docs:** https://vercel.com/docs
**Railway Docs:** https://docs.railway.app
**MongoDB Docs:** https://docs.atlas.mongodb.com

---

**Happy Deploying!** 🎬✨

*Made with ❤️ for RizHub*


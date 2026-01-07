# ⚡ QUICK FIX - Blank Page Vercel

## 🔥 LANGKAH CEPAT (Copy-Paste!)

### 1️⃣ Push Fix ke GitHub
```bash
git add .
git commit -m "fix: Vercel deployment"
git push origin main
```

### 2️⃣ Setup MongoDB Atlas
1. https://www.mongodb.com/cloud/atlas/register
2. Create FREE cluster
3. Database Access → Add User (save password!)
4. Network Access → Allow 0.0.0.0/0
5. Get connection string:
   ```
   mongodb+srv://username:PASSWORD@cluster.mongodb.net/rizhub
   ```

### 3️⃣ Deploy Backend
1. https://vercel.com/new
2. Import `rizhub-streaming`
3. **Root Directory:** `backend`
4. Deploy (akan gagal, OK!)
5. Settings → Environment Variables:
   ```
   MONGO_URI = mongodb+srv://username:PASSWORD@cluster.mongodb.net/rizhub
   JWT_SECRET = RizHub2025SecureJWT!@#$%
   NODE_ENV = production
   ```
6. Deployments → Redeploy
7. **Copy URL backend:** `https://xxx-backend.vercel.app`

### 4️⃣ Deploy Frontend
1. https://vercel.com/new
2. Import `rizhub-streaming`
3. **Root Directory:** KOSONG (atau `.`)
4. Deploy
5. Settings → Environment Variables:
   ```
   VITE_API_BASE = https://xxx-backend.vercel.app
   ```
   (ganti dengan URL backend Anda!)
6. Deployments → Redeploy

### 5️⃣ DONE! ✅
Buka: https://rizhub-streaming.vercel.app

---

## 🐛 Masih Error?

### Browser Console (F12) menunjukkan:

**"Failed to fetch"**
→ Backend belum deploy atau `VITE_API_BASE` salah

**"MongoNetworkError"**
→ MongoDB Network Access belum allow 0.0.0.0/0

**Blank putih tanpa error**
→ `VITE_API_BASE` belum di-set atau belum redeploy

---

## 📚 Dokumentasi Lengkap

Lihat: `VERCEL_DEPLOY_NOW.md`

---

**🎯 Yang Penting:**
1. Backend = Root Directory `backend`
2. Frontend = Root Directory KOSONG
3. Set environment variables
4. **REDEPLOY** setelah set env var!


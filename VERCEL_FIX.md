# 🚀 Fix Vercel Blank Page Issue

## ✅ Masalah yang Sudah Diperbaiki

Saya telah memperbaiki konfigurasi deployment Anda:

### 1. **package.json** - Ditambahkan script `vercel-build`
```json
"scripts": {
  "vercel-build": "vite build"
}
```

### 2. **vercel.json** - Disederhanakan konfigurasi
Konfigurasi sebelumnya terlalu kompleks. Sekarang menggunakan format Vercel modern:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. **Environment Variables** - Template dibuat
- `.env.example` - Template untuk reference
- `.env` - File lokal development

---

## 📋 Langkah-langkah Deploy Ulang

### **STEP 1: Push ke GitHub**

```bash
# Commit perubahan
git add .
git commit -m "fix: Vercel deployment configuration"

# Push ke GitHub
git push origin main
```

### **STEP 2: Deploy Backend ke Vercel**

**PENTING:** Frontend memerlukan backend yang sudah running!

1. **Buka Vercel Dashboard:** https://vercel.com/dashboard
2. **Import Backend:**
   - Click "Add New" → "Project"
   - Pilih repository `rizhub-streaming`
   - **Root Directory:** `backend`
   - Framework: Other
   - Click "Deploy"

3. **Set Environment Variables untuk Backend:**
   - Settings → Environment Variables
   - Tambahkan:
     ```
     MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/rizhub
     JWT_SECRET = your-secret-key-here-change-this
     NODE_ENV = production
     ```

4. **Redeploy Backend:**
   - Deployments → Latest → "..." → Redeploy

5. **Copy Backend URL:**
   - Setelah deploy berhasil, copy URL-nya
   - Contoh: `https://rizhub-streaming-backend.vercel.app`

### **STEP 3: Deploy Frontend ke Vercel**

1. **Import Frontend:**
   - Click "Add New" → "Project"
   - Pilih repository `rizhub-streaming` (atau buat project baru)
   - **Root Directory:** `.` (root/kosongkan)
   - Framework: Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

2. **Set Environment Variables untuk Frontend:**
   - Settings → Environment Variables
   - Tambahkan:
     ```
     VITE_API_BASE = https://rizhub-streaming-backend.vercel.app
     ```
   - **PENTING:** Ganti dengan URL backend Anda yang sebenarnya!

3. **Redeploy Frontend:**
   - Deployments → Latest → "..." → Redeploy

### **STEP 4: Verifikasi**

1. **Test Backend:**
   ```
   https://your-backend-url.vercel.app/xvideos/search?key=trending&page=1
   ```
   Harus return JSON data

2. **Test Frontend:**
   ```
   https://rizhub-streaming.vercel.app
   ```
   Harus tampil homepage dengan video cards

---

## 🎯 Alternatif: Single Vercel Project (Monorepo)

Jika Anda ingin deploy frontend & backend dalam 1 project:

### **vercel.json** (Root):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

Dengan setup ini:
- Frontend: `https://rizhub-streaming.vercel.app`
- Backend: `https://rizhub-streaming.vercel.app/api/...`

**Environment Variable:**
```
VITE_API_BASE = https://rizhub-streaming.vercel.app/api
```

---

## 🐛 Troubleshooting

### Masih Blank Page?

1. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Click deployment → View Build Logs
   - Cari error di log

2. **Check Browser Console:**
   - Buka https://rizhub-streaming.vercel.app
   - Press F12 → Console tab
   - Lihat error message

3. **Common Errors:**

   **Error: "Failed to fetch"**
   - Backend belum di-deploy
   - CORS issue
   - Environment variable `VITE_API_BASE` salah

   **Error: "Unexpected token '<'"**
   - Routing issue (sudah diperbaiki dengan rewrites)

   **Error: Build failed**
   - Dependencies issue
   - Check package.json version compatibility

### Environment Variable Tidak Bekerja?

**PENTING:** Environment variables dengan prefix `VITE_` harus di-set saat BUILD TIME!

1. **Set di Vercel Dashboard:**
   - Settings → Environment Variables
   - Add: `VITE_API_BASE = https://your-backend.vercel.app`

2. **Redeploy (WAJIB):**
   - Deployments → Latest → "..." → Redeploy
   - Environment variables hanya apply setelah redeploy

3. **Verify in Browser:**
   ```javascript
   // Open browser console on your site
   console.log(import.meta.env.VITE_API_BASE);
   ```

---

## 📊 Checklist Deployment

- [ ] Backend di-deploy ke Vercel
- [ ] Backend environment variables di-set (MONGO_URI, JWT_SECRET)
- [ ] Backend bisa diakses (test API endpoint)
- [ ] Frontend environment variable di-set (VITE_API_BASE)
- [ ] Frontend di-deploy ke Vercel
- [ ] Frontend di-redeploy setelah set env var
- [ ] Browser tidak error (F12 console)
- [ ] Video bisa di-load

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs - Environment Variables:** https://vercel.com/docs/environment-variables
- **Vercel Docs - Vite:** https://vercel.com/docs/frameworks/vite

---

## 💡 Tips

1. **Separate Deployment (Recommended):**
   - Deploy backend & frontend sebagai 2 project terpisah
   - Lebih mudah di-manage
   - Lebih jelas error-nya dimana

2. **Check Logs:**
   - Selalu check build logs di Vercel
   - Check function logs untuk backend errors

3. **Use Vercel CLI (Optional):**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

4. **Local Preview:**
   ```bash
   npm run build
   npm run preview
   ```

---

**Selamat Deploy! 🚀**

Jika masih ada masalah, kirim screenshot dari:
1. Vercel build logs
2. Browser console (F12)
3. Network tab (F12 → Network)


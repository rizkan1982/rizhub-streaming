# 🚀 Deploy RizHub ke Vercel - Quick Fix

## ⚠️ Masalah Anda
Website `rizhub-streaming.vercel.app` menampilkan blank page putih.

## ✅ Solusi yang Sudah Diterapkan

Saya sudah memperbaiki file-file ini:
- ✅ `package.json` → Ditambah script `vercel-build`
- ✅ `vercel.json` → Konfigurasi deployment diperbaiki
- ✅ `backend/package.json` → Ditambah script `vercel-build`
- ✅ `backend/vercel.json` → Konfigurasi backend diperbaiki

---

## 📝 LANGKAH MUDAH (IKUTI URUTAN!)

### 🔴 STEP 1: Push ke GitHub (5 menit)

```bash
git add .
git commit -m "fix: Vercel deployment configuration"
git push origin main
```

**✅ Cek:** Buka https://github.com/rizkan1982/rizhub-streaming dan pastikan commit terbaru muncul

---

### 🟠 STEP 2: Setup MongoDB Atlas (10 menit)

Anda perlu MongoDB database untuk backend:

1. **Buka:** https://www.mongodb.com/cloud/atlas/register
2. **Daftar/Login** (gratis)
3. **Create Cluster:**
   - Pilih "FREE" (M0)
   - Region: Singapore atau terdekat
   - Cluster Name: rizhub-cluster
   - Click "Create Cluster"

4. **Setup Database Access:**
   - Sidebar → Database Access → Add New Database User
   - Username: `rizhub_admin`
   - Password: Generate password (SAVE INI!)
   - Built-in Role: `Read and write to any database`
   - Add User

5. **Setup Network Access:**
   - Sidebar → Network Access → Add IP Address
   - Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)
   - Confirm

6. **Get Connection String:**
   - Sidebar → Database → Click "Connect" (pada cluster Anda)
   - Choose "Connect your application"
   - Driver: Node.js
   - Copy connection string (seperti ini):
     ```
     mongodb+srv://rizhub_admin:<password>@rizhub-cluster.xxxxx.mongodb.net/
     ```
   - **GANTI `<password>` dengan password yang Anda generate tadi**
   - **Tambahkan `/rizhub` di akhir:**
     ```
     mongodb+srv://rizhub_admin:PASSWORD_ANDA@rizhub-cluster.xxxxx.mongodb.net/rizhub
     ```

**✅ SAVE Connection String ini! Akan dipakai di Step 3 & 4**

---

### 🟡 STEP 3: Deploy Backend ke Vercel (10 menit)

1. **Buka Vercel Dashboard:** https://vercel.com/dashboard

2. **Add New Project:**
   - Click "Add New" → "Project"
   - Import `rizhub-streaming` repository
   - **PENTING:** Set "Root Directory" → `backend`
   - Click "Edit" di sebelah Root Directory, ketik: `backend`
   - Framework Preset: Other
   - Click "Deploy" (akan gagal dulu, normal!)

3. **Set Environment Variables:**
   - Setelah deploy (meskipun gagal), click project name
   - Tab "Settings" → "Environment Variables"
   - Tambahkan 3 variables ini:

   | Name | Value |
   |------|-------|
   | `MONGO_URI` | Connection string dari Step 2 |
   | `JWT_SECRET` | `RizHub2025SecureJWT!@#$%` |
   | `NODE_ENV` | `production` |

4. **Redeploy Backend:**
   - Tab "Deployments"
   - Click deployment yang paling atas
   - Click tombol "..." (3 titik)
   - Click "Redeploy"
   - Tunggu sampai selesai (sekitar 2-3 menit)

5. **Copy Backend URL:**
   - Setelah berhasil, akan ada URL seperti:
     ```
     https://rizhub-streaming-backend.vercel.app
     ```
   - Atau bisa juga:
     ```
     https://rizhub-streaming-rizkan1982s-projects.vercel.app
     ```
   - **SAVE URL ini untuk Step 4!**

6. **Test Backend:**
   - Buka URL backend + `/xvideos/search?key=trending&page=1`
   - Contoh: `https://rizhub-streaming-backend.vercel.app/xvideos/search?key=trending&page=1`
   - Harus return JSON data (bukan error)

**✅ Kalau muncul JSON data, backend berhasil! Lanjut Step 4**

---

### 🟢 STEP 4: Deploy Frontend ke Vercel (5 menit)

1. **Buka Project Frontend di Vercel:**
   - Dashboard: https://vercel.com/dashboard
   - Cari project `rizhub-streaming` (yang TANPA backend)
   - Atau buat project baru:
     - "Add New" → "Project"
     - Import `rizhub-streaming`
     - **Root Directory: KOSONGKAN** (atau isi `.`)
     - Framework: Vite
     - Deploy

2. **Set Environment Variable:**
   - Settings → Environment Variables
   - Add variable:

   | Name | Value |
   |------|-------|
   | `VITE_API_BASE` | URL backend dari Step 3 (tanpa trailing slash) |

   **Contoh:**
   ```
   VITE_API_BASE = https://rizhub-streaming-backend.vercel.app
   ```

3. **Redeploy Frontend:**
   - Tab "Deployments"
   - Click deployment teratas
   - "..." → "Redeploy"
   - Tunggu selesai

4. **Test Website:**
   - Buka: https://rizhub-streaming.vercel.app
   - Harus tampil homepage dengan video cards!

**✅ SELESAI! 🎉**

---

## 🎯 Summary Setup

Anda akan punya 2 Vercel projects:

| Project | Root Directory | Environment Variables | URL |
|---------|----------------|----------------------|-----|
| **Backend** | `backend` | MONGO_URI, JWT_SECRET, NODE_ENV | https://xxx-backend.vercel.app |
| **Frontend** | `.` (root) | VITE_API_BASE | https://rizhub-streaming.vercel.app |

---

## 🐛 Troubleshooting

### Backend deploy gagal?

**Error: "Build failed"**
- Pastikan Root Directory = `backend`
- Pastikan Environment Variables sudah di-set
- Check build logs untuk error spesifik

**Error: "MongoNetworkError"**
- MongoDB Network Access belum allow 0.0.0.0/0
- Connection string salah (cek password)

### Frontend masih blank?

**Blank putih:**
- Buka browser console (F12)
- Lihat error message
- Biasanya: `VITE_API_BASE` belum di-set atau salah

**Error: "Failed to fetch"**
- Backend belum di-deploy
- `VITE_API_BASE` URL salah
- Backend error (test backend URL langsung di browser)

**Error: "CORS"**
- Backend belum allow CORS
- Check backend logs

### Environment Variable tidak bekerja?

**PENTING:** Environment variables dengan prefix `VITE_` hanya apply saat BUILD!

1. Set variable di Vercel Dashboard
2. **WAJIB Redeploy setelah set env var**
3. Clear browser cache
4. Test lagi

---

## 📞 Butuh Bantuan?

Kalau masih error, kirim ke saya:

1. **Screenshot Vercel Build Logs:**
   - Deployments → Click deployment → Build Logs

2. **Screenshot Browser Console:**
   - Buka website → F12 → Console tab

3. **Screenshot Network Tab:**
   - F12 → Network tab → Refresh page

---

## 🎉 Setelah Berhasil

- Homepage: https://rizhub-streaming.vercel.app
- Admin Panel: https://rizhub-streaming.vercel.app/admin/login
  - Username: `rizhub_admin`
  - Password: `RizHub2025!@#SecurePass`

**⚠️ GANTI PASSWORD ADMIN SETELAH LOGIN!**

---

**Good luck! 🚀**


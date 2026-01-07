# 🎬 LUSTPRESS CINEMA - Quick Start Guide

## 📋 Prerequisites
- Node.js v14 atau lebih tinggi
- npm atau yarn

---

## 🚀 Cara Menjalankan Aplikasi

### 1️⃣ Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
npm install
```

### 2️⃣ Setup Environment (Optional)

Backend akan berjalan tanpa Redis (caching akan di-skip). Jika ingin menggunakan Redis:

```bash
# Di folder backend, buat file .env
PORT=3000
REDIS_URL=redis://localhost:6379
EXPIRE_CACHE=24
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

### 3️⃣ Jalankan Backend (Terminal 1)

```bash
cd backend
npm run start:dev
```

Backend akan berjalan di: **http://localhost:3000**

### 4️⃣ Jalankan Frontend (Terminal 2)

```bash
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173** (atau port lain yang ditampilkan)

---

## 🎨 Fitur-Fitur Aplikasi

### ✨ Cinema Classic Theme
- Tema warna Gold & Burgundy yang elegant
- Animasi smooth dan hover effects
- Responsive design untuk semua ukuran layar

### 🔍 Multi-Platform Search
Mendukung 6 platform:
- XVideos
- Pornhub
- XNXX
- RedTube
- XHamster
- YouPorn

### 🎭 Fitur Lengkap
- ✅ Search videos dengan keyword
- ✅ Trending/Random videos di homepage
- ✅ Video player dengan iframe embed
- ✅ Video details (views, rating, duration, tags)
- ✅ Related videos di sidebar
- ✅ Loading states dengan shimmer effect
- ✅ Error handling yang informatif
- ✅ Smooth navigation

---

## 🛠️ Troubleshooting

### Backend tidak bisa connect
- Pastikan backend sudah running di port 3000
- Check apakah ada error di terminal backend
- Coba restart backend dengan Ctrl+C lalu jalankan lagi

### Video tidak bisa play
- Beberapa platform memerlukan iframe embed
- Browser mungkin memblok konten dari sumber external
- Coba video lain atau platform berbeda

### Redis Error
- Jika tidak punya Redis, kosongkan REDIS_URL di .env
- Aplikasi akan tetap berjalan tanpa caching

---

## 📂 Struktur Project

```
lustpress/
├── backend/              # Backend API (Express + TypeScript)
│   ├── src/
│   │   ├── controller/  # Request handlers
│   │   ├── scraper/     # Web scraping logic
│   │   ├── router/      # Route definitions
│   │   └── index.ts     # Main entry
│   └── package.json
│
├── src/                 # Frontend (React + Vite)
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── VideoCard.jsx
│   │   └── Loading.jsx
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   └── WatchPage.jsx
│   └── index.css       # Cinema Classic theme
│
└── package.json
```

---

## 🎯 API Endpoints

### Search Videos
```
GET /xvideos/search?key=query&page=1
GET /pornhub/search?key=query&page=1
```

### Get Video Details
```
GET /xvideos/get?id=videoId
GET /pornhub/get?id=videoId
```

### Random Video
```
GET /xvideos/random
GET /pornhub/random
```

### Related Videos
```
GET /xvideos/related?id=videoId
GET /pornhub/related?id=videoId
```

---

## 🎨 Design Inspiration

Project ini menggunakan tema **Cinema Classic** dengan:
- **Warna Primary:** Gold (#d4af37) - untuk aksen dan highlights
- **Warna Secondary:** Burgundy (#6b1423) - untuk gradients
- **Background:** Navy/Charcoal (#0a0e27, #1a1a2e) - untuk background gelap
- **Typography:** Inter font untuk keterbacaan optimal
- **Layout:** Card-based layout seperti movie posters

Inspirasi: Classic Movie Theaters + IMDb + Letterboxd

---

## 💡 Tips Penggunaan

1. **Search Tips:**
   - Gunakan keyword yang spesifik
   - Pilih platform yang berbeda untuk hasil yang berbeda
   - Hasil search akan muncul otomatis

2. **Platform Selector:**
   - Klik platform di navbar untuk switch
   - Setiap platform punya konten yang berbeda
   - Beberapa platform lebih cepat dari yang lain

3. **Video Playback:**
   - Klik video card untuk mulai menonton
   - Video akan auto-load dengan iframe embed
   - Gunakan controls di video player untuk pause/play/fullscreen

4. **Related Videos:**
   - Scroll di sidebar untuk video terkait
   - Klik untuk langsung menonton
   - Related videos berdasarkan tags dan category

---

## 🌟 Next Features (Ideas)

- [ ] Favorites/Bookmarks
- [ ] History tracking
- [ ] Dark/Light theme toggle
- [ ] Download video option
- [ ] Comment system
- [ ] User accounts
- [ ] Playlists

---

## 📝 Notes

- Backend menggunakan web scraping, jadi tergantung struktur HTML website target
- Jika ada error, kemungkinan website target mengubah struktur HTML
- Rate limiting sudah diaktifkan untuk mencegah spam
- Cache akan membantu performa jika Redis diaktifkan

---

## 🤝 Support

Jika ada masalah atau pertanyaan:
1. Check terminal untuk error messages
2. Pastikan semua dependencies ter-install
3. Restart kedua server (backend & frontend)
4. Clear browser cache jika perlu

---

**Selamat menikmati Cinema Collection! 🎬🍿**


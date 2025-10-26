# 📢 Panduan Setup Iklan PropellerAds

## 🎯 Platform Yang Digunakan: PropellerAds

**Kenapa PropellerAds?**
- ✅ Accept Adult Content
- ✅ Banyak advertiser Indonesia  
- ✅ Simple setup (copy-paste script)
- ✅ Payment via Payoneer/Wire Transfer (bisa ke bank Indonesia)
- ✅ Earning bagus untuk traffic Indo

---

## 📝 Cara Daftar PropellerAds

### 1. Daftar Akun
1. Kunjungi: https://propellerads.com/
2. Klik "**Sign Up**" → Pilih "**Publisher**"
3. Isi form pendaftaran:
   - **Email**: Email aktif Anda
   - **Password**: Buat password kuat
   - **Website URL**: `https://indoviralhot.my.id`
   - **Category**: Adult
   - **Traffic Source**: Direct/Type-in
   - **Monthly Page Views**: Pilih estimasi (misal: 100,000+)

4. **Submit** dan tunggu email verifikasi
5. **Verifikasi email** (klik link di email)

### 2. Tunggu Approval
- Biasanya **24-48 jam**
- Cek email untuk notification approval
- Setelah approved, login ke dashboard

---

## 🔧 Cara Setup Iklan

### Step 1: Dapatkan Zone ID

1. Login ke **PropellerAds Dashboard**: https://partners.propellerads.com/
2. Klik "**Sites**" di menu kiri
3. Klik "**Add Site**" atau pilih site yang sudah ada
4. Pilih **Ad Format:**

#### **A. Pop-under (untuk first load website)**
- Klik "**Create Zone**"
- Pilih format: "**OnClick Popunder**"
- Copy **Zone ID** (contoh: `7654321`)

#### **B. Interstitial (untuk sebelum play video)**
- Klik "**Create Zone**"  
- Pilih format: "**Interstitial**"
- Copy **Zone ID** (contoh: `7654322`)

---

### Step 2: Update Code

#### **1. Update Pop-under di `index.html`**

Buka file: `index.html`

Cari baris:
```html
})('glizauvo.net', 'YOUR_POPUNDER_ZONE_ID', document.createElement('script'))
```

Ganti `YOUR_POPUNDER_ZONE_ID` dengan Zone ID Pop-under Anda:
```html
})('glizauvo.net', '7654321', document.createElement('script'))
```

#### **2. Update Interstitial di `src/components/InterstitialAd.jsx`**

Buka file: `src/components/InterstitialAd.jsx`

Cari baris:
```javascript
script.src = 'https://glizauvo.net/400/YOUR_INTERSTITIAL_ZONE_ID';
```

Ganti `YOUR_INTERSTITIAL_ZONE_ID` dengan Zone ID Interstitial Anda:
```javascript
script.src = 'https://glizauvo.net/400/7654322';
```

---

### Step 3: Push ke GitHub & Deploy

```bash
git add index.html src/components/InterstitialAd.jsx
git commit -m "feat: Setup PropellerAds Zone IDs"
git push origin main
```

Tunggu Vercel auto-deploy (~1-2 menit).

---

## 💰 Cara Kerja Monetisasi

### **1. Pop-under Ad (First Load)**
- Muncul **saat user pertama buka website**
- Opens in **new tab/window**
- Earning: **~$2-5 per 1000 views** (tergantung traffic quality)

### **2. Interstitial Ad (Before Play)**
- Muncul **saat user klik play button**
- Full-screen ad dengan **countdown 5 detik**
- Earning: **~$5-10 per 1000 plays**

---

## 📊 Estimasi Earnings (Indonesia Traffic)

| Traffic/Hari | Pop-under | Interstitial | Total/Bulan |
|--------------|-----------|--------------|-------------|
| 1,000 views  | $2-5      | $5-10        | $210-450    |
| 5,000 views  | $10-25    | $25-50       | $1,050-2,250|
| 10,000 views | $20-50    | $50-100      | $2,100-4,500|

*Note: Estimasi kasar, actual earnings bisa bervariasi*

---

## 🎮 Testing Iklan

### Setelah Deploy:

1. **Buka website** (incognito mode): https://indoviralhot.my.id/
   - Harusnya muncul **pop-under** (new tab)

2. **Klik video**, lalu **klik play button**:
   - Harusnya muncul **interstitial ad**
   - Tunggu **5 detik**
   - Klik "**Lanjutkan Menonton**"
   - Video auto-play

---

## 💸 Cara Withdraw Earnings

### Minimum Payout:
- **$100** (Wire Transfer)
- **$50** (Payoneer)

### Setup Payment:

1. Di PropellerAds dashboard, klik "**Billing**"
2. Pilih payment method:
   - **Payoneer** (Recommended untuk Indonesia)
   - **Wire Transfer** (ke bank Indonesia)
3. Isi detail bank/Payoneer
4. Request payout setiap **awal bulan**

---

## ❓ FAQ

### Q: Apakah PropellerAds accept adult content?
**A:** Ya, PropellerAds adalah salah satu platform yang accept adult content.

### Q: Berapa lama approval?
**A:** Biasanya 24-48 jam. Cek email untuk notification.

### Q: Apakah harus punya traffic dulu?
**A:** Tidak, bisa daftar dulu sebelum ada traffic. Tapi approval lebih cepat kalau sudah ada traffic.

### Q: Minimal traffic untuk approved?
**A:** Tidak ada minimum strict, tapi biasanya butuh minimal 500-1000 page views/hari.

### Q: Bisa pakai multiple ad networks?
**A:** Ya, bisa combine PropellerAds dengan AdsTerra atau platform lain.

### Q: Apakah melanggar ToS Vercel?
**A:** Selama content legal dan ad network legitimate (seperti PropellerAds), tidak masalah.

---

## 🚀 Optimization Tips

1. **Jangan spam iklan** - user experience tetap penting
2. **Test different ad placements**
3. **Monitor CTR di dashboard**
4. **Gunakan GEO targeting** (fokus ke Indonesia untuk CPC lebih tinggi)
5. **Track conversions** untuk optimize placement

---

## 📞 Support

**PropellerAds Support:**
- Email: support@propellerads.com
- Live Chat: Di dashboard (bottom right)
- Telegram: @PropellerAdsSupport

**Website Issue:**
- Check Vercel logs: https://vercel.com/dashboard
- Check browser console (F12)

---

## ✅ Checklist Setup

- [ ] Daftar akun PropellerAds
- [ ] Tunggu approval (24-48 jam)
- [ ] Dapatkan Zone ID untuk Pop-under
- [ ] Dapatkan Zone ID untuk Interstitial
- [ ] Update `index.html` dengan Pop-under Zone ID
- [ ] Update `InterstitialAd.jsx` dengan Interstitial Zone ID
- [ ] Push ke GitHub
- [ ] Test pop-under (buka website incognito)
- [ ] Test interstitial (klik play video)
- [ ] Monitor earnings di dashboard

---

**Good luck monetizing! 💰🚀**


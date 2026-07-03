# 🚀 Panduan Lengkap Backend API & Deployment Railway

Proyek ini telah dilengkapi dengan **Backend API Node.js + Express + MySQL** yang tersambung dengan **Frontend Online Store (TekTok Shop)** serta fitur **Forward Notifikasi Pesanan ke WhatsApp Owner via Fonnte Gateway**.

---

## 📁 Struktur Folder Tambahan (Backend)

```
Trisna_ibnu_UTS_Web2/
├── backend/
│   ├── config/
│   │   └── db.js                  # Koneksi Database MySQL Pool (Support Railway MySQL)
│   ├── controllers/
│   │   ├── productController.js   # CRUD Produk & Kategori
│   │   ├── checkoutController.js  # Checkout & Kirim Notif WhatsApp via Fonnte
│   │   └── orderController.js     # Manajemen Pesanan
│   ├── routes/
│   │   └── apiRoutes.js           # Endpoint Routing API
│   ├── .env                       # Environment Variables Lokal
│   ├── .env.example               # Contoh Konfigurasi Env
│   ├── package.json               # Dependensi Node.js
│   └── server.js                  # Entry Point Server API
├── tektok_shop_db.sql             # SQL Dump Lengkap (70 Produk & Tabel Orders)
├── Online_Store_UTS_API.postman_collection.json # File Postman Collection siap import
└── Bang_IB-shop/                  # Frontend Online Store
```

---

## 🗄️ A. File SQL & Postman Collection (Untuk Tugas UTS)

1. **File SQL Dump**: `tektok_shop_db.sql` (ada di folder root proyek dan di dalam folder `backend/`).
   - Berisi pembuatan database `tektok_shop_db`.
   - Berisi tabel `products` dengan **70 item produk lengkap** sesuai dengan `products.json` frontend.
   - Berisi tabel `orders` untuk menampung transaksi checkout.
2. **File Postman Collection**: `Online_Store_UTS_API.postman_collection.json`.
   - Siap di-import langsung ke aplikasi Postman.
   - Sudah mencakup testing untuk **CRUD Produk**, **Filter & Search**, **Checkout (Forward WA)**, dan **Manajemen Status Order**.

---

## 🛠️ B. Cara Menjalankan Backend secara Lokal (Di Komputer)

1. **Pastikan MySQL Aktif** (XAMPP / Laragon / MySQL Server).
2. Buka phpMyAdmin atau MySQL Client, lalu import file `tektok_shop_db.sql` atau eksekusi kodenya.
3. Buka terminal di folder `backend/`:
   ```bash
   cd backend
   npm install
   ```
4. Sesuaikan konfigurasi database dan WhatsApp di file `.env` (dalam folder `backend/`):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=tektok_shop_db
   
   # Konfigurasi Notifikasi WhatsApp Owner (Fonnte)
   FONNTE_TOKEN=token_fonnte_kamu
   ADMIN_WA=081234567890
   ```
5. Jalankan server:
   ```bash
   npm start
   ```
   Server akan aktif di `http://localhost:5000`.

---

## 🚂 C. Langkah Deployment ke Railway (Database MySQL + API Node.js)

### 1. Buat Project & Database MySQL di Railway
1. Login ke [Railway.app](https://railway.app/) menggunakan akun GitHub kamu.
2. Klik **New Project** → Pilih **Provision MySQL**.
3. Railway akan otomatis membuatkan server MySQL cloud. Klik kotak **MySQL** tersebut → pilih tab **Variables** untuk melihat kredensial koneksi.

### 2. Deploy Backend API Node.js ke Railway
1. Di project Railway yang sama, klik tombol **+ New** (di pojok kanan atas) → Pilih **GitHub Repo** → Pilih repositori UTS kamu (`Trisnaibnu97/Trisna_Ibnu_M_UTS_WEB2`).
2. Klik layanan repo yang baru ditambahkan → Masuk ke tab **Settings**:
   - Di bagian **Root Directory**, isi dengan: `/backend`
3. Masuk ke tab **Variables** di layanan Node.js tersebut, lalu tambahkan variabel berikut:
   - `PORT` : `5000`
   - `FONNTE_TOKEN` : `Token Fonnte kamu` (ambil dari dashbord fonnte.com)
   - `ADMIN_WA` : `Nomor WA owner` (contoh: `081234567890`)
   *(Catatan: Kode kita sudah mendeteksi otomatis variabel `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT` dari Railway jika MySQL berada dalam satu project)*.
4. Masuk ke tab **Settings** → **Networking** → Klik **Generate Domain** untuk mendapatkan URL publik (contoh: `https://backend-uts.up.railway.app`).

### 3. Import Database SQL di Railway MySQL
1. Kamu bisa menghubungkan MySQL cloud Railway menggunakan aplikasi seperti **DBeaver**, **HeidiSQL**, **MySQL Workbench**, atau via CLI menggunakan kredensial dari tab **Variables** MySQL Railway.
2. Import file `tektok_shop_db.sql` ke dalam database Railway tersebut.

---

## 🔗 D. Menghubungkan Frontend ke Backend Railway

Setelah API berhasil di-deploy ke Railway dan mendapatkan domain:
1. Buka file `Bang_IB-shop/js/utils.js`.
2. Ubah baris ke-5 pada `API_BASE_URL`:
   ```javascript
   // Ganti http://localhost:5000/api dengan domain Railway kamu
   API_BASE_URL: 'https://domain-kamu.up.railway.app/api',
   ```
3. Push perubahan ke GitHub. Frontend kamu di GitHub Pages kini otomatis mengkonsumsi data real-time dari backend Railway dan mengirim notifikasi WA saat pembeli melakukan pembayaran! 📲🎉

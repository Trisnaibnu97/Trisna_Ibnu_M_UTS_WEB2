# 🛍️ TekTok Shop

Aplikasi online shop sederhana berbasis Fullstack JavaScript + Tailwind CSS, dibuat sebagai proyek UTS mata kuliah Web Programming 2.

## Deskripsi

TekTok Shop adalah platform belanja online yang memungkinkan pengguna untuk melihat produk, menambahkan ke keranjang, melakukan checkout, dan melihat riwayat pesanan. Semua data disimpan menggunakan LocalStorage sebagai simulasi database.

## Fitur

- **Authentication** — Register & Login dengan validasi email unik dan password minimal 6 karakter
- **Product Listing** — Menampilkan produk dari file JSON dengan grid responsif
- **Detail Produk** — Halaman detail lengkap tiap produk
- **Search & Filter** — Cari produk berdasarkan nama, filter kategori, dan urutkan harga/rating
- **Keranjang Belanja** — Tambah, hapus, update jumlah item, total harga otomatis
- **Checkout** — Form pengiriman (nama, alamat, no HP, metode pembayaran), generate ID transaksi unik
- **Riwayat Pesanan** — Tampilkan semua transaksi user beserta detail
- **Wishlist** — Simpan produk favorit (fitur bonus)
- **Dark Mode** — Toggle tema gelap/terang (fitur bonus)
- **Pagination** — Navigasi halaman produk (fitur bonus)
- **Toast Notification** — Notifikasi custom untuk setiap aksi (fitur bonus)
- **Rating Produk** — Tampilan bintang rating tiap produk (fitur bonus)

## Teknologi

- HTML5
- JavaScript ES6+ (Vanilla)
- Tailwind CSS (via CDN)
- LocalStorage
- JSON (dummy data produk)

## Cara Menjalankan

### Lokal
1. Clone repository ini
2. Buka folder `tektok-shop/`
3. Jalankan dengan live server (VS Code Live Server / Python HTTP Server)
   ```bash
   # Python
   python -m http.server 8080
   # Lalu buka http://localhost:8080
   ```
4. Atau langsung buka `index.html` di browser (beberapa browser memblokir fetch JSON via file://, gunakan live server)

### Akun Demo
Daftar akun baru melalui halaman Register, lalu login.

## Struktur Folder

```
tektok-shop/
├── index.html        # Halaman Login
├── register.html     # Halaman Register
├── shop.html         # Halaman Toko / Product List
├── product.html      # Halaman Detail Produk
├── cart.html         # Halaman Keranjang
├── checkout.html     # Halaman Checkout
├── orders.html       # Halaman Riwayat Pesanan
├── wishlist.html     # Halaman Wishlist
├── data/
│   └── products.json # Data dummy produk
├── js/
│   ├── utils.js      # Fungsi utilitas & helper
│   ├── auth.js       # Logic autentikasi
│   ├── products.js   # Logic produk & detail
│   ├── cart.js       # Logic keranjang
│   ├── checkout.js   # Logic checkout
│   └── orders.js     # Logic riwayat pesanan
└── README.md
```

## Link Demo

> [Bang IB Shop - Live Demo](https://trisnaibnu97.github.io/Trisna_Ibnu_M_UTS_WEB2/)

## Deploy ke GitHub Pages

1. Push semua file ke repository GitHub (public)
2. Masuk ke Settings → Pages
3. Source: pilih branch `main`, folder `/root` atau `/tektok-shop`
4. Simpan, tunggu beberapa menit, URL akan muncul

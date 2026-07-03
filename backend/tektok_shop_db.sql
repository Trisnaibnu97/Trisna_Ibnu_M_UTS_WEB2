-- ==========================================================
-- Database SQL Dump untuk Online Store UTS (Tektok Shop)
-- Dibuat oleh: Trisna Ibnu M
-- ==========================================================

CREATE DATABASE IF NOT EXISTS tektok_shop_db;
USE tektok_shop_db;

-- --------------------------------------------------------
-- Struktur tabel untuk produk
-- --------------------------------------------------------
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DOUBLE NOT NULL,
  category VARCHAR(100) NOT NULL,
  image TEXT,
  description TEXT,
  stock INT DEFAULT 0,
  rating FLOAT DEFAULT 5.0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Dumping data untuk tabel produk (70 Produk Lengkap)
-- --------------------------------------------------------
INSERT INTO products (id, name, price, category, image, description, stock, rating) VALUES
(1, 'Kemeja Flannel Pria Kotak-Kotak', 135000, 'Fashion Pria', 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400&auto=format&fit=crop', 'Kemeja flannel pria motif kotak-kotak, bahan tebal hangat, cocok untuk casual maupun outdoor.', 40, 4.6),
(2, 'Celana Chino Slim Fit', 175000, 'Fashion Pria', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&auto=format&fit=crop', 'Celana chino slim fit pria, bahan stretch nyaman dipakai seharian, tersedia berbagai warna.', 35, 4.5),
(3, 'Jaket Bomber Pria', 285000, 'Fashion Pria', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop', 'Jaket bomber pria bahan parasut, ringan dan tahan angin, desain modern minimalis.', 20, 4.7),
(4, 'Kaos Oversize Distro', 95000, 'Fashion Pria', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop', 'Kaos oversize distro bahan cotton 30s, sablon berkualitas, tidak mudah luntur.', 60, 4.4),
(5, 'Sepatu Boots Pria Kulit', 420000, 'Fashion Pria', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop', 'Sepatu boots pria bahan kulit sintetis premium, sol karet tebal, cocok untuk segala medan.', 15, 4.8),
(6, 'Topi Snapback Polos', 65000, 'Fashion Pria', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop', 'Topi snapback polos bahan twill, adjustable, cocok untuk semua ukuran kepala.', 50, 4.3),
(7, 'Dress Midi Floral Wanita', 195000, 'Fashion Wanita', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop', 'Dress midi motif bunga cantik, bahan rayon adem, cocok untuk hangout maupun kondangan.', 30, 4.7),
(8, 'Blouse Wanita Polos Premium', 115000, 'Fashion Wanita', 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&auto=format&fit=crop', 'Blouse wanita bahan sifon premium, adem dan jatuh, cocok untuk kerja maupun casual.', 45, 4.5),
(9, 'Rok Plisket Midi', 145000, 'Fashion Wanita', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&auto=format&fit=crop', 'Rok plisket midi wanita, bahan pleated elastis, nyaman dan elegan untuk berbagai acara.', 25, 4.6),
(10, 'Tas Selempang Wanita Mini', 165000, 'Fashion Wanita', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop', 'Tas selempang mini wanita bahan PU leather, muat HP, dompet, dan aksesoris kecil.', 38, 4.8),
(11, 'Sepatu Heels Block 5cm', 235000, 'Fashion Wanita', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop', 'Sepatu heels block 5cm wanita, nyaman dipakai lama, bahan kulit sintetis premium.', 22, 4.4),
(12, 'Hijab Segi Empat Voal', 55000, 'Fashion Wanita', 'https://images.unsplash.com/photo-1611042553365-9b101441c135?w=400&auto=format&fit=crop', 'Hijab segi empat bahan voal premium, tidak mudah kusut, tersedia banyak pilihan warna.', 80, 4.9),
(13, 'Smartphone Android 5G', 2150000, 'Elektronik', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop', 'Smartphone Android 5G RAM 8GB ROM 256GB, kamera 108MP, baterai 5000mAh fast charging 33W.', 10, 4.7),
(14, 'TWS Earbuds Bluetooth 5.3', 185000, 'Elektronik', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop', 'TWS earbuds bluetooth 5.3, noise cancelling aktif, baterai 30 jam total, case pengisian daya.', 28, 4.5),
(15, 'Smartwatch Fitness Tracker', 320000, 'Elektronik', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop', 'Smartwatch fitness tracker, monitor detak jantung, SpO2, 7 hari baterai, tahan air IP68.', 18, 4.4),
(16, 'Webcam Full HD 1080p', 275000, 'Elektronik', 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400&auto=format&fit=crop', 'Webcam full HD 1080p dengan mikrofon built-in, plug and play, cocok untuk WFH dan streaming.', 22, 4.3),
(17, 'USB Hub 7 Port 3.0', 125000, 'Elektronik', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&auto=format&fit=crop', 'USB hub 7 port USB 3.0, transfer data hingga 5Gbps, kompatibel Windows dan Mac.', 35, 4.2),
(18, 'Lampu Ring Light 10 Inch', 155000, 'Elektronik', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&auto=format&fit=crop', 'Ring light 10 inch dengan tripod, 3 mode warna, 10 level kecerahan, cocok untuk konten kreator.', 30, 4.6),
(19, 'Charger GaN 65W 3 Port', 215000, 'Elektronik', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&auto=format&fit=crop', 'Charger GaN 65W dengan 2 port USB-C dan 1 USB-A, bisa charge laptop, HP, dan tablet sekaligus.', 40, 4.7),
(20, 'Kabel Data USB-C Braided', 45000, 'Elektronik', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop', 'Kabel data USB-C braided nylon, support fast charging 60W, tahan lama tidak mudah putus.', 100, 4.4),
(21, 'Meja Belajar Lipat Portable', 385000, 'Furnitur & Dekorasi', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&auto=format&fit=crop', 'Meja belajar lipat portable, bahan MDF anti gores, bisa dilipat untuk hemat tempat.', 12, 4.5),
(22, 'Rak Buku Minimalis 5 Susun', 295000, 'Furnitur & Dekorasi', 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&auto=format&fit=crop', 'Rak buku minimalis 5 susun, bahan kayu MDF, mudah dirakit, cocok untuk kamar atau ruang kerja.', 8, 4.6),
(23, 'Cermin Dinding Aesthetic', 175000, 'Furnitur & Dekorasi', 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&auto=format&fit=crop', 'Cermin dinding aesthetic frame kayu, ukuran 40x60cm, cocok untuk dekorasi kamar modern.', 20, 4.7),
(24, 'Lampu Tidur LED RGB', 85000, 'Furnitur & Dekorasi', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop', 'Lampu tidur LED aesthetic, 16 pilihan warna RGB, remote control, cocok untuk dekorasi kamar.', 55, 4.5),
(25, 'Pot Tanaman Keramik Set 3', 125000, 'Furnitur & Dekorasi', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop', 'Set 3 pot tanaman keramik berbagai ukuran, desain minimalis, cocok untuk tanaman hias indoor.', 30, 4.4),
(26, 'Bantal Sofa Motif Geometri', 65000, 'Furnitur & Dekorasi', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop', 'Bantal sofa motif geometri, bahan cover velvet lembut, isi dakron premium, ukuran 40x40cm.', 45, 4.3),
(27, 'Skincare Set Vitamin C Brightening', 245000, 'Kecantikan', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&auto=format&fit=crop', 'Set skincare vitamin C brightening: serum, toner, dan moisturizer. Mencerahkan dan melembapkan kulit.', 25, 4.8),
(28, 'Sunscreen SPF 50 PA++++', 89000, 'Kecantikan', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop', 'Sunscreen SPF 50 PA++++, tekstur ringan tidak lengket, cocok untuk kulit berminyak dan kombinasi.', 60, 4.9),
(29, 'Lip Cream Matte 12 Warna', 55000, 'Kecantikan', 'https://images.unsplash.com/photo-1586495777744-4e6232bf2177?w=400&auto=format&fit=crop', 'Lip cream matte tahan lama 12 jam, tersedia 12 pilihan warna, formula tidak kering di bibir.', 70, 4.6),
(30, 'Sheet Mask Korea Hyaluronic', 35000, 'Kecantikan', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&auto=format&fit=crop', 'Sheet mask Korea dengan essence hyaluronic acid, melembapkan dan mencerahkan kulit dalam 20 menit.', 150, 4.7),
(31, 'Parfum Pria Woody Musk 100ml', 185000, 'Kecantikan', 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&auto=format&fit=crop', 'Parfum pria aroma woody musk, tahan 8-10 jam, botol kaca premium, cocok untuk kerja dan acara formal.', 20, 4.5),
(32, 'Serum Rambut Anti Frizz', 75000, 'Kecantikan', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop', 'Serum rambut anti frizz dengan kandungan argan oil, membuat rambut halus berkilau sepanjang hari.', 40, 4.4),
(33, 'Dumbbell Set 5kg Rubber', 195000, 'Olahraga', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop', 'Dumbbell set 5kg coating rubber, anti slip, tidak merusak lantai, cocok untuk home gym.', 18, 4.6),
(34, 'Matras Yoga 6mm Anti Slip', 145000, 'Olahraga', 'https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=400&auto=format&fit=crop', 'Matras yoga 6mm bahan TPE ramah lingkungan, anti slip, ringan dan mudah digulung.', 25, 4.5),
(35, 'Sepatu Running Pria Ringan', 375000, 'Olahraga', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop', 'Sepatu running pria ultra ringan, sol EVA empuk, upper mesh breathable, cocok untuk lari harian.', 20, 4.7),
(36, 'Botol Minum Tumbler 750ml', 85000, 'Olahraga', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop', 'Tumbler 750ml stainless steel double wall, menjaga suhu panas/dingin 12 jam, BPA free.', 55, 4.8),
(37, 'Resistance Band Set 5 Level', 95000, 'Olahraga', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&auto=format&fit=crop', 'Resistance band set 5 level ketahanan berbeda, bahan latex premium, cocok untuk stretching dan gym.', 40, 4.4),
(38, 'Skipping Rope Digital Counter', 55000, 'Olahraga', 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&auto=format&fit=crop', 'Skipping rope dengan digital counter otomatis, handle ergonomis anti slip, panjang adjustable.', 60, 4.3),
(39, 'Panci Teflon Anti Lengket 24cm', 135000, 'Dapur & Masak', 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&auto=format&fit=crop', 'Panci teflon anti lengket 24cm, lapisan granite coating, handle ergonomis, cocok untuk semua kompor.', 22, 4.6),
(40, 'Blender Portable Mini USB', 175000, 'Dapur & Masak', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&auto=format&fit=crop', 'Blender portable mini USB, kapasitas 380ml, 6 pisau stainless, bisa langsung minum dari botolnya.', 30, 4.5),
(41, 'Talenan Kayu Jati Premium', 95000, 'Dapur & Masak', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop', 'Talenan kayu jati premium, anti bakteri alami, ukuran 30x20cm, tahan lama dan mudah dibersihkan.', 35, 4.7),
(42, 'Termos Nasi Stainless 1.8L', 155000, 'Dapur & Masak', 'https://images.unsplash.com/photo-1584990347449-a2d4c2c044c9?w=400&auto=format&fit=crop', 'Termos nasi stainless 1.8L, menjaga nasi tetap hangat 6 jam, mudah dibersihkan, desain elegan.', 18, 4.5),
(43, 'Set Pisau Dapur 5 Pcs', 185000, 'Dapur & Masak', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&auto=format&fit=crop', 'Set pisau dapur 5 pcs stainless steel, tajam dan tahan karat, dengan stand holder kayu.', 15, 4.6),
(44, 'Novel Laskar Pelangi', 79000, 'Buku', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop', 'Novel Laskar Pelangi karya Andrea Hirata, kisah inspiratif tentang semangat anak-anak Belitung.', 30, 4.9),
(45, 'Buku Atomic Habits', 115000, 'Buku', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop', 'Buku Atomic Habits karya James Clear, panduan membangun kebiasaan baik dan menghilangkan kebiasaan buruk.', 25, 4.9),
(46, 'Buku Belajar Python untuk Pemula', 98000, 'Buku', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop', 'Panduan lengkap belajar Python dari nol, dilengkapi latihan soal dan studi kasus nyata.', 40, 4.7),
(47, 'Buku Desain UI/UX Modern', 125000, 'Buku', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop', 'Panduan desain UI/UX modern, membahas prinsip desain, prototyping, dan user research.', 20, 4.8),
(48, 'Komik One Piece Vol. 100', 35000, 'Buku', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop', 'Komik One Piece volume 100, edisi spesial dengan cover eksklusif dan bonus poster.', 50, 4.8),
(49, 'Tas Ransel Laptop Anti Air 30L', 325000, 'Tas & Koper', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop', 'Tas ransel laptop 30L bahan anti air, kompartemen laptop 15.6 inch, port USB charging eksternal.', 20, 4.7),
(50, 'Koper Hardcase 20 Inch', 485000, 'Tas & Koper', 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&auto=format&fit=crop', 'Koper hardcase 20 inch kabin, bahan ABS ringan, kunci TSA, roda 360 derajat silent.', 12, 4.6),
(51, 'Dompet Pria Kulit Slim', 125000, 'Tas & Koper', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop', 'Dompet pria slim bahan kulit asli, muat 8 kartu, uang, dan RFID blocking untuk keamanan.', 35, 4.5),
(52, 'Tas Tote Bag Canvas Aesthetic', 75000, 'Tas & Koper', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop', 'Tote bag canvas aesthetic, bahan tebal tidak mudah robek, ukuran besar muat laptop 13 inch.', 60, 4.4),
(53, 'Action Figure Anime Koleksi', 145000, 'Hobi & Koleksi', 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&auto=format&fit=crop', 'Action figure anime koleksi skala 1/10, detail tinggi, dilengkapi base display dan aksesoris.', 15, 4.8),
(54, 'Puzzle 1000 Pcs Pemandangan', 115000, 'Hobi & Koleksi', 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&auto=format&fit=crop', 'Puzzle 1000 pcs gambar pemandangan indah, potongan presisi, kertas tebal anti sobek.', 20, 4.6),
(55, 'Cat Akrilik Set 24 Warna', 95000, 'Hobi & Koleksi', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop', 'Set cat akrilik 24 warna, pigmen pekat, cepat kering, cocok untuk kanvas, kayu, dan kain.', 30, 4.5),
(56, 'Ukulele Soprano Kayu Mahoni', 285000, 'Hobi & Koleksi', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop', 'Ukulele soprano bahan kayu mahoni, suara jernih dan resonan, cocok untuk pemula, dilengkapi tas.', 10, 4.7),
(57, 'Kamera Instax Mini Polaroid', 895000, 'Hobi & Koleksi', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop', 'Kamera instax mini, cetak foto instan ukuran kartu kredit, desain pastel lucu, mudah digunakan.', 8, 4.9),
(58, 'Suplemen Vitamin C 1000mg', 65000, 'Kesehatan', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop', 'Suplemen vitamin C 1000mg effervescent, rasa jeruk segar, meningkatkan imunitas tubuh.', 80, 4.7),
(59, 'Masker KN95 Isi 20 Pcs', 45000, 'Kesehatan', 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&auto=format&fit=crop', 'Masker KN95 5 lapisan perlindungan, filter 95% partikel, nyaman dipakai seharian, isi 20 pcs.', 100, 4.5),
(60, 'Termometer Digital Infrared', 125000, 'Kesehatan', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&auto=format&fit=crop', 'Termometer digital infrared non-kontak, hasil akurat dalam 1 detik, cocok untuk seluruh keluarga.', 25, 4.6),
(61, 'Minyak Esensial Aromaterapi', 55000, 'Kesehatan', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop', 'Minyak esensial aromaterapi lavender, meredakan stres dan membantu tidur lebih nyenyak.', 120, 4.8),
(62, 'Makanan Kucing Premium 1.2kg', 75000, 'Hewan Peliharaan', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop', 'Makanan kucing premium 1.2kg rasa tuna, nutrisi lengkap untuk kucing dewasa, menjaga bulu berkilau.', 50, 4.7),
(63, 'Kandang Kucing Lipat Portable', 245000, 'Hewan Peliharaan', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop', 'Kandang kucing lipat portable, bahan besi anti karat, mudah dibersihkan, ukuran 60x45x45cm.', 12, 4.5),
(64, 'Mainan Kucing Bulu Interaktif', 35000, 'Hewan Peliharaan', 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&auto=format&fit=crop', 'Mainan kucing bulu interaktif dengan tongkat, merangsang insting berburu kucing, aman dan tidak beracun.', 70, 4.6),
(65, 'Snack Anjing Bone Treat 200g', 42000, 'Hewan Peliharaan', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&auto=format&fit=crop', 'Snack anjing bone treat 200g, membantu menjaga kesehatan gigi dan gusi, rasa ayam disukai anjing.', 45, 4.4),
(66, 'Stiker Laptop Aesthetic 50 Pcs', 25000, 'Aksesoris', 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&auto=format&fit=crop', 'Set 50 stiker laptop aesthetic tema alam dan vintage, waterproof, tidak meninggalkan bekas.', 200, 4.5),
(67, 'Stand HP Meja Adjustable', 55000, 'Aksesoris', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&auto=format&fit=crop', 'Stand HP meja adjustable aluminium, sudut bisa diatur, cocok untuk semua ukuran HP dan tablet.', 65, 4.4),
(68, 'Tempered Glass Anti Gores', 25000, 'Aksesoris', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&auto=format&fit=crop', 'Tempered glass 9H anti gores, oleophobic coating, pemasangan mudah dengan panduan, cocok berbagai tipe HP.', 150, 4.3),
(69, 'Kipas Angin Mini USB Portable', 45000, 'Aksesoris', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&auto=format&fit=crop', 'Kipas angin mini USB portable, 3 kecepatan, bisa diputar 360 derajat, cocok untuk meja kerja.', 80, 4.2),
(70, 'Payung Lipat Anti UV Otomatis', 85000, 'Aksesoris', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&auto=format&fit=crop', 'Payung lipat otomatis anti UV, buka tutup satu tombol, bahan pongee tebal, tahan angin kencang.', 40, 4.6);

-- --------------------------------------------------------
-- Struktur tabel untuk pesanan (orders)
-- --------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL UNIQUE,
  user_id VARCHAR(100) DEFAULT 'guest',
  user_name VARCHAR(150),
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  dest_city VARCHAR(100),
  items LONGTEXT NOT NULL,
  subtotal DOUBLE DEFAULT 0,
  shipping_cost DOUBLE DEFAULT 0,
  shipping_label VARCHAR(100),
  total DOUBLE DEFAULT 0,
  payment_method VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Menunggu Pembayaran',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../Bang_IB-shop/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let sql = `-- ==========================================================
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
-- Dumping data untuk tabel produk
-- --------------------------------------------------------
INSERT INTO products (id, name, price, category, image, description, stock, rating) VALUES
`;

const insertLines = products.map(p => {
  const name = p.name.replace(/'/g, "\\'");
  const category = p.category.replace(/'/g, "\\'");
  const image = (p.image || '').replace(/'/g, "\\'");
  const desc = (p.description || '').replace(/'/g, "\\'");
  return `(${p.id}, '${name}', ${p.price}, '${category}', '${image}', '${desc}', ${p.stock || 0}, ${p.rating || 5.0})`;
});

sql += insertLines.join(',\n') + ';\n\n';

sql += `-- --------------------------------------------------------
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
`;

const outPath = path.join(__dirname, 'tektok_shop_db.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('✅ Berhasil membuat file tektok_shop_db.sql');

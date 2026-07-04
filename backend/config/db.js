const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Mendukung environment variables standar maupun konfigurasi otomatis dari Railway MySQL
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'tektok_shop_db',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Otomatis buat tabel & sebaran produk jika belum ada di database (Sangat berguna untuk Railway!)
async function initDatabase() {
  try {
    // 1. Buat tabel products
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DOUBLE NOT NULL,
        category VARCHAR(100) NOT NULL,
        image TEXT,
        description TEXT,
        stock INT DEFAULT 0,
        rating FLOAT DEFAULT 5.0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Buat tabel orders
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
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
    `);

    // 3. Cek apakah tabel products kosong
    const [rows] = await pool.query('SELECT COUNT(*) as cnt FROM products');
    if (rows[0].cnt === 0) {
      const jsonPathLocal = path.join(__dirname, '../data/products.json');
      const jsonPathParent = path.join(__dirname, '../../Bang_IB-shop/data/products.json');
      const jsonPath = fs.existsSync(jsonPathLocal) ? jsonPathLocal : jsonPathParent;
      if (fs.existsSync(jsonPath)) {
        const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        for (const p of products) {
          await pool.query(
            'INSERT INTO products (id, name, price, category, image, description, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [p.id, p.name, p.price, p.category, p.image || '', p.description || '', p.stock || 50, p.rating || 5.0]
          );
        }
        console.log(`✅ Berhasil memasukkan ${products.length} produk ke database Railway!`);
      }
    }
  } catch (err) {
    console.error('⚠️ Gagal inisialisasi tabel otomatis:', err.message);
  }
}

// Test koneksi saat startup
pool.getConnection()
  .then(async connection => {
    console.log('✅ Berhasil terhubung ke database MySQL:', dbConfig.database);
    connection.release();
    await initDatabase();
  })
  .catch(err => {
    console.error('❌ Gagal terhubung ke database MySQL:', err.message);
  });

pool.initDatabase = initDatabase;
module.exports = pool;

const mysql = require('mysql2/promise');
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

// Test koneksi saat startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Berhasil terhubung ke database MySQL:', dbConfig.database);
    connection.release();
  })
  .catch(err => {
    console.error('❌ Gagal terhubung ke database MySQL:', err.message);
  });

module.exports = pool;

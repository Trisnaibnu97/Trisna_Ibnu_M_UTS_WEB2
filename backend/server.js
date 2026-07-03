require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Welcome Route / Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🚀 Backend API Online Store UTS (Tektok Shop) Berhasil Berjalan!',
    endpoints: {
      products: '/api/products',
      categories: '/api/products/categories',
      checkout: '/api/checkout',
      orders: '/api/orders'
    },
    author: 'Trisna Ibnu M'
  });
});

// Gunakan API Routes
app.use('/api', apiRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint API tidak ditemukan' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📡 Base URL untuk frontend: http://localhost:${PORT}/api`);
  console.log(`==================================================`);
});

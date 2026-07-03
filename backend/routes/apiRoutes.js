const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const checkoutController = require('../controllers/checkoutController');
const orderController = require('../controllers/orderController');

// ==========================================
// 📦 PRODUCTS & CATEGORIES ROUTES
// ==========================================
router.get('/products/categories', productController.getCategories);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// ==========================================
// 🛒 CHECKOUT ROUTE (Forward ke WA Owner)
// ==========================================
router.post('/checkout', checkoutController.processCheckout);

// ==========================================
// 📋 ORDERS ROUTES
// ==========================================
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;

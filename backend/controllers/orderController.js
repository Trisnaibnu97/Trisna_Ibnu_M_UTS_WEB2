const db = require('../config/db');

// Get semua pesanan (bisa filter by user_id)
exports.getAllOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = 'SELECT * FROM orders ORDER BY created_at DESC';
    const params = [];

    if (userId) {
      query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
      params.push(userId);
    }

    const [rows] = await db.query(query, params);

    // Parse kolom items (JSON string ke object)
    const formattedRows = rows.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    res.status(200).json({ success: true, count: formattedRows.length, data: formattedRows });
  } catch (error) {
    console.error('Error getAllOrders:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan', error: error.message });
  }
};

// Get detail pesanan by order_id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM orders WHERE order_id = ? OR id = ?', [id, id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    const order = rows[0];
    order.items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error getOrderById:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail pesanan', error: error.message });
  }
};

// Update status pesanan (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentMethod } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status baru wajib diisi' });
    }

    let query = 'UPDATE orders SET status = ?';
    const params = [status];

    if (paymentMethod) {
      query += ', payment_method = ?';
      params.push(paymentMethod);
    }

    query += ' WHERE order_id = ? OR id = ?';
    params.push(id, id);

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Status pesanan berhasil diperbarui' });
  } catch (error) {
    console.error('Error updateOrderStatus:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status pesanan', error: error.message });
  }
};

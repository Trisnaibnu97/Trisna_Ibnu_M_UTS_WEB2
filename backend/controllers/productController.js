const db = require('../config/db');

// Get semua produk (dengan filter kategori, pencarian, dan pengurutan)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'Semua Kategori' && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === 'price-asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price-desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else {
      query += ' ORDER BY id ASC';
    }

    const [rows] = await db.query(query, params);
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error getAllProducts:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data produk', error: error.message });
  }
};

// Get detail produk berdasarkan ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error getProductById:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail produk', error: error.message });
  }
};

// Tambah produk baru (Create)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, image, description, stock, rating } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Nama, harga, dan kategori wajib diisi' });
    }

    const query = `
      INSERT INTO products (name, price, category, image, description, stock, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      name,
      price,
      category,
      image || 'https://placehold.co/400x400?text=No+Image',
      description || '',
      stock || 0,
      rating || 5.0
    ];

    const [result] = await db.query(query, params);
    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: { id: result.insertId, name, price, category, image, description, stock, rating }
    });
  } catch (error) {
    console.error('Error createProduct:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan produk', error: error.message });
  }
};

// Update produk (Update)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, image, description, stock, rating } = req.body;

    // Cek apakah produk ada
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const current = existing[0];
    const query = `
      UPDATE products
      SET name = ?, price = ?, category = ?, image = ?, description = ?, stock = ?, rating = ?
      WHERE id = ?
    `;
    const params = [
      name ?? current.name,
      price ?? current.price,
      category ?? current.category,
      image ?? current.image,
      description ?? current.description,
      stock ?? current.stock,
      rating ?? current.rating,
      id
    ];

    await db.query(query, params);
    res.status(200).json({ success: true, message: 'Produk berhasil diperbarui' });
  } catch (error) {
    console.error('Error updateProduct:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui produk', error: error.message });
  }
};

// Hapus produk (Delete)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleteProduct:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus produk', error: error.message });
  }
};

// Get semua kategori unik
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT category FROM products ORDER BY category ASC');
    const categories = rows.map(r => r.category);
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Error getCategories:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil kategori', error: error.message });
  }
};

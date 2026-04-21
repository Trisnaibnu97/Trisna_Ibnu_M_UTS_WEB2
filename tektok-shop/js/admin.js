// Admin logic

const ADMIN_CREDENTIALS = { email: 'admin@bangibshop.com', password: 'admin123' };

const Admin = {
  isLoggedIn() {
    return localStorage.getItem('tektok_admin') === 'true';
  },
  login(email, password) {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('tektok_admin', 'true');
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem('tektok_admin');
    window.location.href = 'admin-login.html';
  },
  requireAuth() {
    if (!this.isLoggedIn()) { window.location.href = 'admin-login.html'; return false; }
    return true;
  },

  // Orders
  getAllOrders() {
    return JSON.parse(localStorage.getItem('tektok_orders') || '[]');
  },
  updateOrderStatus(orderId, status) {
    const orders = this.getAllOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx > -1) { orders[idx].status = status; localStorage.setItem('tektok_orders', JSON.stringify(orders)); }
  },
  deleteOrder(orderId) {
    const orders = this.getAllOrders().filter(o => o.id !== orderId);
    localStorage.setItem('tektok_orders', JSON.stringify(orders));
  },

  // Products
  getProducts() {
    const stored = localStorage.getItem('tektok_products_custom');
    return stored ? JSON.parse(stored) : null;
  },
  saveProducts(products) {
    localStorage.setItem('tektok_products_custom', JSON.stringify(products));
  },
  addProduct(product) {
    const products = window._adminProducts || [];
    const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
    product.id = maxId + 1;
    products.push(product);
    this.saveProducts(products);
    return product;
  },
  updateProduct(updated) {
    const products = (window._adminProducts || []).map(p => p.id === updated.id ? updated : p);
    this.saveProducts(products);
  },
  deleteProduct(id) {
    const products = (window._adminProducts || []).filter(p => p.id !== id);
    this.saveProducts(products);
  }
};

// Stats
function renderStats(orders, products) {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'Diproses').length;
  const done = orders.filter(o => o.status === 'Selesai').length;
  document.getElementById('stat-revenue').textContent = Utils.formatRupiah(totalRevenue);
  document.getElementById('stat-orders').textContent = orders.length;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-products').textContent = products.length;
  document.getElementById('stat-done').textContent = done;
}

// ── ORDERS TAB ──────────────────────────────────────────────
function renderOrders(filter = '') {
  let orders = Admin.getAllOrders();
  if (filter) orders = orders.filter(o => o.status === filter);

  const tbody = document.getElementById('orders-tbody');
  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-gray-400">Belum ada pesanan.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <td class="px-4 py-3 text-xs font-mono text-gray-500 dark:text-gray-400">${o.id}</td>
      <td class="px-4 py-3">
        <p class="font-medium text-gray-800 dark:text-white text-sm">${o.name}</p>
        <p class="text-xs text-gray-400">${o.userId}</p>
      </td>
      <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">${o.items.length} item</td>
      <td class="px-4 py-3 font-semibold text-green-600 text-sm">${Utils.formatRupiah(o.total)}</td>
      <td class="px-4 py-3 text-xs text-gray-400">${o.date}</td>
      <td class="px-4 py-3">
        <select onchange="changeOrderStatus('${o.id}', this.value)"
          class="text-xs px-2 py-1 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-400 ${statusClass(o.status)}">
          <option ${o.status==='Diproses'?'selected':''}>Diproses</option>
          <option ${o.status==='Dikirim'?'selected':''}>Dikirim</option>
          <option ${o.status==='Selesai'?'selected':''}>Selesai</option>
          <option ${o.status==='Dibatalkan'?'selected':''}>Dibatalkan</option>
        </select>
      </td>
      <td class="px-4 py-3">
        <button onclick="viewOrder('${o.id}')" class="text-blue-500 hover:text-blue-700 text-xs mr-2">Detail</button>
        <button onclick="deleteOrder('${o.id}')" class="text-red-400 hover:text-red-600 text-xs">Hapus</button>
      </td>
    </tr>`).join('');
}

function statusClass(s) {
  return { 'Diproses':'text-yellow-600','Dikirim':'text-blue-600','Selesai':'text-green-600','Dibatalkan':'text-red-500' }[s] || '';
}

function changeOrderStatus(id, status) {
  Admin.updateOrderStatus(id, status);
  Utils.showToast(`Status diperbarui: ${status}`, 'success');
  renderOrders(document.getElementById('order-filter').value);
  renderStats(Admin.getAllOrders(), window._adminProducts);
}

function deleteOrder(id) {
  if (!confirm('Hapus pesanan ini?')) return;
  Admin.deleteOrder(id);
  renderOrders(document.getElementById('order-filter').value);
  renderStats(Admin.getAllOrders(), window._adminProducts);
  Utils.showToast('Pesanan dihapus', 'info');
}

function viewOrder(id) {
  const order = Admin.getAllOrders().find(o => o.id === id);
  if (!order) return;
  const modal = document.getElementById('order-modal');
  document.getElementById('modal-content').innerHTML = `
    <div class="space-y-3">
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">ID Pesanan</span><span class="font-mono font-semibold dark:text-white">${order.id}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Pelanggan</span><span class="font-medium dark:text-white">${order.name}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Email</span><span class="dark:text-white">${order.userId}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">No. HP</span><span class="dark:text-white">${order.phone}</span>
      </div>
      <div class="text-sm"><span class="text-gray-500">Alamat: </span><span class="dark:text-white">${order.address}</span></div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Pembayaran</span><span class="dark:text-white">${order.payment}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Tanggal</span><span class="dark:text-white">${order.date}</span>
      </div>
      <hr class="dark:border-gray-600">
      <p class="font-semibold text-gray-700 dark:text-white">Item Pesanan:</p>
      ${order.items.map(i => `
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>${i.name} x${i.qty}</span><span>${Utils.formatRupiah(i.price * i.qty)}</span>
        </div>`).join('')}
      <hr class="dark:border-gray-600">
      <div class="flex justify-between font-bold text-green-600">
        <span>Total</span><span>${Utils.formatRupiah(order.total)}</span>
      </div>
    </div>`;
  modal.classList.remove('hidden');
}

// ── PRODUCTS TAB ─────────────────────────────────────────────
function renderProductsTable(search = '') {
  let products = window._adminProducts || [];
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const tbody = document.getElementById('products-tbody');
  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-gray-400">Belum ada produk.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <td class="px-4 py-3 text-xs text-gray-400">#${p.id}</td>
      <td class="px-4 py-3">
        <img src="${p.image}" alt="${p.name}" class="w-12 h-12 object-cover rounded-lg" onerror="this.src='https://placehold.co/48x48/e2e8f0/64748b?text=IMG'">
      </td>
      <td class="px-4 py-3">
        <p class="font-medium text-gray-800 dark:text-white text-sm">${p.name}</p>
        <p class="text-xs text-green-600">${p.category}</p>
      </td>
      <td class="px-4 py-3 font-semibold text-green-600 text-sm">${Utils.formatRupiah(p.price)}</td>
      <td class="px-4 py-3 text-sm text-center dark:text-white">${p.stock}</td>
      <td class="px-4 py-3 text-sm text-center text-yellow-500">${p.rating} ★</td>
      <td class="px-4 py-3">
        <button onclick="openEditProduct(${p.id})" class="text-blue-500 hover:text-blue-700 text-xs mr-2">Edit</button>
        <button onclick="deleteProduct(${p.id})" class="text-red-400 hover:text-red-600 text-xs">Hapus</button>
      </td>
    </tr>`).join('');
}

function openAddProduct() {
  document.getElementById('product-form-title').textContent = 'Tambah Produk';
  document.getElementById('product-form').reset();
  document.getElementById('product-edit-id').value = '';
  document.getElementById('product-modal').classList.remove('hidden');
}

function openEditProduct(id) {
  const p = (window._adminProducts || []).find(x => x.id === id);
  if (!p) return;
  document.getElementById('product-form-title').textContent = 'Edit Produk';
  document.getElementById('product-edit-id').value = p.id;
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-category').value = p.category;
  document.getElementById('p-stock').value = p.stock;
  document.getElementById('p-rating').value = p.rating;
  document.getElementById('p-image').value = p.image;
  document.getElementById('p-desc').value = p.description;
  document.getElementById('product-modal').classList.remove('hidden');
}

function saveProduct() {
  const id = document.getElementById('product-edit-id').value;
  const product = {
    id: id ? parseInt(id) : null,
    name: document.getElementById('p-name').value.trim(),
    price: parseInt(document.getElementById('p-price').value),
    category: document.getElementById('p-category').value.trim(),
    stock: parseInt(document.getElementById('p-stock').value) || 0,
    rating: parseFloat(document.getElementById('p-rating').value) || 4.0,
    image: document.getElementById('p-image').value.trim() || 'https://placehold.co/400x300/e2e8f0/64748b?text=Produk',
    description: document.getElementById('p-desc').value.trim()
  };

  if (!product.name || !product.price || !product.category) {
    Utils.showToast('Nama, harga, dan kategori wajib diisi.', 'error'); return;
  }

  if (id) {
    window._adminProducts = window._adminProducts.map(p => p.id === product.id ? product : p);
    Admin.saveProducts(window._adminProducts);
    Utils.showToast('Produk berhasil diperbarui!', 'success');
  } else {
    const maxId = window._adminProducts.reduce((m, p) => Math.max(m, p.id), 0);
    product.id = maxId + 1;
    window._adminProducts.push(product);
    Admin.saveProducts(window._adminProducts);
    Utils.showToast('Produk berhasil ditambahkan!', 'success');
  }

  document.getElementById('product-modal').classList.add('hidden');
  renderProductsTable(document.getElementById('product-search').value);
  renderStats(Admin.getAllOrders(), window._adminProducts);
}

function deleteProduct(id) {
  if (!confirm('Hapus produk ini?')) return;
  window._adminProducts = window._adminProducts.filter(p => p.id !== id);
  Admin.saveProducts(window._adminProducts);
  renderProductsTable();
  renderStats(Admin.getAllOrders(), window._adminProducts);
  Utils.showToast('Produk dihapus', 'info');
}

// ── INIT ─────────────────────────────────────────────────────
async function initAdmin() {
  Utils.applyDark();
  if (!Admin.requireAuth()) return;

  // Load products: custom override or from JSON
  const custom = Admin.getProducts();
  if (custom) {
    window._adminProducts = custom;
  } else {
    const res = await fetch('data/products.json');
    window._adminProducts = await res.json();
  }

  const orders = Admin.getAllOrders();
  renderStats(orders, window._adminProducts);
  renderOrders();
  renderProductsTable();

  document.getElementById('order-filter').addEventListener('change', e => renderOrders(e.target.value));
  document.getElementById('product-search').addEventListener('input', e => renderProductsTable(e.target.value));
  document.getElementById('dark-toggle').textContent = Utils.isDark() ? '☀️' : '🌙';
}

function toggleDark() {
  const isDark = !Utils.isDark();
  localStorage.setItem('tektok_dark', isDark);
  Utils.applyDark();
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

function switchTab(tab) {
  ['tab-orders','tab-products'].forEach(t => {
    document.getElementById(t).classList.toggle('hidden', t !== `tab-${tab}`);
  });
  ['btn-orders','btn-products'].forEach(b => {
    const active = b === `btn-${tab}`;
    document.getElementById(b).className = `px-5 py-2 rounded-xl font-semibold text-sm transition ${active ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50'}`;
  });
}

// ── CETAK LAPORAN ─────────────────────────────────────────────

function printReport(type) {
  const orders  = Admin.getAllOrders();
  const products = window._adminProducts || [];
  const now = new Date().toLocaleString('id-ID');
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  let bodyContent = '';

  if (type === 'orders') {
    const filterVal = document.getElementById('order-filter').value;
    const filtered  = filterVal ? orders.filter(o => o.status === filterVal) : orders;
    const filterLabel = filterVal ? ` — Status: ${filterVal}` : ' — Semua Status';

    const rows = filtered.map((o, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="mono">${o.id}</td>
        <td>${o.name}<br><small>${o.userId}</small></td>
        <td>${o.address}<br><small>📞 ${o.phone}</small></td>
        <td>${o.items.map(it => `${it.name} x${it.qty}`).join('<br>')}</td>
        <td>${o.payment}</td>
        <td class="right bold">${Utils.formatRupiah(o.total)}</td>
        <td><span class="badge badge-${o.status.toLowerCase().replace(' ','-')}">${o.status}</span></td>
        <td><small>${o.date}</small></td>
      </tr>`).join('');

    const totalFiltered = filtered.reduce((s, o) => s + o.total, 0);

    bodyContent = `
      <h2>Laporan Pesanan${filterLabel}</h2>
      <div class="summary-grid">
        <div class="summary-box"><div class="val">${filtered.length}</div><div class="lbl">Total Pesanan</div></div>
        <div class="summary-box green"><div class="val">${Utils.formatRupiah(totalFiltered)}</div><div class="lbl">Total Pendapatan</div></div>
        <div class="summary-box yellow"><div class="val">${filtered.filter(o=>o.status==='Diproses').length}</div><div class="lbl">Diproses</div></div>
        <div class="summary-box blue"><div class="val">${filtered.filter(o=>o.status==='Dikirim').length}</div><div class="lbl">Dikirim</div></div>
        <div class="summary-box emerald"><div class="val">${filtered.filter(o=>o.status==='Selesai').length}</div><div class="lbl">Selesai</div></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th><th>ID Pesanan</th><th>Pelanggan</th><th>Alamat & HP</th>
            <th>Item</th><th>Pembayaran</th><th>Total</th><th>Status</th><th>Tanggal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="6" class="right bold">TOTAL KESELURUHAN</td>
            <td class="right bold green-text">${Utils.formatRupiah(totalFiltered)}</td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>`;

  } else if (type === 'products') {
    const rows = products.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>#${p.id}</td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td class="right">${Utils.formatRupiah(p.price)}</td>
        <td class="center">${p.stock}</td>
        <td class="center">${p.rating} ★</td>
      </tr>`).join('');

    const totalStok = products.reduce((s, p) => s + p.stock, 0);
    const totalNilai = products.reduce((s, p) => s + (p.price * p.stock), 0);

    bodyContent = `
      <h2>Laporan Data Produk</h2>
      <div class="summary-grid">
        <div class="summary-box"><div class="val">${products.length}</div><div class="lbl">Total Produk</div></div>
        <div class="summary-box blue"><div class="val">${totalStok}</div><div class="lbl">Total Stok</div></div>
        <div class="summary-box green"><div class="val">${Utils.formatRupiah(totalNilai)}</div><div class="lbl">Nilai Inventori</div></div>
        <div class="summary-box yellow"><div class="val">${[...new Set(products.map(p=>p.category))].length}</div><div class="lbl">Kategori</div></div>
      </div>
      <table>
        <thead>
          <tr><th>No</th><th>ID</th><th>Nama Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Rating</th></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="right bold">TOTAL</td>
            <td></td>
            <td class="center bold">${totalStok}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>`;

  } else if (type === 'summary') {
    const byStatus = ['Diproses','Dikirim','Selesai','Dibatalkan'].map(s => ({
      status: s,
      count: orders.filter(o => o.status === s).length,
      total: orders.filter(o => o.status === s).reduce((sum, o) => sum + o.total, 0)
    }));

    const topProducts = {};
    orders.forEach(o => o.items.forEach(i => {
      topProducts[i.name] = (topProducts[i.name] || 0) + i.qty;
    }));
    const topList = Object.entries(topProducts).sort((a,b) => b[1]-a[1]).slice(0, 10);

    bodyContent = `
      <h2>Laporan Ringkasan Bisnis</h2>
      <div class="summary-grid">
        <div class="summary-box green"><div class="val">${Utils.formatRupiah(totalRevenue)}</div><div class="lbl">Total Pendapatan</div></div>
        <div class="summary-box"><div class="val">${orders.length}</div><div class="lbl">Total Pesanan</div></div>
        <div class="summary-box blue"><div class="val">${products.length}</div><div class="lbl">Total Produk</div></div>
        <div class="summary-box yellow"><div class="val">${orders.length ? Utils.formatRupiah(Math.round(totalRevenue/orders.length)) : '-'}</div><div class="lbl">Rata-rata Pesanan</div></div>
      </div>

      <h3>Rekap Pesanan per Status</h3>
      <table>
        <thead><tr><th>Status</th><th>Jumlah Pesanan</th><th>Total Nilai</th><th>Persentase</th></tr></thead>
        <tbody>
          ${byStatus.map(s => `
            <tr>
              <td><span class="badge badge-${s.status.toLowerCase().replace(' ','-')}">${s.status}</span></td>
              <td class="center">${s.count}</td>
              <td class="right">${Utils.formatRupiah(s.total)}</td>
              <td class="center">${orders.length ? Math.round(s.count/orders.length*100) : 0}%</td>
            </tr>`).join('')}
        </tbody>
      </table>

      <h3>10 Produk Terlaris</h3>
      <table>
        <thead><tr><th>No</th><th>Nama Produk</th><th>Total Terjual (unit)</th></tr></thead>
        <tbody>
          ${topList.length ? topList.map(([name, qty], i) => `
            <tr><td>${i+1}</td><td>${name}</td><td class="center bold">${qty}</td></tr>`).join('')
          : '<tr><td colspan="3" class="center">Belum ada data penjualan</td></tr>'}
        </tbody>
      </table>`;
  }

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Bang IB Shop</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1a1a1a; padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #16a34a; padding-bottom: 14px; margin-bottom: 20px; }
    .header-left h1 { font-size: 22px; font-weight: 800; color: #16a34a; }
    .header-left p { color: #555; font-size: 11px; margin-top: 2px; }
    .header-right { text-align: right; font-size: 11px; color: #555; }
    .header-right strong { display: block; font-size: 13px; color: #111; }
    h2 { font-size: 16px; font-weight: 700; color: #111; margin-bottom: 14px; }
    h3 { font-size: 13px; font-weight: 700; color: #333; margin: 20px 0 10px; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px; }
    .summary-box { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; text-align: center; background: #f9fafb; }
    .summary-box.green { border-color: #bbf7d0; background: #f0fdf4; }
    .summary-box.blue  { border-color: #bfdbfe; background: #eff6ff; }
    .summary-box.yellow{ border-color: #fde68a; background: #fffbeb; }
    .summary-box.emerald{ border-color: #a7f3d0; background: #ecfdf5; }
    .summary-box .val  { font-size: 16px; font-weight: 800; color: #111; }
    .summary-box.green .val { color: #16a34a; }
    .summary-box.blue  .val { color: #2563eb; }
    .summary-box.yellow .val { color: #d97706; }
    .summary-box.emerald .val { color: #059669; }
    .summary-box .lbl  { font-size: 10px; color: #6b7280; margin-top: 3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
    thead tr { background: #16a34a; color: white; }
    thead th { padding: 8px 10px; text-align: left; font-weight: 600; }
    tbody tr:nth-child(even) { background: #f9fafb; }
    tbody tr:hover { background: #f0fdf4; }
    tbody td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    tfoot td { padding: 8px 10px; background: #f0fdf4; border-top: 2px solid #16a34a; }
    .right  { text-align: right; }
    .center { text-align: center; }
    .bold   { font-weight: 700; }
    .mono   { font-family: monospace; font-size: 10px; }
    .green-text { color: #16a34a; }
    small   { color: #6b7280; font-size: 10px; }
    .badge  { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
    .badge-diproses   { background: #fef9c3; color: #854d0e; }
    .badge-dikirim    { background: #dbeafe; color: #1e40af; }
    .badge-selesai    { background: #dcfce7; color: #166534; }
    .badge-dibatalkan { background: #fee2e2; color: #991b1b; }
    .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }
    @media print {
      body { padding: 10px; }
      @page { margin: 15mm; size: A4 landscape; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>🛍️ Bang IB Shop</h1>
      <p>Laporan Resmi — Dicetak oleh Admin</p>
    </div>
    <div class="header-right">
      <strong>Tanggal Cetak</strong>
      ${now}
    </div>
  </div>
  ${bodyContent}
  <div class="footer">
    <span>Bang IB Shop — Sistem Manajemen Toko</span>
    <span>Dicetak: ${now}</span>
  </div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=1100,height=750');
  win.document.write(html);
  win.document.close();
}

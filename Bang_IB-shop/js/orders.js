// Order history logic

function initOrders() {
  Utils.applyDark();
  if (!Utils.requireAuth()) return;
  renderNavUser();
  Utils.updateCartBadge();

  const user = Utils.getCurrentUser();
  const allOrders = JSON.parse(localStorage.getItem('tektok_orders') || '[]');
  const orders = allOrders.filter(o => o.userId === user.email);

  const params = new URLSearchParams(window.location.search);
  const newId = params.get('new');

  const container = document.getElementById('orders-list');

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-20">
        <div class="text-6xl mb-4">📦</div>
        <p class="text-gray-400 text-lg">Belum ada pesanan.</p>
        <a href="shop.html" class="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition">Mulai Belanja</a>
      </div>`;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 ${newId === order.id ? 'ring-2 ring-green-500' : ''}">
      <div class="flex flex-wrap justify-between items-start gap-2 mb-4">
        <div>
          <p class="text-xs text-gray-400 mb-1">${order.date}</p>
          <p class="font-bold text-gray-800 dark:text-white text-sm">${order.id}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}">${order.status}</span>
      </div>
      <div class="space-y-2 mb-4">
        ${order.items.map(i => `
          <div class="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>${i.name} x${i.qty}</span>
            <span>${Utils.formatRupiah(i.price * i.qty)}</span>
          </div>`).join('')}
      </div>
      <div class="border-t dark:border-gray-700 pt-3 space-y-1 text-sm">
        ${order.shippingCost ? `
        <div class="flex justify-between text-gray-500 dark:text-gray-400">
          <span>Subtotal</span><span>${Utils.formatRupiah(order.subtotal || order.total)}</span>
        </div>
        <div class="flex justify-between text-gray-500 dark:text-gray-400">
          <span>Ongkir · ${order.shippingLabel || ''}</span><span>${Utils.formatRupiah(order.shippingCost)}</span>
        </div>` : ''}
        <div class="flex flex-wrap justify-between items-center gap-2 ${order.shippingCost ? 'border-t dark:border-gray-700 pt-2' : ''}">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            📍 ${order.address}${order.destCity ? ', ' + order.destCity : ''} | 📞 ${order.phone}
            ${order.shippingDays ? `<br>🚚 Estimasi: <span class="font-medium text-green-600">${order.shippingDays}</span>` : ''}
          </div>
          <div class="font-bold text-green-600 dark:text-green-400">${Utils.formatRupiah(order.total)}</div>
        </div>
      </div>
      <div class="mt-2 text-xs text-gray-400">Pembayaran: ${order.payment}</div>
    </div>`).join('');

  if (newId) {
    setTimeout(() => {
      const el = document.querySelector(`[data-id="${newId}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }
}

function statusColor(status) {
  const map = {
    'Diproses': 'bg-yellow-100 text-yellow-700',
    'Dikirim': 'bg-blue-100 text-blue-700',
    'Selesai': 'bg-green-100 text-green-700',
    'Dibatalkan': 'bg-red-100 text-red-700'
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

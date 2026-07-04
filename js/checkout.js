// Checkout logic

function initCheckout() {
  Utils.applyDark();
  if (!Utils.requireAuth()) return;
  renderNavUser();
  Utils.updateCartBadge();

  const cart = Utils.getCart();
  if (cart.length === 0) { window.location.href = 'cart.html'; return; }

  // Reset shipping state
  window._shippingCost  = 0;
  window._shippingLabel = '';
  window._shippingDays  = '';

  // Render item summary
  const summaryEl = document.getElementById('order-summary');
  summaryEl.innerHTML = cart.map(i => `
    <div class="flex justify-between">
      <span class="truncate max-w-[160px]">${i.name} <span class="text-gray-400">x${i.qty}</span></span>
      <span class="font-medium">${Utils.formatRupiah(i.price * i.qty)}</span>
    </div>`).join('');

  // Init shipping widget & total
  initShippingWidget();
  updateOrderTotal();
}

function submitCheckout() {
  const name    = document.getElementById('c-name').value.trim();
  const address = document.getElementById('c-address').value.trim();
  const phone   = document.getElementById('c-phone').value.trim();
  const dest    = document.getElementById('ship-dest').value;

  if (!name || !address || !phone) {
    Utils.showToast('Lengkapi semua data pengiriman.', 'error'); return;
  }
  if (!dest) {
    Utils.showToast('Pilih kota tujuan pengiriman.', 'error'); return;
  }
  if (!window._shippingCost) {
    document.getElementById('ship-warning').classList.remove('hidden');
    Utils.showToast('Pilih kurir pengiriman terlebih dahulu.', 'error'); return;
  }

  const cart     = Utils.getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = subtotal + window._shippingCost;
  const user     = Utils.getCurrentUser();

  const order = {
    id:           Utils.generateId(),
    userId:       user.email,
    userName:     user.name,
    items:        cart,
    subtotal,
    shippingCost: window._shippingCost,
    shippingLabel: window._shippingLabel,
    shippingDays:  window._shippingDays,
    total,
    name,
    address,
    destCity:     dest,
    phone,
    payment:      'Menunggu dipilih',
    status:       'Menunggu Pembayaran',
    date:         new Date().toLocaleString('id-ID')
  };

  localStorage.setItem('tektok_pending_order', JSON.stringify(order));
  Utils.showToast('Mengarahkan ke halaman pembayaran...', 'info');
  setTimeout(() => window.location.href = 'payment.html', 800);
}

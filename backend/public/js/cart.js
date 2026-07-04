// Cart logic

function renderCart() {
  Utils.applyDark();
  if (!Utils.requireAuth()) return;
  renderNavUser();
  Utils.updateCartBadge();

  const cart = Utils.getCart();
  const container = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-20">
        <div class="text-6xl mb-4">🛒</div>
        <p class="text-gray-400 text-lg">Keranjang kamu kosong.</p>
        <a href="shop.html" class="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition">Belanja Sekarang</a>
      </div>`;
    summaryEl.innerHTML = '';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  container.innerHTML = cart.map(item => `
    <div class="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-800 dark:text-white">${item.name}</h3>
        <p class="text-green-600 dark:text-green-400 font-bold">${Utils.formatRupiah(item.price)}</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="changeQty(${item.id}, -1)" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-green-100 font-bold text-lg transition">−</button>
        <span class="w-8 text-center font-semibold dark:text-white">${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-green-100 font-bold text-lg transition">+</button>
      </div>
      <div class="text-right min-w-[100px]">
        <p class="font-bold text-gray-800 dark:text-white">${Utils.formatRupiah(item.price * item.qty)}</p>
        <button onclick="removeItem(${item.id})" class="text-red-400 hover:text-red-600 text-sm mt-1 transition">Hapus</button>
      </div>
    </div>`).join('');

  summaryEl.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 sticky top-24">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Ringkasan Belanja</h2>
      <div class="flex justify-between text-gray-600 dark:text-gray-300 mb-2">
        <span>Total Item</span><span>${cart.reduce((s, i) => s + i.qty, 0)} item</span>
      </div>
      <div class="flex justify-between font-bold text-lg text-gray-800 dark:text-white border-t pt-3 mt-3">
        <span>Total</span><span class="text-green-600">${Utils.formatRupiah(total)}</span>
      </div>
      <a href="checkout.html" class="mt-5 block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-semibold transition">
        Checkout Sekarang
      </a>
      <a href="shop.html" class="mt-2 block w-full text-center text-green-600 hover:underline text-sm">Lanjut Belanja</a>
    </div>`;
}

function changeQty(id, delta) {
  let cart = Utils.getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  Utils.saveCart(cart);
  renderCart();
}

function removeItem(id) {
  let cart = Utils.getCart().filter(i => i.id !== id);
  Utils.saveCart(cart);
  Utils.showToast('Item dihapus dari keranjang', 'info');
  renderCart();
}

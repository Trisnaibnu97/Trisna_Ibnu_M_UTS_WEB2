// Product listing & detail logic

let allProducts = [];
let currentPage = 1;
const PER_PAGE = 8;

async function loadProducts() {
  // Pakai produk custom dari admin kalau ada, fallback ke JSON
  const custom = localStorage.getItem('tektok_products_custom');
  if (custom) {
    allProducts = JSON.parse(custom);
  } else {
    const res = await fetch('data/products.json');
    allProducts = await res.json();
  }
}

function getFiltered(search = '', category = '', sort = '') {
  let list = [...allProducts];
  if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (category) list = list.filter(p => p.category === category);
  if (sort === 'low') list.sort((a, b) => a.price - b.price);
  else if (sort === 'high') list.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  return list;
}

function renderProductCard(p) {
  const wishlist = Utils.getWishlist();
  const inWish = wishlist.includes(p.id);
  return `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <div class="relative">
        <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-cover cursor-pointer" onclick="window.location.href='product.html?id=${p.id}'" onerror="this.src='https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(p.name.substring(0,20))}'">
        <button onclick="toggleWishlist(${p.id}, this)" class="absolute top-2 right-2 text-2xl transition" title="Wishlist">
          ${inWish ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="p-4 flex flex-col flex-1">
        <span class="text-xs text-green-600 font-semibold uppercase mb-1">${p.category}</span>
        <h3 class="font-semibold text-gray-800 dark:text-white text-sm mb-1 cursor-pointer hover:text-green-600" onclick="window.location.href='product.html?id=${p.id}'">${p.name}</h3>
        <div class="text-xs mb-2">${Utils.renderStars(p.rating)} <span class="text-gray-400">(${p.rating})</span></div>
        <p class="text-green-600 dark:text-green-400 font-bold text-base mt-auto">${Utils.formatRupiah(p.price)}</p>
        <button onclick="addToCart(${p.id})" class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-xl transition font-medium">
          + Keranjang
        </button>
      </div>
    </div>`;
}

function renderPagination(total) {
  const pages = Math.ceil(total / PER_PAGE);
  const el = document.getElementById('pagination');
  if (!el) return;
  if (pages <= 1) { el.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<button onclick="goPage(${i})" class="px-3 py-1 rounded-lg text-sm font-medium transition ${i === currentPage ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-green-100'}">${i}</button>`;
  }
  el.innerHTML = html;
}

function renderProducts() {
  const search = document.getElementById('search')?.value || '';
  const category = document.getElementById('filter-cat')?.value || '';
  const sort = document.getElementById('filter-sort')?.value || '';
  const filtered = getFiltered(search, category, sort);
  const start = (currentPage - 1) * PER_PAGE;
  const paged = filtered.slice(start, start + PER_PAGE);

  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (paged.length === 0) {
    grid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-16">Produk tidak ditemukan.</p>';
  } else {
    grid.innerHTML = paged.map(renderProductCard).join('');
  }
  renderPagination(filtered.length);
  document.getElementById('result-count').textContent = `${filtered.length} produk ditemukan`;
}

function goPage(n) {
  currentPage = n;
  renderProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleWishlist(id, btn) {
  if (!Utils.requireAuth()) return;
  let list = Utils.getWishlist();
  if (list.includes(id)) {
    list = list.filter(x => x !== id);
    btn.textContent = '🤍';
    Utils.showToast('Dihapus dari wishlist', 'info');
  } else {
    list.push(id);
    btn.textContent = '❤️';
    Utils.showToast('Ditambahkan ke wishlist ❤️', 'success');
  }
  Utils.saveWishlist(list);
}

function addToCart(id) {
  if (!Utils.requireAuth()) return;
  const product = allProducts.find(p => p.id === id);
  if (!product) return;
  let cart = Utils.getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
  }
  Utils.saveCart(cart);
  Utils.showToast(`${product.name} ditambahkan ke keranjang 🛒`, 'success');
}

async function initShop() {
  Utils.applyDark();
  if (!Utils.requireAuth()) return;
  await loadProducts();
  renderNavUser();
  renderProducts();
  Utils.updateCartBadge();

  document.getElementById('search')?.addEventListener('input', () => { currentPage = 1; renderProducts(); });
  document.getElementById('filter-cat')?.addEventListener('change', () => { currentPage = 1; renderProducts(); });
  document.getElementById('filter-sort')?.addEventListener('change', () => { currentPage = 1; renderProducts(); });
}

// Product detail page
async function initProductDetail() {
  Utils.applyDark();
  if (!Utils.requireAuth()) return;
  await loadProducts();
  renderNavUser();
  Utils.updateCartBadge();

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const p = allProducts.find(x => x.id === id);
  if (!p) { document.getElementById('product-detail').innerHTML = '<p class="text-center text-gray-400 py-20">Produk tidak ditemukan.</p>'; return; }

  const wishlist = Utils.getWishlist();
  const inWish = wishlist.includes(p.id);

  document.getElementById('product-detail').innerHTML = `
    <div class="grid md:grid-cols-2 gap-10">
      <img src="${p.image}" alt="${p.name}" class="w-full rounded-2xl shadow-lg object-cover max-h-96" onerror="this.src='https://placehold.co/800x400/e2e8f0/64748b?text=${encodeURIComponent(p.name.substring(0,20))}'">
      <div class="flex flex-col justify-center">
        <span class="text-sm text-green-600 font-semibold uppercase mb-2">${p.category}</span>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">${p.name}</h1>
        <div class="flex items-center gap-2 mb-3">${Utils.renderStars(p.rating)} <span class="text-gray-400 text-sm">${p.rating}/5</span></div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">${p.description}</p>
        <p class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">${Utils.formatRupiah(p.price)}</p>
        <p class="text-sm text-gray-400 mb-6">Stok: ${p.stock} unit</p>
        <div class="flex gap-3">
          <button onclick="addToCart(${p.id})" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
            🛒 Tambah ke Keranjang
          </button>
          <button id="wish-btn" onclick="toggleWishlistDetail(${p.id})" class="px-4 py-3 rounded-xl border-2 border-green-300 hover:border-green-600 transition text-xl">
            ${inWish ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>`;
}

function toggleWishlistDetail(id) {
  let list = Utils.getWishlist();
  const btn = document.getElementById('wish-btn');
  if (list.includes(id)) {
    list = list.filter(x => x !== id);
    btn.textContent = '🤍';
    Utils.showToast('Dihapus dari wishlist', 'info');
  } else {
    list.push(id);
    btn.textContent = '❤️';
    Utils.showToast('Ditambahkan ke wishlist ❤️', 'success');
  }
  Utils.saveWishlist(list);
}

function renderNavUser() {
  const user = Utils.getCurrentUser();
  const el = document.getElementById('nav-user');
  if (el && user) el.textContent = `👤 ${user.name}`;
}

function toggleDark() {
  const isDark = !Utils.isDark();
  localStorage.setItem('tektok_dark', isDark);
  Utils.applyDark();
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

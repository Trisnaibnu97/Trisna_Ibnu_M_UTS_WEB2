// Utility functions

const Utils = {
  // Base URL Backend Railway
  API_BASE_URL: 'https://trisnaibnumutsweb2-production.up.railway.app/api',

  formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  },

  generateId() {
    return 'TKT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  },

  showToast(message, type = 'success') {
    const existing = document.getElementById('toast');
    if (existing) existing.remove();

    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500'
    };

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `fixed top-5 right-5 z-50 px-5 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 ${colors[type] || colors.success}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('tektok_user') || 'null');
  },

  requireAuth() {
    if (!this.getCurrentUser()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  getCart() {
    const user = this.getCurrentUser();
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`tektok_cart_${user.email}`) || '[]');
  },

  saveCart(cart) {
    const user = this.getCurrentUser();
    if (!user) return;
    localStorage.setItem(`tektok_cart_${user.email}`, JSON.stringify(cart));
    this.updateCartBadge();
  },

  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cart = this.getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = total;
    badge.classList.toggle('hidden', total === 0);
  },

  getWishlist() {
    const user = this.getCurrentUser();
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`tektok_wishlist_${user.email}`) || '[]');
  },

  saveWishlist(list) {
    const user = this.getCurrentUser();
    if (!user) return;
    localStorage.setItem(`tektok_wishlist_${user.email}`, JSON.stringify(list));
  },

  renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) stars += '<span class="text-yellow-400">★</span>';
      else if (i === full && half) stars += '<span class="text-yellow-400">½</span>';
      else stars += '<span class="text-gray-300">★</span>';
    }
    return stars;
  },

  isDark() {
    return localStorage.getItem('tektok_dark') === 'true';
  },

  applyDark() {
    if (this.isDark()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  initMobileResponsive() {
    const nav = document.querySelector('nav');
    if (!nav || document.getElementById('mobile-bottom-nav')) return;

    document.body.classList.add('pb-20', 'sm:pb-0');

    const bottomNav = document.createElement('div');
    bottomNav.id = 'mobile-bottom-nav';
    bottomNav.className = 'sm:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 px-3 flex justify-around items-center z-50 shadow-2xl text-[11px] font-semibold text-gray-600 dark:text-gray-300';
    
    const curPath = window.location.pathname;
    const isPage = (name) => curPath.includes(name);

    bottomNav.innerHTML = `
      <a href="shop.html" class="flex flex-col items-center gap-0.5 transition ${isPage('shop.html') ? 'text-green-600 dark:text-green-400 font-bold' : 'hover:text-green-600'}">
        <span class="text-lg">🏪</span>
        <span>Toko</span>
      </a>
      <a href="wishlist.html" class="flex flex-col items-center gap-0.5 transition ${isPage('wishlist.html') ? 'text-green-600 dark:text-green-400 font-bold' : 'hover:text-green-600'}">
        <span class="text-lg">❤️</span>
        <span>Wishlist</span>
      </a>
      <a href="cart.html" class="flex flex-col items-center gap-0.5 transition relative ${isPage('cart.html') ? 'text-green-600 dark:text-green-400 font-bold' : 'hover:text-green-600'}">
        <span class="text-lg">🛒</span>
        <span>Keranjang</span>
      </a>
      <a href="orders.html" class="flex flex-col items-center gap-0.5 transition ${isPage('orders.html') ? 'text-green-600 dark:text-green-400 font-bold' : 'hover:text-green-600'}">
        <span class="text-lg">📦</span>
        <span>Pesanan</span>
      </a>
      <a href="admin-login.html" class="flex flex-col items-center gap-0.5 transition hover:text-green-600">
        <span class="text-lg">⚙️</span>
        <span>Admin</span>
      </a>
    `;

    document.body.appendChild(bottomNav);

    document.querySelectorAll('table').forEach(tbl => {
      const parent = tbl.parentElement;
      if (parent && !parent.classList.contains('overflow-x-auto')) {
        parent.style.overflowX = 'auto';
        parent.style.display = 'block';
        parent.style.maxWidth = '100%';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Utils.applyDark();
  Utils.initMobileResponsive();
});

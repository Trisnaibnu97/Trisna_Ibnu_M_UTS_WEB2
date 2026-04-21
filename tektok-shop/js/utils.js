// Utility functions

const Utils = {
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
  }
};

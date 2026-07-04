// Authentication logic

const Auth = {
  getUsers() {
    return JSON.parse(localStorage.getItem('tektok_users') || '[]');
  },

  saveUsers(users) {
    localStorage.setItem('tektok_users', JSON.stringify(users));
  },

  register(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { ok: false, msg: 'Email sudah terdaftar.' };
    }
    if (password.length < 6) {
      return { ok: false, msg: 'Password minimal 6 karakter.' };
    }
    users.push({ name, email, password });
    this.saveUsers(users);
    return { ok: true };
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Email atau password salah.' };
    localStorage.setItem('tektok_user', JSON.stringify({ name: user.name, email: user.email }));
    return { ok: true };
  },

  logout() {
    localStorage.removeItem('tektok_user');
    window.location.href = 'index.html';
  }
};

// Login page logic
function initLogin() {
  Utils.applyDark();
  const user = Utils.getCurrentUser();
  if (user) { window.location.href = 'shop.html'; return; }

  document.getElementById('login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const result = Auth.login(email, password);
    if (result.ok) {
      Utils.showToast('Login berhasil! Selamat datang 👋', 'success');
      setTimeout(() => window.location.href = 'shop.html', 800);
    } else {
      Utils.showToast(result.msg, 'error');
    }
  });
}

// Register page logic
function initRegister() {
  Utils.applyDark();
  document.getElementById('register-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    if (password !== confirm) {
      Utils.showToast('Password tidak cocok.', 'error');
      return;
    }
    const result = Auth.register(name, email, password);
    if (result.ok) {
      Utils.showToast('Registrasi berhasil! Silakan login.', 'success');
      setTimeout(() => window.location.href = 'index.html', 1000);
    } else {
      Utils.showToast(result.msg, 'error');
    }
  });
}

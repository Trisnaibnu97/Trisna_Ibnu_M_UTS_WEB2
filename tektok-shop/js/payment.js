// Payment Gateway Simulation

let selectedMethod = null;
let pendingOrder = null;

const METHOD_INFO = {
  bca:     { label: 'Transfer BCA',    icon: '🏦', type: 'bank',   vaPrefix: '8277' },
  mandiri: { label: 'Transfer Mandiri',icon: '🏦', type: 'bank',   vaPrefix: '8908' },
  bni:     { label: 'Transfer BNI',    icon: '🏦', type: 'bank',   vaPrefix: '9888' },
  gopay:   { label: 'GoPay',           icon: '💚', type: 'ewallet', color: '#00AED6' },
  ovo:     { label: 'OVO',             icon: '💜', type: 'ewallet', color: '#4C3494' },
  dana:    { label: 'DANA',            icon: '🔵', type: 'ewallet', color: '#118EEA' },
  qris:    { label: 'QRIS',            icon: '📱', type: 'qris' },
  cod:     { label: 'COD',             icon: '💵', type: 'cod' }
};

// ── INIT ─────────────────────────────────────────────────────
function initPayment() {
  if (!Utils.requireAuth()) return;

  // Ambil pending order dari localStorage (dikirim dari checkout)
  pendingOrder = JSON.parse(localStorage.getItem('tektok_pending_order') || 'null');

  if (!pendingOrder) {
    // Tidak ada order pending, redirect ke cart
    Utils.showToast('Tidak ada pesanan aktif.', 'error');
    setTimeout(() => window.location.href = 'cart.html', 1000);
    return;
  }

  // Render ringkasan
  const summaryEl = document.getElementById('pay-summary');
  summaryEl.innerHTML = pendingOrder.items.map(i =>
    `<div class="flex justify-between">
      <span class="truncate max-w-[140px]">${i.name} x${i.qty}</span>
      <span class="font-medium">${Utils.formatRupiah(i.price * i.qty)}</span>
    </div>`
  ).join('');

  const subtotalEl  = document.getElementById('pay-subtotal');
  const shipCostEl  = document.getElementById('pay-ship-cost');
  const shipLabelEl = document.getElementById('pay-ship-label');
  if (subtotalEl)  subtotalEl.textContent  = Utils.formatRupiah(pendingOrder.subtotal || pendingOrder.total);
  if (shipCostEl)  shipCostEl.textContent  = pendingOrder.shippingCost ? Utils.formatRupiah(pendingOrder.shippingCost) : '-';
  if (shipLabelEl) shipLabelEl.textContent = pendingOrder.shippingLabel || '';
  document.getElementById('pay-total').textContent = Utils.formatRupiah(pendingOrder.total);

  showScreen('method');
}

// ── SCREEN MANAGER ────────────────────────────────────────────
function showScreen(name) {
  ['method','detail','processing','success','failed'].forEach(s => {
    document.getElementById(`screen-${s}`).classList.add('hidden');
  });
  document.getElementById(`screen-${name}`).classList.remove('hidden');
}

// ── PILIH METODE ──────────────────────────────────────────────
function selectMethod(method) {
  selectedMethod = method;

  // Update UI tombol
  document.querySelectorAll('.method-btn').forEach(btn => {
    btn.classList.remove('border-green-500', 'bg-green-50', 'dark:bg-green-900/20');
    btn.classList.add('border-gray-200', 'dark:border-gray-600');
  });
  const active = document.querySelector(`[data-method="${method}"]`);
  if (active) {
    active.classList.remove('border-gray-200', 'dark:border-gray-600');
    active.classList.add('border-green-500', 'bg-green-50', 'dark:bg-green-900/20');
  }

  document.getElementById('btn-next-method').disabled = false;
}

// ── DETAIL PEMBAYARAN ─────────────────────────────────────────
function goToPayDetail() {
  if (!selectedMethod) return;
  const info = METHOD_INFO[selectedMethod];
  const total = pendingOrder.total;
  // Tambah kode unik 3 digit agar mudah verifikasi
  const uniqueCode = Math.floor(Math.random() * 900) + 100;
  const finalAmount = info.type === 'bank' ? total + uniqueCode : total;

  let html = '';

  if (info.type === 'bank') {
    const va = info.vaPrefix + Math.floor(Math.random() * 9000000000 + 1000000000);
    html = `
      <div class="text-center mb-5">
        <span class="text-4xl">${info.icon}</span>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mt-2">${info.label}</h2>
        <p class="text-xs text-gray-400">Virtual Account</p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 text-sm mb-4">
        <div>
          <p class="text-xs text-gray-400 mb-1">Nomor Virtual Account</p>
          <div class="flex items-center justify-between bg-white dark:bg-gray-600 rounded-lg px-3 py-2 border dark:border-gray-500">
            <span class="font-mono font-bold text-lg tracking-widest text-gray-800 dark:text-white" id="va-number">${va}</span>
            <button onclick="copyText('${va}')" class="text-green-600 hover:text-green-700 text-xs font-semibold ml-2">Salin</button>
          </div>
        </div>
        <div class="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Subtotal</span><span>${Utils.formatRupiah(total)}</span>
        </div>
        <div class="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Kode Unik</span><span class="text-green-600 font-semibold">+${Utils.formatRupiah(uniqueCode)}</span>
        </div>
        <div class="flex justify-between font-bold text-gray-800 dark:text-white border-t dark:border-gray-500 pt-2">
          <span>Total Transfer</span>
          <span class="text-green-600 text-base" id="final-amount">${Utils.formatRupiah(finalAmount)}</span>
        </div>
      </div>
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 text-xs text-yellow-700 dark:text-yellow-400 mb-2">
        ⏰ Batas waktu pembayaran: <strong id="countdown">15:00</strong> menit
      </div>
      <p class="text-xs text-gray-400 text-center">Transfer tepat sesuai nominal termasuk kode unik</p>`;
    startCountdown(15 * 60);

  } else if (info.type === 'ewallet') {
    const phone = pendingOrder.phone || '08xxxxxxxxxx';
    html = `
      <div class="text-center mb-5">
        <span class="text-4xl">${info.icon}</span>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mt-2">${info.label}</h2>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 text-sm mb-4">
        <div>
          <p class="text-xs text-gray-400 mb-1">Nomor ${info.label} Terdaftar</p>
          <div class="flex items-center justify-between bg-white dark:bg-gray-600 rounded-lg px-3 py-2 border dark:border-gray-500">
            <span class="font-mono font-bold text-gray-800 dark:text-white">${phone}</span>
          </div>
        </div>
        <div class="flex justify-between font-bold text-gray-800 dark:text-white border-t dark:border-gray-500 pt-2">
          <span>Total Pembayaran</span>
          <span class="text-green-600 text-base">${Utils.formatRupiah(total)}</span>
        </div>
      </div>
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-400 mb-2">
        📲 Notifikasi pembayaran akan dikirim ke aplikasi ${info.label} kamu
      </div>`;

  } else if (info.type === 'qris') {
    // Fake QRIS barcode pakai QR placeholder
    const qrData = encodeURIComponent(`BANGIBSHOP|${pendingOrder.id}|${total}`);
    html = `
      <div class="text-center mb-5">
        <span class="text-4xl">📱</span>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mt-2">QRIS</h2>
        <p class="text-xs text-gray-400">Scan dengan aplikasi apapun</p>
      </div>
      <div class="flex flex-col items-center mb-4">
        <div class="bg-white p-3 rounded-2xl shadow-md border-2 border-green-400 inline-block">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}&bgcolor=ffffff&color=000000&margin=10"
            alt="QRIS Code" class="w-44 h-44 rounded-lg"
            onerror="this.src='https://placehold.co/180x180/ffffff/000000?text=QRIS'">
        </div>
        <p class="text-xs text-gray-400 mt-2">Berlaku 10 menit — <span id="countdown">10:00</span></p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 flex justify-between text-sm font-bold text-gray-800 dark:text-white mb-2">
        <span>Total Bayar</span><span class="text-green-600">${Utils.formatRupiah(total)}</span>
      </div>
      <p class="text-xs text-gray-400 text-center">Buka GoPay / OVO / DANA / m-Banking → Scan QR</p>`;
    startCountdown(10 * 60);

  } else if (info.type === 'cod') {
    html = `
      <div class="text-center mb-5">
        <span class="text-4xl">💵</span>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mt-2">Bayar di Tempat (COD)</h2>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 text-sm mb-4">
        <div class="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Nama Penerima</span><span class="font-medium dark:text-white">${pendingOrder.name}</span>
        </div>
        <div class="text-gray-600 dark:text-gray-300">
          <span>Alamat: </span><span class="font-medium dark:text-white">${pendingOrder.address}</span>
        </div>
        <div class="flex justify-between font-bold text-gray-800 dark:text-white border-t dark:border-gray-500 pt-2">
          <span>Siapkan Uang</span>
          <span class="text-green-600 text-base">${Utils.formatRupiah(total)}</span>
        </div>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3 text-xs text-green-700 dark:text-green-400">
        🚚 Kurir akan menghubungi kamu sebelum pengiriman. Siapkan uang pas.
      </div>`;
  }

  document.getElementById('pay-detail-content').innerHTML = html;
  showScreen('detail');
}

// ── PROSES PEMBAYARAN ─────────────────────────────────────────
function processPayment() {
  showScreen('processing');
  stopCountdown();

  const steps = [
    { pct: 20, msg: 'Menghubungi server pembayaran...' },
    { pct: 45, msg: 'Memverifikasi data transaksi...' },
    { pct: 70, msg: 'Memproses pembayaran...' },
    { pct: 90, msg: 'Menunggu konfirmasi...' },
    { pct: 100, msg: 'Selesai!' }
  ];

  let i = 0;
  const bar = document.getElementById('progress-bar');
  const txt = document.getElementById('progress-text');

  const interval = setInterval(() => {
    if (i >= steps.length) {
      clearInterval(interval);
      // 85% sukses, 15% gagal (simulasi)
      const success = Math.random() > 0.15;
      setTimeout(() => success ? showSuccess() : showFailed(), 400);
      return;
    }
    bar.style.width = steps[i].pct + '%';
    txt.textContent = steps[i].msg;
    i++;
  }, 800);
}

function showSuccess() {
  const info = METHOD_INFO[selectedMethod];
  const txId = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2,5).toUpperCase();
  const now = new Date().toLocaleString('id-ID');

  // Simpan order ke history dengan status Diproses
  const orders = JSON.parse(localStorage.getItem('tektok_orders') || '[]');
  const order = {
    ...pendingOrder,
    payment: info.label,
    paymentMethod: selectedMethod,
    transactionId: txId,
    paidAt: now,
    status: 'Diproses'
  };
  orders.unshift(order);
  localStorage.setItem('tektok_orders', JSON.stringify(orders));

  // Bersihkan pending order & cart
  localStorage.removeItem('tektok_pending_order');
  Utils.saveCart([]);

  // Isi layar sukses
  document.getElementById('suc-txid').textContent = txId;
  document.getElementById('suc-method').textContent = info.label;
  document.getElementById('suc-total').textContent = Utils.formatRupiah(pendingOrder.total);
  document.getElementById('suc-time').textContent = now;

  showScreen('success');
}

function showFailed() {
  showScreen('failed');
}

// ── COUNTDOWN TIMER ───────────────────────────────────────────
let countdownTimer = null;

function startCountdown(seconds) {
  stopCountdown();
  let remaining = seconds;
  const el = document.getElementById('countdown');
  if (!el) return;

  countdownTimer = setInterval(() => {
    remaining--;
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    const cdEl = document.getElementById('countdown');
    if (cdEl) cdEl.textContent = `${m}:${s}`;
    if (remaining <= 0) {
      stopCountdown();
      Utils.showToast('Waktu pembayaran habis!', 'error');
      showScreen('failed');
    }
  }, 1000);
}

function stopCountdown() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
}

// ── UTILS ─────────────────────────────────────────────────────
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    Utils.showToast('Nomor VA disalin!', 'success');
  }).catch(() => {
    Utils.showToast('Gagal menyalin, salin manual ya.', 'warning');
  });
}

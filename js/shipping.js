// Shipping Cost Simulation
// Tarif berdasarkan zona (pulau/wilayah), bukan API real

const SHIPPING = {
  // Zona pengiriman berdasarkan pulau
  zones: {
    'jawa':       ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Cirebon', 'Serang', 'Tasikmalaya', 'Sukabumi', 'Kediri', 'Madiun', 'Jember', 'Banyuwangi', 'Blitar'],
    'sumatera':   ['Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Bandar Lampung', 'Jambi', 'Bengkulu', 'Banda Aceh', 'Tanjung Pinang', 'Pangkal Pinang', 'Lubuk Linggau'],
    'kalimantan': ['Balikpapan', 'Samarinda', 'Banjarmasin', 'Pontianak', 'Palangkaraya', 'Tarakan', 'Bontang', 'Singkawang'],
    'sulawesi':   ['Makassar', 'Manado', 'Palu', 'Kendari', 'Gorontalo', 'Mamuju', 'Pare-Pare', 'Bitung'],
    'bali_ntt':   ['Denpasar', 'Mataram', 'Kupang', 'Singaraja', 'Gianyar', 'Tabanan', 'Ende', 'Maumere'],
    'papua':      ['Jayapura', 'Sorong', 'Manokwari', 'Timika', 'Merauke', 'Nabire', 'Biak', 'Wamena'],
    'maluku':     ['Ambon', 'Ternate', 'Sofifi', 'Tual', 'Namlea']
  },

  // Tarif per kg antar zona (Rp)
  rates: {
    'jawa-jawa':             { base: 9000,  perKg: 7000  },
    'jawa-sumatera':         { base: 12000, perKg: 10000 },
    'jawa-kalimantan':       { base: 15000, perKg: 13000 },
    'jawa-sulawesi':         { base: 18000, perKg: 15000 },
    'jawa-bali_ntt':         { base: 13000, perKg: 11000 },
    'jawa-papua':            { base: 35000, perKg: 30000 },
    'jawa-maluku':           { base: 28000, perKg: 24000 },
    'sumatera-sumatera':     { base: 10000, perKg: 8000  },
    'sumatera-kalimantan':   { base: 18000, perKg: 15000 },
    'sumatera-sulawesi':     { base: 22000, perKg: 18000 },
    'sumatera-bali_ntt':     { base: 20000, perKg: 17000 },
    'sumatera-papua':        { base: 40000, perKg: 35000 },
    'sumatera-maluku':       { base: 32000, perKg: 28000 },
    'kalimantan-kalimantan': { base: 10000, perKg: 8000  },
    'kalimantan-sulawesi':   { base: 15000, perKg: 12000 },
    'kalimantan-bali_ntt':   { base: 18000, perKg: 15000 },
    'kalimantan-papua':      { base: 30000, perKg: 26000 },
    'kalimantan-maluku':     { base: 25000, perKg: 21000 },
    'sulawesi-sulawesi':     { base: 10000, perKg: 8000  },
    'sulawesi-bali_ntt':     { base: 16000, perKg: 13000 },
    'sulawesi-papua':        { base: 28000, perKg: 24000 },
    'sulawesi-maluku':       { base: 20000, perKg: 17000 },
    'bali_ntt-bali_ntt':     { base: 11000, perKg: 9000  },
    'bali_ntt-papua':        { base: 32000, perKg: 28000 },
    'bali_ntt-maluku':       { base: 22000, perKg: 19000 },
    'papua-papua':           { base: 15000, perKg: 12000 },
    'papua-maluku':          { base: 25000, perKg: 21000 },
    'maluku-maluku':         { base: 12000, perKg: 10000 }
  },

  // Kurir dengan multiplier harga dan estimasi hari
  couriers: {
    jne: {
      name: 'JNE', icon: '🟡',
      services: [
        { code: 'REG', label: 'Reguler',    multi: 1.0,  days: '2-3 hari' },
        { code: 'YES', label: 'YES (1 Hari)',multi: 2.2, days: '1 hari'   },
        { code: 'OKE', label: 'OKE (Hemat)', multi: 0.8, days: '4-6 hari' }
      ]
    },
    jnt: {
      name: 'J&T Express', icon: '🔴',
      services: [
        { code: 'EZ',  label: 'EZ (Reguler)', multi: 0.95, days: '2-4 hari' },
        { code: 'ECO', label: 'Economy',       multi: 0.75, days: '5-7 hari' }
      ]
    },
    sicepat: {
      name: 'SiCepat', icon: '🟠',
      services: [
        { code: 'BEST', label: 'BEST (Reguler)', multi: 0.9,  days: '2-3 hari' },
        { code: 'HALU', label: 'Halu (Hemat)',   multi: 0.7,  days: '4-5 hari' },
        { code: 'GOKIL',label: 'Gokil (Same Day)',multi: 3.0, days: 'Hari ini'  }
      ]
    },
    pos: {
      name: 'Pos Indonesia', icon: '🔵',
      services: [
        { code: 'BIASA', label: 'Pos Biasa',   multi: 0.65, days: '5-8 hari' },
        { code: 'KILAT', label: 'Pos Kilat',   multi: 0.85, days: '3-5 hari' },
        { code: 'EXPRES',label: 'Pos Express', multi: 1.5,  days: '1-2 hari' }
      ]
    }
  },

  getZone(city) {
    for (const [zone, cities] of Object.entries(this.zones)) {
      if (cities.some(c => c.toLowerCase() === city.toLowerCase())) return zone;
    }
    return 'jawa'; // default
  },

  getRate(originZone, destZone) {
    const key1 = `${originZone}-${destZone}`;
    const key2 = `${destZone}-${originZone}`;
    return this.rates[key1] || this.rates[key2] || { base: 15000, perKg: 12000 };
  },

  calculate(originCity, destCity, weightKg) {
    const oz = this.getZone(originCity);
    const dz = this.getZone(destCity);
    const rate = this.getRate(oz, dz);
    const basePrice = rate.base + (rate.perKg * Math.max(1, weightKg));

    const results = [];
    for (const [key, courier] of Object.entries(this.couriers)) {
      courier.services.forEach(svc => {
        const cost = Math.ceil(basePrice * svc.multi / 1000) * 1000; // bulatkan ke ribuan
        results.push({
          courier: key,
          courierName: courier.name,
          icon: courier.icon,
          code: svc.code,
          label: svc.label,
          cost,
          days: svc.days
        });
      });
    }
    return results;
  }
};

// Semua kota untuk dropdown
const ALL_CITIES = Object.values(SHIPPING.zones).flat().sort();

// ── UI Functions ──────────────────────────────────────────────

function initShippingWidget() {
  const originSel = document.getElementById('ship-origin');
  const destSel   = document.getElementById('ship-dest');
  if (!originSel || !destSel) return;

  ALL_CITIES.forEach(city => {
    originSel.add(new Option(city, city));
    destSel.add(new Option(city, city));
  });

  // Default origin Jakarta
  originSel.value = 'Jakarta';

  originSel.addEventListener('change', calcShipping);
  destSel.addEventListener('change', calcShipping);
  document.getElementById('ship-weight').addEventListener('input', calcShipping);
}

function calcShipping() {
  const origin = document.getElementById('ship-origin').value;
  const dest   = document.getElementById('ship-dest').value;
  const weight = parseFloat(document.getElementById('ship-weight').value) || 1;
  const resultEl = document.getElementById('ship-results');

  if (!origin || !dest) return;

  if (origin === dest) {
    resultEl.innerHTML = `<p class="text-xs text-yellow-600 dark:text-yellow-400 py-2">⚠️ Kota asal dan tujuan sama.</p>`;
    return;
  }

  const results = SHIPPING.calculate(origin, dest, weight);

  // Group by courier
  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.courier]) grouped[r.courier] = { name: r.courierName, icon: r.icon, services: [] };
    grouped[r.courier].services.push(r);
  });

  resultEl.innerHTML = Object.values(grouped).map(g => `
    <div class="mb-3">
      <p class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">${g.icon} ${g.name}</p>
      ${g.services.map(s => `
        <label class="flex items-center justify-between p-2.5 rounded-xl border dark:border-gray-600 mb-1 cursor-pointer hover:border-green-400 transition has-[:checked]:border-green-500 has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/20">
          <div class="flex items-center gap-2">
            <input type="radio" name="ship-service" value="${s.courier}-${s.code}" data-cost="${s.cost}"
              onchange="applyShipping(${s.cost}, '${s.courierName} ${s.label}', '${s.days}')" class="accent-green-600">
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-white">${s.label}</p>
              <p class="text-xs text-gray-400">Estimasi ${s.days}</p>
            </div>
          </div>
          <span class="font-bold text-green-600 text-sm">${Utils.formatRupiah(s.cost)}</span>
        </label>`).join('')}
    </div>`).join('');
}

function applyShipping(cost, label, days) {
  window._shippingCost    = cost;
  window._shippingLabel   = label;
  window._shippingDays    = days;
  updateOrderTotal();
}

function updateOrderTotal() {
  const cart = Utils.getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = window._shippingCost || 0;
  const total    = subtotal + shipping;

  const elSub  = document.getElementById('summary-subtotal');
  const elShip = document.getElementById('summary-shipping');
  const elTot  = document.getElementById('summary-total');
  const elBtn  = document.getElementById('btn-checkout-submit');

  if (elSub)  elSub.textContent  = Utils.formatRupiah(subtotal);
  if (elShip) elShip.textContent = shipping > 0 ? Utils.formatRupiah(shipping) : 'Pilih kurir';
  if (elTot)  elTot.textContent  = Utils.formatRupiah(total);

  // Aktifkan tombol checkout hanya kalau kurir sudah dipilih
  if (elBtn) elBtn.disabled = !window._shippingCost;
}

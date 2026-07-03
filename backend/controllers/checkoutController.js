const db = require('../config/db');

// API Checkout & Forward Notifikasi ke WhatsApp Owner via Fonnte
exports.processCheckout = async (req, res) => {
  try {
    const {
      orderId,
      userId,
      userName,
      name,
      phone,
      address,
      destCity,
      items,
      subtotal,
      shippingCost,
      shippingLabel,
      total,
      paymentMethod
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Keranjang belanja kosong' });
    }

    const id = orderId || 'ORD-' + Date.now();
    const itemsJson = JSON.stringify(items);
    const orderStatus = 'Menunggu Pembayaran';

    // 1. Simpan order ke database MySQL
    const insertQuery = `
      INSERT INTO orders (
        order_id, user_id, user_name, customer_name, customer_phone, 
        customer_address, dest_city, items, subtotal, shipping_cost, 
        shipping_label, total, payment_method, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await db.query(insertQuery, [
      id,
      userId || 'guest',
      userName || name,
      name,
      phone,
      address,
      destCity || '',
      itemsJson,
      subtotal || 0,
      shippingCost || 0,
      shippingLabel || '',
      total || 0,
      paymentMethod || 'Belum dipilih',
      orderStatus
    ]);

    // Kurangi stok produk (opsional)
    for (const item of items) {
      if (item.id && item.qty) {
        await db.query('UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?', [item.qty, item.id]);
      }
    }

    // 2. Format pesan WhatsApp untuk Owner
    const itemsListText = items.map((i, idx) => `${idx + 1}. ${i.name} (x${i.qty}) - Rp ${Number(i.price * i.qty).toLocaleString('id-ID')}`).join('\n');
    const waMessage = `*🚨 NOTIFIKASI ORDERAN MASUK - TEKTOK SHOP 🚨*\n\n` +
      `*ID Pesanan:* ${id}\n` +
      `*Nama Pemesan:* ${name}\n` +
      `*No. WhatsApp:* ${phone}\n` +
      `*Alamat:* ${address} (${destCity || ''})\n` +
      `*Metode Pengiriman:* ${shippingLabel || '-'}\n` +
      `*Metode Pembayaran:* ${paymentMethod || '-'}\n\n` +
      `*🛒 Rincian Pesanan:*\n${itemsListText}\n\n` +
      `*Subtotal:* Rp ${Number(subtotal || 0).toLocaleString('id-ID')}\n` +
      `*Ongkir:* Rp ${Number(shippingCost || 0).toLocaleString('id-ID')}\n` +
      `*TOTAL BAYAR:* *Rp ${Number(total || 0).toLocaleString('id-ID')}*\n\n` +
      `_Segera periksa dan proses pesanan ini di halaman Admin._`;

    // 3. Kirim ke WhatsApp Owner menggunakan Fonnte API
    const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
    const ADMIN_WA = process.env.ADMIN_WA;

    let waResult = { sent: false, message: 'Notifikasi WA dilewati (token tidak diatur)' };

    if (FONNTE_TOKEN && ADMIN_WA && FONNTE_TOKEN !== 'your_fonnte_token_here') {
      try {
        const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            'Authorization': FONNTE_TOKEN
          },
          body: new URLSearchParams({
            target: ADMIN_WA,
            message: waMessage
          })
        });
        const fontteRes = await response.json();
        console.log('✅ Status Pengiriman WA (Fonnte):', fontteRes);
        waResult = { sent: true, details: fontteRes };
      } catch (waErr) {
        console.error('❌ Gagal mengirim WA via Fonnte:', waErr.message);
        waResult = { sent: false, error: waErr.message };
      }
    } else {
      console.log('💡 Simulasi Pesan WA ke Owner:\n----------------------------------\n' + waMessage + '\n----------------------------------');
    }

    res.status(201).json({
      success: true,
      message: 'Checkout berhasil diproses',
      orderId: id,
      waNotification: waResult
    });

  } catch (error) {
    console.error('Error processCheckout:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses checkout', error: error.message });
  }
};

/**
 * Template Kode Google Apps Script (GAS) untuk Backend Database SewaBaju Pro
 * Skrip ini dipasang di Google Sheets > Ekstensi > Apps Script
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * BACKEND DATABASE SPREADSHEET - SEWABAJU PRO (LUXURY RENTAL MANAGEMENT)
 * =========================================================================
 * 
 * Skrip Google Apps Script (GAS) ini berfungsi sebagai API backend untuk
 * menghubungkan aplikasi web SewaBaju Pro dengan Google Spreadsheet sebagai
 * database penyimpanan awan (Cloud Database).
 * 
 * FITUR UTAMA:
 * 1. Penanganan HTTP GET (Membaca data seluruh sheet atau uji koneksi)
 * 2. Penanganan HTTP POST (Menyimpan/Sinkronisasi seluruh koleksi, pelanggan, transaksi)
 * 3. Inisialisasi otomatis tab sheet dengan format header dan warna tema butik (#320075)
 * 4. Menu kustom otomatis di Google Sheets ("👘 SewaBaju Pro")
 */

// Konfigurasi Nama Tab Sheet
var SHEETS = {
  GARMENTS: 'Garments',
  CUSTOMERS: 'Customers',
  TRANSACTIONS: 'Rentals',
  LAUNDRY: 'Laundry',
  USERS: 'Users',
  SETTINGS: 'Settings',
  LOGS: 'ActivityLogs'
};

/**
 * Trigger saat Spreadsheet dibuka: Menambahkan Menu Kustom
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('👘 SewaBaju Pro')
    .addItem('🛠️ Format & Inisialisasi Sheet', 'setupSheets')
    .addItem('📊 Cek Ringkasan Data', 'showDataSummary')
    .addSeparator()
    .addItem('ℹ️ Panduan Koneksi Web App', 'showHelpDialog')
    .addToUi();
}

/**
 * Helper: Mengembalikan response JSON dengan CORS header yang aman
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * -------------------------------------------------------------------------
 * HTTP GET HANDLER
 * -------------------------------------------------------------------------
 * Digunakan untuk Uji Koneksi (Ping) dan Mengambil Seluruh Data (Pull)
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';

    // 1. Uji Koneksi / Ping
    if (action === 'ping' || action === 'test') {
      var sheetNames = ss.getSheets().map(function(s) { return s.getName(); });
      return createJsonResponse({
        status: 'success',
        message: 'Koneksi Google Apps Script Berhasil Aktif!',
        timestamp: new Date().toISOString(),
        spreadsheetName: ss.getName(),
        spreadsheetUrl: ss.getUrl(),
        availableSheets: sheetNames,
        serverVersion: '2.4.0'
      });
    }

    // 2. Mengambil Seluruh Data Database (Pull to Web App)
    if (action === 'getAllData' || action === 'pull') {
      var allData = fetchAllDataFromSheets(ss);
      return createJsonResponse({
        status: 'success',
        message: 'Berhasil mengambil seluruh data dari Google Spreadsheet',
        timestamp: new Date().toISOString(),
        data: allData
      });
    }

    // 3. Mengambil Sheet Tertentu
    if (action === 'getSheet' && e.parameter.sheetName) {
      var sheetData = getSheetRowsAsObjects(ss, e.parameter.sheetName);
      return createJsonResponse({
        status: 'success',
        sheetName: e.parameter.sheetName,
        totalRows: sheetData.length,
        data: sheetData
      });
    }

    return createJsonResponse({
      status: 'success',
      message: 'SewaBaju Pro API siap melayani permintaan.',
      actionReceived: action
    });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: 'Gagal memproses permintaan GET: ' + error.toString()
    });
  }
}

/**
 * -------------------------------------------------------------------------
 * HTTP POST HANDLER
 * -------------------------------------------------------------------------
 * Digunakan untuk Menyimpan Data, Push Database, dan Inisialisasi Sheet
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var payload = {};

    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || 'syncAll';

    // Aksi 1: Inisialisasi dan Pembuatan Format Header Sheet
    if (action === 'setupSheets') {
      var result = setupSheets();
      return createJsonResponse({
        status: 'success',
        message: 'Struktur sheet dan header SewaBaju Pro berhasil dibuat.',
        details: result
      });
    }

    // Aksi 2: Sinkronisasi Penuh (Push Data dari Web App ke Spreadsheet)
    if (action === 'syncAll' || action === 'push') {
      var syncResult = saveFullDataToSheets(ss, payload);
      return createJsonResponse({
        status: 'success',
        message: 'Data SewaBaju Pro berhasil disinkronkan ke Google Spreadsheet.',
        timestamp: new Date().toISOString(),
        recordsUpdated: syncResult
      });
    }

    // Aksi 3: Append Transaksi Sewa Baru Saja
    if (action === 'appendRental' && payload.rental) {
      appendSingleRental(ss, payload.rental);
      return createJsonResponse({
        status: 'success',
        message: 'Transaksi sewa baru ' + payload.rental.invoiceNumber + ' berhasil dicatat.',
        timestamp: new Date().toISOString()
      });
    }

    return createJsonResponse({
      status: 'error',
      message: 'Aksi tidak dikenali: ' + action
    });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: 'Gagal memproses permintaan POST: ' + error.toString()
    });
  }
}

/**
 * -------------------------------------------------------------------------
 * FUNGSI SETUP & FORMAT HEADER SPREADSHEET
 * -------------------------------------------------------------------------
 */
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var primaryColor = '#320075'; // Warna Ungu Elegan Khas SewaBaju Pro
  var headerFontColor = '#ffffff';

  var schema = [
    {
      name: SHEETS.GARMENTS,
      headers: [
        'ID', 'Kode Busana', 'Nama Busana', 'Kategori', 'Sub Tipe', 'Ukuran', 
        'Warna', 'Merek', 'Harga Beli (Rp)', 'Harga Sewa/Hari (Rp)', 'Deposit (Rp)', 
        'Lokasi Simpan', 'Stok', 'Kondisi', 'Status', 'Total Kali Sewa', 
        'Total Pendapatan (Rp)', 'Biaya Perawatan (Rp)', 'Deskripsi', 'Foto URL', 'Tanggal Ditambahkan'
      ]
    },
    {
      name: SHEETS.CUSTOMERS,
      headers: [
        'ID', 'Kode Pelanggan', 'Nama Lengkap', 'Nomor WhatsApp', 'Nomor Telepon', 
        'Tipe ID', 'No. Identitas', 'Email', 'Instagram', 'Alamat Lengkap', 
        'Tier Member', 'Total Sewa', 'Total Belanja (Rp)', 'Piutang (Rp)', 'Catatan Khusus', 'Tanggal Terdaftar'
      ]
    },
    {
      name: SHEETS.TRANSACTIONS,
      headers: [
        'ID Transaksi', 'No. Invoice', 'ID Pelanggan', 'Nama Pelanggan', 'WhatsApp Pelanggan',
        'ID Busana', 'Kode Busana', 'Nama Busana', 'Tgl Mulai Sewa', 'Tgl Selesai Sewa',
        'Tgl Pengembalian Riil', 'Durasi (Hari)', 'Harga Sewa (Rp)', 'Diskon (Rp)', 'Biaya Antar (Rp)',
        'Total Biaya (Rp)', 'Deposit Diterima (Rp)', 'Denda (Rp)', 'Alasan Denda', 
        'Status Sewa', 'Status Bayar', 'Metode Bayar', 'Jumlah Terbayar (Rp)', 'Catatan Transaksi', 'Waktu Dibuat'
      ]
    },
    {
      name: SHEETS.LAUNDRY,
      headers: [
        'ID Laundry', 'ID Busana', 'Kode Busana', 'Nama Busana', 'ID Transaksi Terkait',
        'Vendor Laundry', 'Tgl Masuk Cuci', 'Estimasi Selesai', 'Tgl Selesai Riil',
        'Biaya Cuci (Rp)', 'Status Laundry', 'Catatan Khusus'
      ]
    },
    {
      name: SHEETS.USERS,
      headers: [
        'ID Pengguna', 'Nama Lengkap', 'Email Akun', 'Nomor WhatsApp', 
        'Peran / Hak Akses', 'Status Akun', 'Tanggal Dibuat', 'Avatar URL'
      ]
    },
    {
      name: SHEETS.SETTINGS,
      headers: ['Parameter Kunci', 'Nilai Pengaturan', 'Keterangan']
    },
    {
      name: SHEETS.LOGS,
      headers: ['Waktu Log', 'Tipe Aksi', 'Pengguna', 'Detail Aktivitas', 'Entitas Terkait']
    }
  ];

  schema.forEach(function(item) {
    var sheet = ss.getSheetByName(item.name);
    if (!sheet) {
      sheet = ss.insertSheet(item.name);
    }
    
    // Set Header
    sheet.getRange(1, 1, 1, item.headers.length).setValues([item.headers]);
    
    // Style Header: Background Ungu, Font Putih Bold
    var headerRange = sheet.getRange(1, 1, 1, item.headers.length);
    headerRange.setBackground(primaryColor)
      .setFontColor(headerFontColor)
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setFontFamily('Arial')
      .setFontSize(10);
    
    sheet.setFrozenRows(1);
    
    // Auto-fit kolom
    for (var col = 1; col <= item.headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  });

  return { message: 'Semua 7 sheet berhasil dibuat dan diformat dengan elegan.' };
}

/**
 * -------------------------------------------------------------------------
 * HELPER: MENYIMPAN SELURUH DATA KE DALAM SHEETS (PUSH)
 * -------------------------------------------------------------------------
 */
function saveFullDataToSheets(ss, payload) {
  var stats = { garments: 0, customers: 0, transactions: 0, laundry: 0, users: 0 };

  // 1. Simpan Data Busana (Garments)
  if (payload.garments && Array.isArray(payload.garments)) {
    var gSheet = ss.getSheetByName(SHEETS.GARMENTS);
    if (gSheet) {
      clearSheetDataKeepHeader(gSheet);
      if (payload.garments.length > 0) {
        var gRows = payload.garments.map(function(g) {
          return [
            g.id || '',
            g.code || '',
            g.name || '',
            g.category || '',
            g.subType || '',
            g.size || '',
            g.color || '',
            g.brand || '',
            Number(g.purchasePrice || 0),
            Number(g.rentalPricePerDay || 0),
            Number(g.depositAmount || 0),
            g.storageLocation || '',
            Number(g.stock || 1),
            g.condition || 'Baik',
            g.status || 'Tersedia',
            Number(g.totalRentCount || 0),
            Number(g.totalRevenueGenerated || 0),
            Number(g.maintenanceCost || 0),
            g.description || '',
            (g.photos && g.photos.length > 0) ? g.photos[0] : '',
            g.createdAt || new Date().toISOString().split('T')[0]
          ];
        });
        gSheet.getRange(2, 1, gRows.length, gRows[0].length).setValues(gRows);
        stats.garments = gRows.length;
      }
    }
  }

  // 2. Simpan Data Pelanggan (Customers)
  if (payload.customers && Array.isArray(payload.customers)) {
    var cSheet = ss.getSheetByName(SHEETS.CUSTOMERS);
    if (cSheet) {
      clearSheetDataKeepHeader(cSheet);
      if (payload.customers.length > 0) {
        var cRows = payload.customers.map(function(c) {
          return [
            c.id || '',
            c.code || '',
            c.name || '',
            c.whatsapp || '',
            c.phone || '',
            c.identityType || 'KTP',
            c.identityNumber || '',
            c.email || '',
            c.instagram || '',
            c.address || '',
            c.tier || 'Regular',
            Number(c.totalRentals || 0),
            Number(c.totalSpent || 0),
            Number(c.piutang || 0),
            c.notes || '',
            c.createdAt || new Date().toISOString().split('T')[0]
          ];
        });
        cSheet.getRange(2, 1, cRows.length, cRows[0].length).setValues(cRows);
        stats.customers = cRows.length;
      }
    }
  }

  // 3. Simpan Data Transaksi Sewa (Rentals)
  if (payload.transactions && Array.isArray(payload.transactions)) {
    var tSheet = ss.getSheetByName(SHEETS.TRANSACTIONS);
    if (tSheet) {
      clearSheetDataKeepHeader(tSheet);
      if (payload.transactions.length > 0) {
        var tRows = payload.transactions.map(function(t) {
          return [
            t.id || '',
            t.invoiceNumber || '',
            t.customerId || '',
            t.customerName || '',
            t.customerPhone || '',
            t.garmentId || '',
            t.garmentCode || '',
            t.garmentName || '',
            t.startDate || '',
            t.endDate || '',
            t.actualReturnDate || '',
            Number(t.durationDays || 1),
            Number(t.rentalPrice || 0),
            Number(t.discount || 0),
            Number(t.deliveryFee || 0),
            Number(t.totalAmount || 0),
            Number(t.depositAmount || 0),
            Number(t.penaltyAmount || 0),
            t.penaltyReason || '',
            t.status || 'Booking',
            t.paymentStatus || 'Pending',
            t.paymentMethod || 'Transfer',
            Number(t.paidAmount || 0),
            t.notes || '',
            t.createdAt || new Date().toISOString()
          ];
        });
        tSheet.getRange(2, 1, tRows.length, tRows[0].length).setValues(tRows);
        stats.transactions = tRows.length;
      }
    }
  }

  // 4. Simpan Data Laundry
  if (payload.laundryItems && Array.isArray(payload.laundryItems)) {
    var lSheet = ss.getSheetByName(SHEETS.LAUNDRY);
    if (lSheet) {
      clearSheetDataKeepHeader(lSheet);
      if (payload.laundryItems.length > 0) {
        var lRows = payload.laundryItems.map(function(l) {
          return [
            l.id || '',
            l.garmentId || '',
            l.garmentCode || '',
            l.garmentName || '',
            l.rentalId || '',
            l.vendorName || '',
            l.sentDate || '',
            l.estimatedReturnDate || '',
            l.actualReturnDate || '',
            Number(l.cost || 0),
            l.status || 'Sedang Dicuci',
            l.notes || ''
          ];
        });
        lSheet.getRange(2, 1, lRows.length, lRows[0].length).setValues(lRows);
        stats.laundry = lRows.length;
      }
    }
  }

  // 5. Simpan Data Pengguna (Users)
  if (payload.users && Array.isArray(payload.users)) {
    var uSheet = ss.getSheetByName(SHEETS.USERS);
    if (uSheet) {
      clearSheetDataKeepHeader(uSheet);
      if (payload.users.length > 0) {
        var uRows = payload.users.map(function(u) {
          return [
            u.id || '',
            u.name || '',
            u.email || '',
            u.phone || '',
            u.role || 'Staff',
            u.status || 'Aktif',
            u.createdAt || new Date().toISOString().split('T')[0],
            u.avatarUrl || ''
          ];
        });
        uSheet.getRange(2, 1, uRows.length, uRows[0].length).setValues(uRows);
        stats.users = uRows.length;
      }
    }
  }

  // Catat Log Sinkronisasi
  logSyncActivity(ss, 'PUSH', 'Sinkronisasi lengkap dari Web App. Total: ' + JSON.stringify(stats));

  return stats;
}

/**
 * -------------------------------------------------------------------------
 * HELPER: MENGAMBIL SELURUH DATA DARI SHEETS (PULL)
 * -------------------------------------------------------------------------
 */
function fetchAllDataFromSheets(ss) {
  var data = {
    garments: [],
    customers: [],
    transactions: [],
    laundryItems: [],
    users: []
  };

  // 1. Read Garments
  var gSheet = ss.getSheetByName(SHEETS.GARMENTS);
  if (gSheet && gSheet.getLastRow() > 1) {
    var gValues = gSheet.getRange(2, 1, gSheet.getLastRow() - 1, 21).getValues();
    data.garments = gValues.map(function(r) {
      return {
        id: String(r[0]),
        code: String(r[1]),
        name: String(r[2]),
        category: String(r[3]),
        subType: String(r[4] || ''),
        size: String(r[5]),
        color: String(r[6]),
        brand: String(r[7] || ''),
        purchasePrice: Number(r[8] || 0),
        rentalPricePerDay: Number(r[9] || 0),
        depositAmount: Number(r[10] || 0),
        storageLocation: String(r[11] || ''),
        stock: Number(r[12] || 1),
        condition: String(r[13] || 'Baik'),
        status: String(r[14] || 'Tersedia'),
        totalRentCount: Number(r[15] || 0),
        totalRevenueGenerated: Number(r[16] || 0),
        maintenanceCost: Number(r[17] || 0),
        description: String(r[18] || ''),
        photos: r[19] ? [String(r[19])] : [],
        createdAt: r[20] ? String(r[20]) : ''
      };
    });
  }

  // 2. Read Customers
  var cSheet = ss.getSheetByName(SHEETS.CUSTOMERS);
  if (cSheet && cSheet.getLastRow() > 1) {
    var cValues = cSheet.getRange(2, 1, cSheet.getLastRow() - 1, 16).getValues();
    data.customers = cValues.map(function(r) {
      return {
        id: String(r[0]),
        code: String(r[1]),
        name: String(r[2]),
        whatsapp: String(r[3]),
        phone: String(r[4] || ''),
        identityType: String(r[5] || 'KTP'),
        identityNumber: String(r[6] || ''),
        email: String(r[7] || ''),
        instagram: String(r[8] || ''),
        address: String(r[9] || ''),
        tier: String(r[10] || 'Regular'),
        totalRentals: Number(r[11] || 0),
        totalSpent: Number(r[12] || 0),
        piutang: Number(r[13] || 0),
        notes: String(r[14] || ''),
        createdAt: r[15] ? String(r[15]) : ''
      };
    });
  }

  // 3. Read Transactions
  var tSheet = ss.getSheetByName(SHEETS.TRANSACTIONS);
  if (tSheet && tSheet.getLastRow() > 1) {
    var tValues = tSheet.getRange(2, 1, tSheet.getLastRow() - 1, 25).getValues();
    data.transactions = tValues.map(function(r) {
      return {
        id: String(r[0]),
        invoiceNumber: String(r[1]),
        customerId: String(r[2]),
        customerName: String(r[3]),
        customerPhone: String(r[4]),
        garmentId: String(r[5]),
        garmentCode: String(r[6]),
        garmentName: String(r[7]),
        startDate: String(r[8]),
        endDate: String(r[9]),
        actualReturnDate: r[10] ? String(r[10]) : undefined,
        durationDays: Number(r[11] || 1),
        rentalPrice: Number(r[12] || 0),
        discount: Number(r[13] || 0),
        deliveryFee: Number(r[14] || 0),
        totalAmount: Number(r[15] || 0),
        depositAmount: Number(r[16] || 0),
        penaltyAmount: Number(r[17] || 0),
        penaltyReason: String(r[18] || ''),
        status: String(r[19] || 'Booking'),
        paymentStatus: String(r[20] || 'Pending'),
        paymentMethod: String(r[21] || 'Transfer'),
        paidAmount: Number(r[22] || 0),
        notes: String(r[23] || ''),
        createdAt: String(r[24] || '')
      };
    });
  }

  // 4. Read Laundry
  var lSheet = ss.getSheetByName(SHEETS.LAUNDRY);
  if (lSheet && lSheet.getLastRow() > 1) {
    var lValues = lSheet.getRange(2, 1, lSheet.getLastRow() - 1, 12).getValues();
    data.laundryItems = lValues.map(function(r) {
      return {
        id: String(r[0]),
        garmentId: String(r[1]),
        garmentCode: String(r[2]),
        garmentName: String(r[3]),
        rentalId: String(r[4] || ''),
        vendorName: String(r[5] || ''),
        sentDate: String(r[6]),
        estimatedReturnDate: String(r[7] || ''),
        actualReturnDate: r[8] ? String(r[8]) : undefined,
        cost: Number(r[9] || 0),
        status: String(r[10] || 'Sedang Dicuci'),
        notes: String(r[11] || '')
      };
    });
  }

  // 5. Read Users
  var uSheet = ss.getSheetByName(SHEETS.USERS);
  if (uSheet && uSheet.getLastRow() > 1) {
    var uValues = uSheet.getRange(2, 1, uSheet.getLastRow() - 1, 8).getValues();
    data.users = uValues.map(function(r) {
      return {
        id: String(r[0]),
        name: String(r[1]),
        email: String(r[2]),
        phone: String(r[3] || ''),
        role: String(r[4] || 'Staff'),
        status: String(r[5] || 'Aktif'),
        createdAt: String(r[6] || ''),
        avatarUrl: String(r[7] || '')
      };
    });
  }

  return data;
}

/**
 * -------------------------------------------------------------------------
 * HELPER UTILITIES
 * -------------------------------------------------------------------------
 */
function clearSheetDataKeepHeader(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow > 1 && lastCol > 0) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
  }
}

function logSyncActivity(ss, type, detail) {
  try {
    var logSheet = ss.getSheetByName(SHEETS.LOGS);
    if (!logSheet) return;
    logSheet.appendRow([
      new Date().toLocaleString('id-ID'),
      type,
      'SewaBaju Pro Web Client',
      detail,
      'Cloud Sync'
    ]);
  } catch (e) {
    // Ignore logging error
  }
}

function showDataSummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var msg = '📊 RINGKASAN DATA DATABASE SPREADSHEET:\\n\\n';
  
  var sheets = [SHEETS.GARMENTS, SHEETS.CUSTOMERS, SHEETS.TRANSACTIONS, SHEETS.LAUNDRY, SHEETS.USERS];
  sheets.forEach(function(name) {
    var s = ss.getSheetByName(name);
    var count = s ? Math.max(0, s.getLastRow() - 1) : 0;
    msg += '• ' + name + ': ' + count + ' baris data\\n';
  });

  SpreadsheetApp.getUi().alert('Ringkasan Data SewaBaju Pro', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}

function showHelpDialog() {
  var html = '<h3>Panduan Integrasi Google Apps Script</h3>' +
    '<p>1. Pastikan Anda telah melakukan <b>Deploy as Web App</b>.</p>' +
    '<p>2. Execute as: <b>Me</b>, Who has access: <b>Anyone</b>.</p>' +
    '<p>3. Salin URL Web App dan tempelkan di aplikasi SewaBaju Pro.</p>';
  var userInterface = HtmlService.createHtmlOutput(html).setWidth(400).setHeight(250);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Panduan Koneksi');
}
`;

export const INSTALLATION_STEPS = [
  {
    step: 1,
    title: 'Buat File Google Spreadsheet Baru',
    description: 'Buka Google Drive Anda, klik tombol "+ Baru" lalu pilih "Google Spreadsheet". Beri nama spreadsheet misalnya: "Database SewaBaju Pro".',
    tip: 'Pastikan Anda login dengan akun Google yang memiliki hak akses untuk membuat spreadsheet.'
  },
  {
    step: 2,
    title: 'Buka Editor Apps Script',
    description: 'Di menu atas Google Spreadsheet, klik menu "Ekstensi" (Extensions) > lalu pilih "Apps Script". Jendela editor kode baru akan terbuka.',
    tip: 'Beri nama proyek Apps Script Anda, misalnya: "SewaBaju Pro Backend API".'
  },
  {
    step: 3,
    title: 'Salin & Tempel Kode GAS',
    description: 'Hapus seluruh isi file default (Code.gs), lalu salin seluruh kode dari tab "Kode GAS (Code.gs)" di bawah dan tempelkan ke editor. Klik tombol "Simpan" (ikon disket / Ctrl+S).',
    tip: 'Anda juga bisa menekan tombol "Inisialisasi Sheet" langsung dari aplikasi atau melalui menu 👘 SewaBaju Pro di Google Sheets.'
  },
  {
    step: 4,
    title: 'Terapkan sebagai Web App (Deploy)',
    description: 'Klik tombol biru "Deploy" (Terapkan) di pojok kanan atas > pilih "New deployment" (Terapkan baru). Klik ikon gerigi dan pilih tipe "Web app".',
    tip: 'Konfigurasi WAJIB:\n• Description: SewaBaju Pro Production API\n• Execute as: Me (Email Google Anda)\n• Who has access: Anyone (Siapa saja)'
  },
  {
    step: 5,
    title: 'Beri Izin Akses Akun Google (Authorize)',
    description: 'Klik tombol "Deploy", lalu klik "Authorize Access" > Pilih akun Google Anda > Klik "Advanced" (Lanjutan) > Klik "Go to SewaBaju Pro Backend (unsafe)" > Klik "Allow" (Izinkan).',
    tip: 'Peringatan "unsafe" adalah standar Google untuk skrip buatan sendiri yang belum dipublikasikan di Google Workspace Marketplace.'
  },
  {
    step: 6,
    title: 'Salin Web App URL ke Dashboard Ini',
    description: 'Setelah deploy berhasil, salin URL yang berakhiran "/exec". Tempelkan URL tersebut ke kolom "Google Apps Script Web App URL" di tab Sinkronisasi Data di bawah, lalu klik "Uji Koneksi".',
    tip: 'Format URL yang benar: https://script.google.com/macros/s/AKfycb.../exec'
  }
];

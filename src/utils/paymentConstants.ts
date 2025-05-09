
// List of payment types with their Indonesian labels
export const PAYMENT_TYPES = {
  bank_transfer: "Transfer Bank",
  e_wallet: "E-Wallet",
  credit_card: "Kartu Kredit/Debit",
  retail: "Gerai Ritel"
};

// Payment status with their Indonesian labels
export const PAYMENT_STATUS = {
  pending: "Menunggu Pembayaran",
  completed: "Pembayaran Selesai",
  failed: "Pembayaran Gagal",
  expired: "Pembayaran Kadaluarsa",
};

// Invoice status with their Indonesian labels
export const INVOICE_STATUS = {
  draft: "Draft",
  issued: "Terbit",
  paid: "Lunas",
  cancelled: "Dibatalkan"
};

// Bank payment instructions for each bank code
export const BANK_INSTRUCTIONS = {
  BCA: [
    "1. Buka aplikasi BCA Mobile atau internet banking BCA",
    "2. Pilih menu Transfer > Virtual Account",
    "3. Masukkan nomor virtual account",
    "4. Periksa detail pembayaran dan konfirmasi",
    "5. Masukkan PIN atau password",
    "6. Pembayaran selesai"
  ],
  MANDIRI: [
    "1. Buka aplikasi Livin' by Mandiri atau internet banking Mandiri",
    "2. Pilih menu Pembayaran > Virtual Account",
    "3. Masukkan nomor virtual account",
    "4. Periksa detail pembayaran dan konfirmasi",
    "5. Masukkan PIN atau password",
    "6. Pembayaran selesai"
  ],
  BNI: [
    "1. Buka aplikasi BNI Mobile atau internet banking BNI",
    "2. Pilih menu Transfer > Virtual Account",
    "3. Masukkan nomor virtual account",
    "4. Periksa detail pembayaran dan konfirmasi",
    "5. Masukkan PIN atau password",
    "6. Pembayaran selesai"
  ],
  BRI: [
    "1. Buka aplikasi BRImo atau internet banking BRI",
    "2. Pilih menu Pembayaran > Virtual Account",
    "3. Masukkan nomor virtual account",
    "4. Periksa detail pembayaran dan konfirmasi",
    "5. Masukkan PIN atau password",
    "6. Pembayaran selesai"
  ]
};

// E-wallet payment instructions
export const EWALLET_INSTRUCTIONS = {
  GOPAY: [
    "1. Buka aplikasi Gojek",
    "2. Pilih menu GoPay",
    "3. Klik 'Bayar'",
    "4. Scan QR Code atau masukkan nomor telepon merchant",
    "5. Masukkan jumlah pembayaran",
    "6. Konfirmasi pembayaran"
  ],
  OVO: [
    "1. Buka aplikasi OVO",
    "2. Pilih menu 'Scan'",
    "3. Scan QR Code merchant",
    "4. Masukkan jumlah pembayaran",
    "5. Konfirmasi pembayaran"
  ],
  DANA: [
    "1. Buka aplikasi DANA",
    "2. Pilih menu 'Scan QR'",
    "3. Scan QR Code merchant",
    "4. Masukkan jumlah pembayaran",
    "5. Konfirmasi pembayaran"
  ]
};

// Retail payment instructions
export const RETAIL_INSTRUCTIONS = {
  ALFAMART: [
    "1. Kunjungi gerai Alfamart terdekat",
    "2. Beritahu kasir Anda ingin melakukan pembayaran untuk PT Aplikasi Indonesia",
    "3. Serahkan kode pembayaran kepada kasir",
    "4. Bayar jumlah sesuai tagihan",
    "5. Simpan bukti pembayaran"
  ],
  INDOMARET: [
    "1. Kunjungi gerai Indomaret terdekat",
    "2. Beritahu kasir Anda ingin melakukan pembayaran untuk PT Aplikasi Indonesia",
    "3. Serahkan kode pembayaran kepada kasir",
    "4. Bayar jumlah sesuai tagihan",
    "5. Simpan bukti pembayaran"
  ]
};

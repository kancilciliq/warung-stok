# Sistem Informasi Monitoring Stok Barang — Warung Madura

Stack: **Node.js (Express)** · **React (Vite)** · **MySQL**

```
docs/        Perencanaan ERD, aturan bisnis, rencana API
backend/     API Express (config, middlewares, models, services, controllers, routes)
frontend/    React + Vite (api, context, hooks, components, pages, routes)
```

## Menjalankan

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # isi DB_USER / DB_PASSWORD / JWT_SECRET
npm run migrate           # membuat database + tabel (database/schema.sql)
npm run seed              # akun & data contoh
npm run dev               # http://localhost:5000/api
```
Akun seed: `admin / admin123` dan `staff / staff123` (ganti setelah login pertama).

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

## Alur penggunaan
1. Login → Dashboard.
2. Isi **Kategori**, (opsional) **Supplier**, lalu **Barang** (stok awal 0).
3. Catat **Barang Masuk** untuk menambah stok, **Barang Keluar** untuk mengurangi.
4. Pantau **Dashboard** (peringatan stok minimum), **Riwayat Stok**, dan **Laporan Stok** (ekspor CSV / cetak).

## Catatan teknis
- Stok tidak bisa diedit langsung; hanya berubah lewat transaksi (`backend/src/services/stockService.js`).
- Simpan transaksi atomik (DB transaction + `SELECT ... FOR UPDATE`), barang keluar ditolak jika stok kurang.
- Setiap item menyimpan `stock_before` dan `stock_after` sebagai riwayat.
- Role: `admin` (termasuk kelola pengguna) dan `staff`.

# Lapar.in

Aplikasi web review warung kantin kampus. Mahasiswa bisa melihat daftar warung, menu, dan rating. Pemilik warung dan admin bisa mengelola data warung sesuai hak akses masing-masing.

Tugas 4 mata kuliah Rekayasa Sistem Informasi.

## Fitur

- Daftar warung dengan pencarian, filter kategori, dan pagination
- Detail warung berdasarkan ID, lengkap dengan menu dan rating
- Tambah, ubah, dan hapus data warung sesuai role pengguna
- Registrasi, login, dan informasi pengguna yang sedang login
- Pembatasan akses berdasarkan role: Admin, Owner, dan Customer
- Penanganan respons 401 Unauthorized dan 403 Forbidden
- Tampilan loading, empty, dan error state

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, Axios, Lucide React |
| Backend | Node.js, Express 5, TypeScript, Drizzle ORM, JWT (jsonwebtoken), bcryptjs, Zod |
| Database | Microsoft SQL Server |
| Dokumentasi API | Swagger (swagger-autogen dan swagger-ui-express) |

## Struktur folder

```
tugas4-rsi/
├── backend/        API (routes, controllers, services, repositories) dan skrip database (db/)
├── frontend/       Antarmuka pengguna (React)
├── .gitignore
└── README.md
```

## Prasyarat

- Node.js 22.18.0 atau lebih baru, dan npm
- Microsoft SQL Server yang sudah berjalan, dengan koneksi TCP/IP aktif di port 1433
- `sqlcmd` untuk menjalankan skrip database

## Cara menjalankan

### 1. Clone repositori

```bash
git clone https://github.com/[ISI: username GitHub]/tugas4-rsi.git
cd tugas4-rsi
```

### 2. Siapkan database

Sebelum menjalankan skrip, buka `backend/db/01-create-database-and-user.sql` dan ganti `GANTI_DENGAN_PASSWORD_SENDIRI` dengan password milikmu. Password yang sama nanti dipakai di `backend/.env`.

Lalu jalankan dari folder `backend`:

```powershell
cd backend
sqlcmd -S localhost -E -C -i db\00-setup-mixed-mode.sql
sqlcmd -S localhost -E -C -i db\01-create-database-and-user.sql
sqlcmd -S localhost -E -C -i db\02-schema.sql
sqlcmd -S localhost -E -C -i db\03-seed.sql
sqlcmd -S localhost -E -C -i db\04-seed-baru.sql
sqlcmd -S localhost -E -C -i db\05-seed-password-hashes.sql
```

Skrip `00` cukup dijalankan sekali. Skrip `01` membuat database `review_kantin` beserta akun SQL Server untuk aplikasi, `02` membuat tabel, `03` dan `04` mengisi data awal, dan `05` mengisi password akun uji coba.

### 3. Backend

```powershell
npm install
Copy-Item .env.example .env
```

(Di macOS atau Linux: `cp .env.example .env`)

Buka `backend/.env`, lalu isi variabel berikut. **File `.env` tidak diunggah ke GitHub.**

| Variabel | Keterangan |
|---|---|
| `CORS_ORIGIN` | Alamat frontend, default `http://localhost:5173` |
| `DB_SERVER`, `DB_PORT` | Alamat dan port SQL Server (default `localhost` dan `1433`) |
| `DB_USER`, `DB_PASSWORD` | Akun SQL Server yang dibuat oleh `db/01-create-database-and-user.sql` |
| `DB_NAME` | Nama database (default `review_kantin`) |
| `DB_ENCRYPT`,
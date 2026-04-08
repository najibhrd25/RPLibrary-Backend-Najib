# RPLibrary Backend API 📚🚀

Proyek ini adalah API backend untuk sistem manajemen perpustakaan **RPLibrary**, dibuat khusus untuk menuntaskan evaluasi **Seleksi Admin Lab RPL 2026**. Proyek ini dioptimalkan untuk lingkungan **macOS** (misalnya menggunakan library `bcryptjs` agar kompilasi native Mac aman) dan dilengkapi dengan Arsitektur Modular, validasi berbasis `Zod`, upload file via `Multer`, serta `PostgreSQL` lewat Prisma ORM.

## Tech Stack
- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **ORM**: Prisma ORM
- **Database**: PostgreSQL / MySQL
- **Validation**: Zod
- **Auth**: JWT (JSON Web Token) & `bcryptjs`
- **File Upload**: Multer

---

## 🛠 Instalasi & Cara Menjalankan Server di macOS

### 1. Persiapan Database (Mac)
Anda disarankan menggunakan **DBngin** untuk menyalakan server PostgreSQL/MySQL lokal, dan **TablePlus** untuk melihat datanya.
- Buka **DBngin**, buat server PostgreSQL baru lalu Start.
- Catat port (biasanya `5432`).
- Buka **TablePlus**, koneksikan, dan buat database baru bernama `rplibrary`.

### 2. Konfigurasi Proyek
1. Buka Terminal dan clone repository ini / masuk ke foldernya.
2. Install semua dependency:
   ```bash
   npm install
   ```

3. Buat file `.env` berdasarkan contoh yang telah saya buat di `.env.example`.
   Sesuaikan `DATABASE_URL` jika password root di DBngin Anda berbeda (default DBngin MacOS biasanya username `root` no password, tapi di `.env.example` saya anggap general).
   ```bash
   cp .env.example .env
   ```

### 3. Setup Database (Prisma Migrations)
Jalankan perintah ini agar Prisma membuat tabel (User, Book, Category, Transaction) ke dalam database secara otomatis:
```bash
npx prisma db push
```

*(Opsional) Jika ingin memasukkan data dummy (Seeding), Anda dapat memasukkan baris manual via TablePlus terlebih dahulu sebelum fitur tambah buku dipakai.*

### 4. Jalankan Aplikasi
Aplikasi sudah dikonfigurasi dengan `nodemon` agar server restart otomatis saat ada perubahan kode:
```bash
npm run dev
```

Jika muncul `🚀 RPLibrary API is running perfectly on http://localhost:3000`, maka server sudah siap dipakai! 🎉

---

## 📌 Endpoint API

Berikut adalah daftar endpoint. **Gunakan file `RPLibrary.postman_collection.json` untuk testing yang instan tanpa harus set manual.**

### 1. Authentication
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/api/auth/register` | Mendaftarkan akun member baru. | Public |
| POST | `/api/auth/login` | Login user (Admin / Member). | Public |

### 2. Books Management
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/api/books` | Melihat seluruh buku. Bisa filter `?title=` atau `?categoryId=`. | Public |
| POST | `/api/books` | Menambah buku (Form Data `coverImage`). | Admin |
| PUT | `/api/books/:id` | Mengubah buku (beserta ganti cover). | Admin |
| DELETE | `/api/books/:id` | Menghapus buku beserta file cover. | Admin |

### 3. Borrowing System (Transaction)
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/api/transactions` | Melihat riwayat transaksi (Admin: Semua, Member: Milik sendiri). | Admin / Member |
| POST | `/api/transactions/borrow` | Meminjam buku (Otomatis kurangi stock). | Member |
| PUT | `/api/transactions/:id/return` | Mengonfirmasi klaim pengembalian (Stock kembali bertambah). | Admin |

---
*Dibuat oleh Tim Spesial untuk Seleksi Admin Lab RPL ITS 2026.*

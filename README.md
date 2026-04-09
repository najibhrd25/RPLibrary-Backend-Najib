# RPLibrary - Library Management API 📚🚀

RPLibrary adalah sistem backend berbasis REST API yang dirancang untuk mengelola peminjaman koleksi buku di Lab RPL. Proyek ini dikembangkan sebagai pemenuhan **Tugas Materi Role Backend - Oprec Admin RPL 2026**. API ini dibangun dengan prinsip arsitektur modular, *type-safety*, dan keamanan yang tangguh, siap untuk dikonsumsi oleh aplikasi _frontend_ di masa mendatang.

---

## 🏗 Tech Stack & Justification

Sistem ini dibangun menggunakan teknologi modern untuk memastikan aplikasi berjalan cepat, aman, dan mudah di-_maintain_:

1. **Node.js & Express.js**: Dipilih karena arsitektur non-blocking I/O yang sangat cepat untuk menangani _request_ API RESTful secara konkuren. Ekosistem Express juga luas sehingga mempercepat proses *development*.
2. **Prisma ORM & PostgreSQL**: Prisma memberikan *type-safety* (auto-completion yang kuat di editor) dan sistem migrasi database yang lebih mudah dibaca dibandingkan ORM tradisional. PostgreSQL digunakan karena kemampuannya menjaga _data integrity_ dan relasi yang kompleks.
3. **Zod Validator**: Dipilih untuk memvalidasi _request body_. Berbeda dengan Joi, Zod sangat ringan dan cocok disandingkan dengan ekosistem TypeScript/Type-Safe backend.
4. **JWT & bcryptjs**: Untuk otentikasi *stateless* menggunakan JSON Web Token, memastikan API bisa diskalakan tanpa memberatkan memori server. `bcryptjs` dipilih alih-alih `bcrypt` bawaan karena kompatibilitas kompilasi yang lebih aman di berbagai OS (khususnya macOS Apple Silicon).
5. **Multer**: Middleware yang sangat andal untuk mengelola pengunggahan (_upload_) file *multipart/form-data* seperti *cover* buku dan foto profil pengguna.

---

## 🎯 User Stories Mapping

Aplikasi ini telah memenuhi seluruh kriteria *User Story* dan tugas tambahan (_Optional_):

| No | User Story | Status | Endpoint / Fitur Terkait |
|----|------------|--------|--------------------------|
| 1 | Pengguna dapat mendaftar sistem. | ✅ Selesai | `POST /api/auth/register` |
| 2 | Pengguna dapat login. | ✅ Selesai | `POST /api/auth/login` |
| 3 | Role-Based Access Control (Admin/Member) | ✅ Selesai | Middleware `auth(role)` |
| 4 | Admin mengelola CRUD buku. | ✅ Selesai | `GET`, `POST`, `PUT`, `DELETE /api/books` |
| 5 | Admin dapat mengunggah cover buku. | ✅ Selesai | Multer pada `POST/PUT /api/books` |
| 6 | Pengguna dapat mengunggah foto profil. | ✅ Selesai | `PUT /api/users/profile-picture` |
| 7 | Pengguna meminjam buku. | ✅ Selesai | `POST /api/transactions/borrow` (Kurangi stock) |
| 8 | Admin mengonfirmasi pengembalian. | ✅ Selesai | `PUT /api/transactions/:id/return` (Tambah stock)|
| Opt | Admin mengelola CRUD Kategori. | ✅ Selesai | `GET`, `POST`, `PUT`, `DELETE /api/categories` |
| Opt | Pengguna mencari/filter buku. | ✅ Selesai | `GET /api/books?title=..&categoryId=..` |

---

## 🗄 Database Schema

Sistem memiliki 4 entitas utama:
- **User**: Menyimpan data pengguna, password enkripsi, tipe Role (`ADMIN`, `MEMBER`), dan foto profil. Relasi _One-to-Many_ ke Transaction.
- **Category**: Tabel referensi kategori/genre buku. Relasi _One-to-Many_ ke Book.
- **Book**: Menyimpan detail buku, cover, ID kategori, dan sistem `stock`.
- **Transaction**: Tabel _pivot/history_ riwayat peminjaman buku. Menyimpan ID Buku, ID User, tanggal pinjam, dan status (`BORROWED`, `RETURNED`).

---

## 🚀 Instalasi & Menjalankan di Local Environment (macOS/Linux)

1. Pastikan Anda telah menginstal **Node.js** dan server Database (misal: PostgreSQL lewat **DBngin**).
2. _Clone_ repositori ini, lalu masuk ke foldernya di Terminal.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Salin file *environment variables*:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` bagian `DATABASE_URL` sesuaikan dengan kredensial PostgreSQL lokal Anda.*
5. Jalankan migrasi database via Prisma:
   ```bash
   npx prisma db push
   ```
   *(Opsional: Gunakan Prisma Studio dengan `npx prisma studio` untuk melihat tabel Anda di browser)*
6. Jalankan Server API:
   ```bash
   npm run dev
   ```

Aplikasi akan berjalan di `http://localhost:3000`.

---

## 📖 API Documentation Lengkap

> **Catatan Authentication:** <br>
> Semua endpoint yang bertanda **(Auth)** membutuhkan header: `Authorization: Bearer <token_jwt>` <br>
> Yang bertanda **(Admin Only)** berarti user yang login harus ber-role `ADMIN`.

### 1. Authentication (`/api/auth`)

#### ➔ Register Akun Baru
- **Method:** `POST /api/auth/register`
- **Access:** Public
- **Body (JSON):**
  ```json
  {
    "name": "Aldeen",
    "email": "aldeen@rpl.com",
    "password": "password123"
  }
  ```
- **Response Success (201):** Mengembalikan data user dan nilai Default Role `MEMBER`.

#### ➔ Login Akun
- **Method:** `POST /api/auth/login`
- **Access:** Public
- **Body (JSON):**
  ```json
  {
    "email": "aldeen@rpl.com",
    "password": "password123"
  }
  ```
- **Response Success (200):** Mengembalikan `token` JWT yang digunakan untuk permintaan selanjutnya.

---

### 2. User & Profile (`/api/users`)

#### ➔ Get Current Profile
- **Method:** `GET /api/users/me`
- **Access:** Auth (Member / Admin)
- **Response Success (200):** Menampilkan detail data diri, role, dan link statik `profilePicture`.

#### ➔ Upload Foto Profil
- **Method:** `PUT /api/users/profile-picture`
- **Access:** Auth (Member / Admin)
- **Body (Form-Data):**
  - `profilePicture`: File gambar (JPG/PNG).
- **Response Success (200):** File tersimpan menggunakan `multer` di folder `uploads/` dan URL profile picture otomatis ter-update di database.

---

### 3. Category Management (`/api/categories`)

#### ➔ Get All Categories
- **Method:** `GET /api/categories`
- **Access:** Public

#### ➔ Create Category
- **Method:** `POST /api/categories`
- **Access:** Auth (Admin Only)
- **Body (JSON):**
  ```json
  {
    "name": "Programming"
  }
  ```

#### ➔ Update & Delete Category
- **Update:** `PUT /api/categories/:id`
- **Delete:** `DELETE /api/categories/:id`

---

### 4. Book Management (`/api/books`)

#### ➔ Get All Books (with Filter)
- **Method:** `GET /api/books`
- **Access:** Public
- **Query Params (Opsional):** 
  - `?title=python` (Mencari buku yang mengandung kata python)
  - `?categoryId=1` (Memfilter berdasarkan kategori)

#### ➔ Tambah Buku Baru
- **Method:** `POST /api/books`
- **Access:** Auth (Admin Only)
- **Body (Form-Data):**
  - `title` (Text)
  - `author` (Text)
  - `description` (Text, optional)
  - `stock` (Text/Number)
  - `categoryId` (Text/Number)
  - `coverImage` (File Gambar JPG/PNG)
- **Response Success (201):** Cover buku otomatis tersimpan di `uploads/` dan datanya masuk ke tabel Book.

#### ➔ Update & Delete Buku
- **Update:** `PUT /api/books/:id` (Gunakan *Form-Data* jika ingin mengubah Cover Image sekaligus text).
- **Delete:** `DELETE /api/books/:id` (Juga otomatis menghapus **file fisik gambar cover** dari folder `uploads/` agar menghemat storage).

---

### 5. Transactions / Peminjaman (`/api/transactions`)

#### ➔ Get Riwayat Transaksi
- **Method:** `GET /api/transactions`
- **Access:** Auth
- **Behavior:** Jika yang mengakses adalah `ADMIN`, tampil semua transaksi seluruh user. Jika `MEMBER`, hanya tampil rekaman transaksinya sendiri.

#### ➔ Borrow Book (Pinjam Buku)
- **Method:** `POST /api/transactions/borrow`
- **Access:** Auth (Member / Admin)
- **Body (JSON):**
  ```json
  {
    "bookId": 1
  }
  ```
- **Proses:** Sistem mengecek `stock` buku (jika > 0). Jika ada, stok dikurangi 1 dan mencatat `borrowDate`. Status transaksi menjadi `BORROWED`.

#### ➔ Return Book (Kembalikan Buku)
- **Method:** `PUT /api/transactions/:id/return`
- **Access:** Auth (Admin Only) - Sesuai User Story No 8, setelah user serahkan fisik barulah Admin proses sistem.
- **Proses:** Sistem mengupdate `returnDate` jadi hari ini, status `RETURNED`, dan menambah `stock` buku +1 secara konkuen tanpa balapan *race condition*.

---
 *Dibangun dengan passion untuk Lab RPL ITS! 🚀* 

# Sistem Pencatatan Perwalian Mahasiswa STMIK Bandung

<<<<<<< HEAD
Aplikasi web terpadu untuk memfasilitasi, mencatat, dan merekapitulasi proses perwalian akademik antara Mahasiswa dan Dosen Wali di lingkungan kampus STMIK Bandung.

## 🚀 Fitur Utama

Sistem ini menggunakan pendekatan hak akses (*Role-Based Access Control*) yang ketat layaknya SIAKAD (Sistem Informasi Akademik) pada umumnya. 
**Tidak ada registrasi publik**. Pembuatan akun sepenuhnya dikendalikan oleh pihak Admin kampus.

### 👑 1. Admin
- **Manajemen Akun Terpusat**: Admin bertugas membuat akun Mahasiswa dan Dosen. Sistem secara otomatis membuatkan username (NIM/NIP) dan password default.
- **Pemetaan Dosen Wali**: Admin menentukan dosen wali untuk masing-masing mahasiswa.
- **Rekap Perwalian**: Admin dapat memantau dan mencetak rekap data perwalian seluruh mahasiswa secara *real-time*.

### 👨‍🏫 2. Dosen Wali
- **Dashboard Pemantauan**: Dosen dapat melihat daftar mahasiswa perwaliannya beserta riwayat/histori bimbingan tiap semesternya.
- **Validasi (Mendatang)**: Memantau catatan dan keluhan mahasiswa selama perwalian.

### 🎓 3. Mahasiswa
- **Pencatatan Perwalian Mandiri**: Mahasiswa melakukan input data perwalian (Tahun Akademik, Semester, Catatan/Konsultasi) melalui form yang sudah otomatis terhubung dengan dosen walinya.
- **Histori Perwalian**: Melihat riwayat lengkap perwalian dari semester-semester sebelumnya.

### 🔒 Keamanan Khusus
- **Force Change Password**: Saat akun mahasiswa atau dosen baru dibuat oleh Admin, mereka diwajibkan mengubah password default pada saat login pertama kali untuk memastikan kerahasiaan akun.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL & Supabase Auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚙️ Panduan Instalasi & Setup Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan project di komputer lokal Anda:

### 1. Clone Repository
```bash
git clone https://github.com/audrynabila28/Sistem-Pencatatan-Perwalian-Mahasiswa.git
cd Sistem-Pencatatan-Perwalian-Mahasiswa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase
1. Buat project baru di [Supabase Dashboard](https://supabase.com).
2. Buka menu **SQL Editor**, salin seluruh kode dari file `supabase/schema.sql`, dan **Run** untuk membuat seluruh tabel dan *Row Level Security (RLS)*.
3. Buka menu **Project Settings > API**, lalu salin URL dan API Keys.

### 4. Konfigurasi Environment Variables
Buat file bernama `.env.local` di root folder project, dan masukkan konfigurasi Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
```

### 5. Buat Akun Admin Pertama
Karena aplikasi ini mengunci fitur registrasi publik, Anda harus membuat akun Admin pertama secara manual:
1. Di Dashboard Supabase, pergi ke **Authentication > Users**.
2. Klik **Add User** -> **Create new user**.
3. Masukkan Email: `admin@stmik.edu` *(Domain harus valid agar sistem bisa mendeteksinya sebagai username `admin`)*.
4. Masukkan Password: (misalnya `admin123`).
5. **Salin User UID** yang terbentuk.
6. Buka **SQL Editor** kembali, lalu jalankan perintah ini (Ganti `[UID-DARI-AUTH]` dengan UID yang disalin tadi):
```sql
INSERT INTO profiles (id, username, role, nama, nim_nip, is_default_password) 
VALUES ('[UID-DARI-AUTH]', 'admin', 'admin', 'Administrator Utama', 'ADM001', false);
```

### 6. Jalankan Server
```bash
npm run dev
```
Buka browser di `http://localhost:3000`. Login menggunakan Username `admin` dan password yang Anda buat di atas. Anda sudah bisa mulai menginput data Dosen dan Mahasiswa!

## 📝 Lisensi
Dibuat untuk keperluan akademik dan pencatatan perwalian internal STMIK Bandung.
=======
Aplikasi web untuk membantu proses pencatatan, pemantauan, dan rekapitulasi kegiatan perwalian akademik antara mahasiswa dan dosen wali di lingkungan STMIK Bandung.

## Fitur Utama

Sistem menerapkan **Role-Based Access Control (RBAC)** untuk membatasi akses berdasarkan peran pengguna. Tidak tersedia registrasi akun secara umum karena seluruh pembuatan dan pengelolaan akun dilakukan oleh Admin.

### Admin

- Membuat dan mengelola akun mahasiswa serta dosen.
- Sistem membuat username berdasarkan NIM/NIP dan memberikan password awal.
- Menentukan dosen wali untuk setiap mahasiswa.
- Melihat dan merekap data perwalian seluruh mahasiswa.
- Memantau data perwalian secara terpusat.

### Dosen Wali

- Melihat daftar mahasiswa yang berada di bawah perwaliannya.
- Melihat riwayat perwalian mahasiswa pada setiap semester.
- Memantau catatan dan hasil konsultasi mahasiswa.
- Fitur validasi perwalian akan dikembangkan pada tahap berikutnya.

### Mahasiswa

- Mengisi data perwalian secara mandiri.
- Mencatat tahun akademik, semester, serta catatan atau hasil konsultasi.
- Data perwalian otomatis terhubung dengan dosen wali yang telah ditentukan oleh Admin.
- Melihat riwayat perwalian dari semester sebelumnya.

## Keamanan

Sistem menggunakan pembatasan akses berdasarkan role untuk memastikan setiap pengguna hanya dapat mengakses fitur dan data sesuai kewenangannya.

### Force Change Password

Akun mahasiswa dan dosen yang baru dibuat oleh Admin akan menggunakan password awal. Pada login pertama, pengguna diwajibkan mengganti password tersebut sebelum dapat menggunakan sistem secara penuh.

### Database & Authentication

Database dan autentikasi menggunakan **Supabase**, dengan PostgreSQL sebagai database utama dan Supabase Auth untuk pengelolaan akun pengguna.

Akses terhadap data dikontrol melalui autentikasi dan kebijakan keamanan database (Row Level Security/RLS), sehingga data tidak dapat diakses atau dimodifikasi secara sembarangan.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Struktur Role

| Role | Akses Utama |
|------|-------------|
| Admin | Manajemen akun, dosen wali, dan rekap seluruh data |
| Dosen Wali | Melihat mahasiswa dan riwayat perwalian |
| Mahasiswa | Mengisi dan melihat riwayat perwalian |

## Status Pengembangan

Project masih dalam tahap pengembangan. Beberapa fitur, seperti validasi perwalian oleh Dosen Wali, akan dikembangkan pada tahap berikutnya.
>>>>>>> d95410a25f1987a1738c2fe139e570e632842e3a

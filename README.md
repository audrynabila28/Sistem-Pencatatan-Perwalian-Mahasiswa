# Sistem Pencatatan Perwalian Mahasiswa STMIK Bandung

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


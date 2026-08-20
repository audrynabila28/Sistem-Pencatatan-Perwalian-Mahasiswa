# Sistem Pencatatan Perwalian Mahasiswa STMIK Bandung

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

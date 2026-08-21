# Sistem Pencatatan Perwalian Mahasiswa STMIK Bandung

Aplikasi web untuk membantu proses pencatatan dan pemantauan kegiatan perwalian akademik antara mahasiswa dan dosen wali di lingkungan STMIK Bandung.

Sistem dirancang dengan pembagian hak akses berdasarkan role sehingga setiap pengguna hanya dapat mengakses fitur dan data sesuai dengan kewenangannya. Pembuatan akun juga tidak tersedia secara publik dan dikelola oleh Admin.

## Fitur

### Admin

Admin memiliki akses untuk mengelola data dan aktivitas perwalian secara keseluruhan.

- Mengelola akun mahasiswa dan dosen.
- Membuat akun menggunakan NIM/NIP sebagai identitas pengguna.
- Menentukan dosen wali untuk setiap mahasiswa.
- Memantau data perwalian seluruh mahasiswa.
- Melihat rekapitulasi data perwalian.

### Dosen Wali

Dosen dapat memantau mahasiswa yang berada di bawah perwaliannya.

- Melihat daftar mahasiswa perwalian.
- Melihat riwayat perwalian setiap mahasiswa.
- Melihat catatan atau hasil konsultasi mahasiswa.
- Melakukan validasi data perwalian pada tahap pengembangan berikutnya.

### Mahasiswa

Mahasiswa menggunakan sistem untuk mencatat dan melihat kegiatan perwaliannya.

- Mengisi data perwalian berdasarkan tahun akademik dan semester.
- Menambahkan catatan atau hasil konsultasi.
- Melihat dosen wali yang telah ditentukan oleh Admin.
- Melihat riwayat perwalian dari semester sebelumnya.

## Hak Akses

| Role | Akses |
|------|-------|
| Admin | Mengelola akun, menentukan dosen wali, memantau dan merekap data perwalian |
| Dosen Wali | Melihat mahasiswa perwaliannya dan riwayat perwalian |
| Mahasiswa | Mencatat dan melihat riwayat perwalian |

## Keamanan

Sistem menerapkan **Role-Based Access Control (RBAC)** untuk membatasi akses berdasarkan role pengguna.

Tidak terdapat registrasi publik. Akun mahasiswa dan dosen dibuat oleh Admin menggunakan data yang telah ditentukan oleh kampus.

### Perubahan Password

Akun yang dibuat oleh Admin menggunakan password awal. Pada login pertama, pengguna diwajibkan mengganti password tersebut sebelum dapat menggunakan sistem secara penuh.

### Database dan Authentication

Sistem menggunakan **Supabase** sebagai database dan layanan autentikasi.

- PostgreSQL sebagai database.
- Supabase Auth untuk autentikasi pengguna.
- Row Level Security (RLS) untuk membatasi akses data pada tingkat database.

Dengan konfigurasi tersebut, akses terhadap data disesuaikan dengan role dan hak akses masing-masing pengguna.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

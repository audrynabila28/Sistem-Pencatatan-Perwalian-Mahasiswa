export const metadata = {
  title: 'Dashboard Mahasiswa',
}

export default function MahasiswaDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Mahasiswa</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">
          Selamat datang di sistem perwalian. Gunakan menu "Catat Perwalian" untuk mengisi data perwalian Anda.
        </p>
      </div>
    </div>
  )
}

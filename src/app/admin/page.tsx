export const metadata = {
  title: 'Dashboard Admin',
}

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">
          Selamat datang di halaman Admin. Gunakan menu di sidebar untuk mengelola data perwalian.
        </p>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Dashboard Dosen',
}

export default function DosenDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Dosen</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">
          Selamat datang di sistem perwalian. Gunakan menu di sidebar untuk melihat histori perwalian mahasiswa wali Anda.
        </p>
      </div>
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import DashboardClient from './DashboardClient'

export const metadata = {
  title: 'Dashboard - Admin',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Ambil semua data Mahasiswa (Untuk DashboardClient User Management)
  const { data: mahasiswaList } = await supabase
    .from('profiles')
    .select('id, nama, nim_nip, prodi, role')
    .eq('role', 'mahasiswa')
    .order('nama', { ascending: true })

  // Ambil semua data Dosen (Untuk DashboardClient User Management)
  const { data: dosenList } = await supabase
    .from('profiles')
    .select('id, nama, nim_nip, prodi, role')
    .eq('role', 'dosen')
    .order('nama', { ascending: true })

  // Ambil semua perwalian (Untuk menghitung Sudah Perwalian & Statistik Status)
  const { data: perwalianData } = await supabase
    .from('perwalian')
    .select(`
      id,
      mahasiswa_id,
      status,
      tanggal,
      tahun_akademik,
      semester,
      mahasiswa:profiles!perwalian_mahasiswa_id_fkey(nama, nim_nip),
      dosen:profiles!perwalian_dosen_id_fkey(nama, nim_nip)
    `)
    .order('tanggal', { ascending: false })

  const perwalianRaw = perwalianData || []

  // --- STATISTIK STATUS PERWALIAN (KODE RYAN) ---
  const total = perwalianRaw.length
  const diajukan = perwalianRaw.filter((p) => p.status === 'diajukan').length
  const diproses = perwalianRaw.filter((p) => p.status === 'diproses').length
  const diterima = perwalianRaw.filter((p) => p.status === 'diterima').length
  const ditolak = perwalianRaw.filter((p) => p.status === 'ditolak').length
  const terbaru = perwalianRaw.slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Banner Utama */}
      <div className="bg-slate-900 rounded-xl p-8 text-white flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">
            Dashboard Administrator
          </h2>
          <p className="text-slate-300 mt-2 max-w-xl">
            Kelola data mahasiswa, dosen, serta pantau seluruh aktivitas perwalian.
          </p>
        </div>
        <div className="bg-white/10 rounded-lg px-5 py-4 hidden sm:block">
          <p className="text-xs text-slate-300">
            Total Pengajuan
          </p>
          <p className="text-3xl font-bold mt-1 text-center">
            {total}
          </p>
        </div>
      </div>

      {/* MANAJEMEN PENGGUNA (KODE KITA - DASHBOARD CLIENT) */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Manajemen Pengguna</h3>
        <DashboardClient 
          mahasiswaList={mahasiswaList || []}
          dosenList={dosenList || []}
          perwalianData={perwalianRaw}
        />
      </div>

      <hr className="border-gray-200" />

      {/* STATISTIK STATUS PERWALIAN (KODE RYAN) */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Statistik Pengajuan Perwalian</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 border-t-4 border-t-yellow-500">
            <p className="text-sm text-gray-500">Diajukan</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{diajukan}</p>
            <p className="text-xs text-gray-500 mt-1">Menunggu proses</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 border-t-4 border-t-blue-500">
            <p className="text-sm text-gray-500">Diproses</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{diproses}</p>
            <p className="text-xs text-gray-500 mt-1">Sedang diperiksa</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 border-t-4 border-t-green-500">
            <p className="text-sm text-gray-500">Diterima</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{diterima}</p>
            <p className="text-xs text-gray-500 mt-1">Pengajuan disetujui</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 border-t-4 border-t-red-500">
            <p className="text-sm text-gray-500">Ditolak</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{ditolak}</p>
            <p className="text-xs text-gray-500 mt-1">Pengajuan ditolak</p>
          </div>
        </div>

        {/* Pengajuan Terbaru (KODE RYAN) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pengajuan Perwalian Terbaru</h3>
            <p className="text-sm text-gray-500 mt-1">Lima pengajuan perwalian terakhir.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mahasiswa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosen Wali</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {terbaru.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">Belum ada pengajuan perwalian.</td>
                  </tr>
                ) : (
                  terbaru.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{(item.mahasiswa as any)?.nama || '-'}</div>
                        <div className="text-sm text-gray-500">{(item.mahasiswa as any)?.nim_nip || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{(item.dosen as any)?.nama || '-'}</div>
                        <div className="text-sm text-gray-500">{(item.dosen as any)?.nim_nip || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.tahun_akademik}</div>
                        <div className="text-xs text-gray-500">{item.semester}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{format(new Date(item.tanggal), 'dd MMM yyyy', { locale: id })}</div>
                        <div className="text-xs text-gray-500">{format(new Date(item.tanggal), 'HH:mm', { locale: id })}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === 'diajukan' && <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Diajukan</span>}
                        {item.status === 'diproses' && <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Diproses</span>}
                        {item.status === 'diterima' && <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Diterima</span>}
                        {item.status === 'ditolak' && <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Ditolak</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
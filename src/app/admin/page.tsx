import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export const metadata = {
  title: 'Dashboard Admin',
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: perwalian, error } = await supabase
    .from('perwalian')
    .select(`
      id,
      tanggal,
      tahun_akademik,
      semester,
      status,
      catatan_mahasiswa,
      mahasiswa:profiles!perwalian_mahasiswa_id_fkey(
        nama,
        nim_nip
      ),
      dosen:profiles!perwalian_dosen_id_fkey(
        nama,
        nim_nip
      )
    `)
    .order('tanggal', { ascending: false })

  const total = perwalian?.length || 0

  const diajukan =
    perwalian?.filter((item) => item.status === 'diajukan').length || 0

  const diproses =
    perwalian?.filter((item) => item.status === 'diproses').length || 0

  const diterima =
    perwalian?.filter((item) => item.status === 'diterima').length || 0

  const ditolak =
    perwalian?.filter((item) => item.status === 'ditolak').length || 0

  const terbaru = perwalian?.slice(0, 5) || []

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard Admin
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Selamat datang di dashboard administrasi perwalian mahasiswa.
        </p>
      </div>

      {/* Welcome Card */}
      <div className="bg-slate-900 rounded-xl shadow-sm p-6 mb-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">
              Sistem Informasi Perwalian
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Pantau pengajuan perwalian mahasiswa dan status proses
              persetujuan dosen wali melalui dashboard ini.
            </p>
          </div>

          <div className="bg-white/10 rounded-lg px-5 py-4">
            <p className="text-xs text-slate-300">
              Total Pengajuan
            </p>
            <p className="text-3xl font-bold mt-1">
              {total}
            </p>
          </div>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

        {/* Total */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Total
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {total}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Semua pengajuan
          </p>
        </div>

        {/* Diajukan */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Diajukan
          </p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {diajukan}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Menunggu proses
          </p>
        </div>

        {/* Diproses */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Diproses
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {diproses}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Sedang diperiksa
          </p>
        </div>

        {/* Diterima */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Diterima
          </p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {diterima}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Pengajuan disetujui
          </p>
        </div>

        {/* Ditolak */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Ditolak
          </p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {ditolak}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Pengajuan ditolak
          </p>
        </div>

      </div>

      {/* Pengajuan Terbaru */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">

        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pengajuan Perwalian Terbaru
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Lima pengajuan perwalian terbaru.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mahasiswa
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosen Wali
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {terbaru.length === 0 ? (

                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Belum ada pengajuan perwalian.
                  </td>
                </tr>

              ) : (

                terbaru.map((item) => (

                  <tr
                    key={item.id}
                    className="hover:bg-gray-50"
                  >

                    {/* Mahasiswa */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {(item.mahasiswa as any)?.nama || '-'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(item.mahasiswa as any)?.nim_nip || '-'}
                      </div>
                    </td>

                    {/* Dosen */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {(item.dosen as any)?.nama || '-'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(item.dosen as any)?.nim_nip || '-'}
                      </div>
                    </td>

                    {/* Semester */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.tahun_akademik}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.semester}
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(
                          new Date(item.tanggal),
                          'dd MMM yyyy',
                          { locale: id }
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(
                          new Date(item.tanggal),
                          'HH:mm',
                          { locale: id }
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      {item.status === 'diajukan' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          Diajukan
                        </span>
                      )}

                      {item.status === 'diproses' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          Diproses
                        </span>
                      )}

                      {item.status === 'diterima' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Diterima
                        </span>
                      )}

                      {item.status === 'ditolak' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          Ditolak
                        </span>
                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
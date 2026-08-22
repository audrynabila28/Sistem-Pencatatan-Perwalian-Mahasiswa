import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import StatusPerwalian from './statusPerwalian'

export const metadata = {
  title: 'Histori Perwalian - Dosen',
}

export default async function HistoriDosenPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Jika user belum login
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Anda belum login
          </h2>
          <p className="text-sm text-red-600 mt-1">
            Silakan login terlebih dahulu untuk melihat histori perwalian.
          </p>
        </div>
      </div>
    )
  }

  // Ambil data perwalian khusus mahasiswa yang menjadi wali dosen ini
  const { data: histori, error } = await supabase
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
      )
    `)
    .eq('dosen_id', user.id)
    .order('tanggal', { ascending: false })

  // Jika terjadi error dari Supabase
  if (error) {
    console.error('Error mengambil histori perwalian:', error)

    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Gagal mengambil data
          </h2>

          <p className="text-sm text-red-600 mt-1">
            {error.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Histori Perwalian Mahasiswa Wali
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Berikut adalah daftar riwayat perwalian dari mahasiswa
          bimbingan Anda. Anda dapat memproses, menerima, atau
          menolak pengajuan perwalian.
        </p>
      </div>

      {/* Statistik Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Diajukan */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">
            Diajukan
          </p>

          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {histori?.filter(
              (item) => item.status === 'diajukan'
            ).length || 0}
          </p>
        </div>

        {/* Diproses */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">
            Diproses
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-600">
            {histori?.filter(
              (item) => item.status === 'diproses'
            ).length || 0}
          </p>
        </div>

        {/* Diterima */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">
            Diterima
          </p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {histori?.filter(
              (item) => item.status === 'diterima'
            ).length || 0}
          </p>
        </div>

        {/* Ditolak */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">
            Ditolak
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {histori?.filter(
              (item) => item.status === 'ditolak'
            ).length || 0}
          </p>
        </div>

      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full divide-y divide-gray-200">

            {/* Header tabel */}
            <thead className="bg-gray-50">
              <tr>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mahasiswa
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tahun/Semester
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Catatan
                </th>

              </tr>
            </thead>

            {/* Isi tabel */}
            <tbody className="bg-white divide-y divide-gray-200">

              {!histori || histori.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Belum ada riwayat perwalian dari mahasiswa Anda.
                  </td>
                </tr>

              ) : (

                histori.map((item) => (

                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >

                    {/* Tanggal */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      <div className="text-sm text-gray-900">
                        {format(
                          new Date(item.tanggal),
                          'dd MMM yyyy',
                          { locale: id }
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {format(
                          new Date(item.tanggal),
                          'HH:mm',
                          { locale: id }
                        )}
                      </div>

                    </td>

                    {/* Mahasiswa */}
                    <td className="px-6 py-4">

                      <div className="text-sm font-medium text-gray-900">
                        {(item.mahasiswa as any)?.nama || '-'}
                      </div>

                      <div className="text-sm text-gray-500">
                        {(item.mahasiswa as any)?.nim_nip || '-'}
                      </div>

                    </td>

                    {/* Tahun / Semester */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      <div className="text-sm text-gray-900">
                        {item.tahun_akademik}
                      </div>

                      <div className="text-xs text-gray-500">
                        Semester {item.semester}
                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      {item.status === 'diajukan' && (
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            Diajukan
                          </span>

                          <p className="mt-1 text-xs text-gray-500">
                            Menunggu diproses
                          </p>
                        </div>
                      )}

                      {item.status === 'diproses' && (
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Diproses
                          </span>

                          <p className="mt-1 text-xs text-gray-500">
                            Sedang diperiksa
                          </p>
                        </div>
                      )}

                      {item.status === 'diterima' && (
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Diterima
                          </span>

                          <p className="mt-1 text-xs text-gray-500">
                            Perwalian disetujui
                          </p>
                        </div>
                      )}

                      {item.status === 'ditolak' && (
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Ditolak
                          </span>

                          <p className="mt-1 text-xs text-gray-500">
                            Perwalian ditolak
                          </p>
                        </div>
                      )}

                      {!item.status && (
                        <span className="text-sm text-gray-400">
                          -
                        </span>
                      )}

                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4">

                      <StatusPerwalian
                        id={item.id}
                        status={item.status}
                      />

                    </td>

                    {/* Catatan */}
                    <td className="px-6 py-4">

                      <div className="text-sm text-gray-900 max-w-xs">
                        {item.catatan_mahasiswa || '-'}
                      </div>

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
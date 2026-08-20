import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export const metadata = {
  title: 'Rekap Perwalian - Admin',
}

export default async function RekapPerwalianPage() {
  const supabase = await createClient()

  const { data: rekap } = await supabase
    .from('perwalian')
    .select(`
      id,
      tanggal,
      tahun_akademik,
      semester,
      catatan_mahasiswa,
      mahasiswa:profiles!perwalian_mahasiswa_id_fkey(nama, nim_nip),
      dosen:profiles!perwalian_dosen_id_fkey(nama, nim_nip)
    `)
    .order('tanggal', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Rekap Data Perwalian</h2>
        {/* Fitur ekspor bisa ditambahkan di sini nanti */}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mahasiswa
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosen Wali
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahun/Semester
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!rekap || rekap.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    Belum ada data perwalian.
                  </td>
                </tr>
              ) : (
                rekap.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(item.tanggal), 'dd MMM yyyy HH:mm', { locale: id })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.mahasiswa?.nama}</div>
                      <div className="text-sm text-gray-500">{item.mahasiswa?.nim_nip}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.dosen?.nama}</div>
                      <div className="text-sm text-gray-500">{item.dosen?.nim_nip}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.tahun_akademik} - {item.semester}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={item.catatan_mahasiswa}>
                      {item.catatan_mahasiswa || '-'}
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

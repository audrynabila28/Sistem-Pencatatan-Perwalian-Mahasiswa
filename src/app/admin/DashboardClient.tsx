'use client'

import { useState } from 'react'
import { Users, UserCheck, UserX, GraduationCap, Trash2, Search, Loader2 } from 'lucide-react'
import { deleteUserAction } from './actions'

type Profile = { id: string; nama: string; nim_nip: string; prodi: string; role: string }

export default function DashboardClient({
  mahasiswaList,
  dosenList,
  perwalianData
}: {
  mahasiswaList: Profile[]
  dosenList: Profile[]
  perwalianData: { mahasiswa_id: string }[]
}) {
  const [activeTab, setActiveTab] = useState<'total_mahasiswa' | 'sudah_perwalian' | 'belum_perwalian' | 'total_dosen' | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Hitung Set mahasiswa yang sudah perwalian untuk pencarian cepat (O(1))
  const sudahPerwalianSet = new Set(perwalianData.map(p => p.mahasiswa_id))

  // Hitung jumlah
  const totalMahasiswa = mahasiswaList.length
  const totalDosen = dosenList.length
  
  // Mahasiswa lists
  const sudahPerwalianList = mahasiswaList.filter(m => sudahPerwalianSet.has(m.id))
  const belumPerwalianList = mahasiswaList.filter(m => !sudahPerwalianSet.has(m.id))

  const stats = [
    { id: 'total_mahasiswa', name: 'Total Mahasiswa', value: totalMahasiswa, icon: Users, color: 'bg-blue-500' },
    { id: 'sudah_perwalian', name: 'Sudah Perwalian', value: sudahPerwalianList.length, icon: UserCheck, color: 'bg-emerald-500' },
    { id: 'belum_perwalian', name: 'Belum Perwalian', value: belumPerwalianList.length, icon: UserX, color: 'bg-rose-500' },
    { id: 'total_dosen', name: 'Total Dosen Wali', value: totalDosen, icon: GraduationCap, color: 'bg-indigo-500' },
  ]

  let currentListData: Profile[] = []
  let tableTitle = ''

  if (activeTab === 'total_mahasiswa') {
    currentListData = mahasiswaList
    tableTitle = 'Data Seluruh Mahasiswa'
  } else if (activeTab === 'sudah_perwalian') {
    currentListData = sudahPerwalianList
    tableTitle = 'Data Mahasiswa (Sudah Perwalian)'
  } else if (activeTab === 'belum_perwalian') {
    currentListData = belumPerwalianList
    tableTitle = 'Data Mahasiswa (Belum Perwalian)'
  } else if (activeTab === 'total_dosen') {
    currentListData = dosenList
    tableTitle = 'Data Seluruh Dosen Wali'
  }

  const handleDelete = async (user: Profile) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${user.nama} (${user.nim_nip}) secara permanen? Seluruh data perwalian terkait juga akan terhapus.`)) {
      return
    }

    setDeletingId(user.id)
    const result = await deleteUserAction(user.id)
    setDeletingId(null)
    
    if (result.success) {
      alert(result.message)
      // Karena kita pakai revalidatePath di server action, halaman akan terefresh otomatis
    } else {
      alert(`Gagal: ${result.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <button
            key={stat.id}
            onClick={() => setActiveTab(activeTab === stat.id as any ? null : stat.id as any)}
            className={`text-left bg-white rounded-lg shadow-sm border p-6 flex items-center transition-all ${activeTab === stat.id ? 'border-slate-500 ring-2 ring-slate-200' : 'border-gray-200 hover:border-slate-300'}`}
          >
            <div className={`p-3 rounded-lg ${stat.color} text-white mr-4 shadow-sm`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* Tabel Data (Hanya muncul jika ada tab yang aktif) */}
      {activeTab && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{tableTitle}</h3>
            <div className="text-sm text-gray-500">{currentListData.length} baris</div>
          </div>
          
          <div className="overflow-x-auto max-h-[500px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIM / NIP
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program Studi
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentListData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                ) : (
                  currentListData.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.nama}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.nim_nip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.prodi || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={deletingId === user.id}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          title="Hapus Pengguna"
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Tambahan - Hanya tampil jika tidak ada tab yang dipilih */}
      {!activeTab && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8 text-center text-gray-500">
          <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>Klik salah satu kotak statistik di atas untuk melihat detail data.</p>
        </div>
      )}
    </div>
  )
}

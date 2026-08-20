'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Trash2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Profile = { id: string; nama: string; nim_nip: string }
type Assignment = {
  id: string
  mahasiswa_id: string
  dosen_id: string
  mahasiswa: { nama: string; nim_nip: string }
  dosen: { nama: string; nim_nip: string }
}

export default function DosenWaliClient({
  mahasiswaList,
  dosenList,
  initialAssignments,
}: {
  mahasiswaList: Profile[]
  dosenList: Profile[]
  initialAssignments: any[]
}) {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [selectedMahasiswa, setSelectedMahasiswa] = useState('')
  const [selectedDosen, setSelectedDosen] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  // Filter mahasiswa yang belum punya dosen wali
  const availableMahasiswa = mahasiswaList.filter(
    (m) => !assignments.some((a) => a.mahasiswa_id === m.id)
  )

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMahasiswa || !selectedDosen) return

    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase
        .from('dosen_wali')
        .insert({
          mahasiswa_id: selectedMahasiswa,
          dosen_id: selectedDosen,
        })
        .select(`
          id,
          mahasiswa_id,
          dosen_id,
          mahasiswa:profiles!dosen_wali_mahasiswa_id_fkey(nama, nim_nip),
          dosen:profiles!dosen_wali_dosen_id_fkey(nama, nim_nip)
        `)
        .single()

      if (error) throw error

      if (data) {
        setAssignments([...assignments, data as any])
        setSelectedMahasiswa('')
        setSelectedDosen('')
        setMessage({ type: 'success', text: 'Dosen wali berhasil ditetapkan.' })
        router.refresh()
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus penetapan dosen wali ini?')) return

    try {
      const { error } = await supabase.from('dosen_wali').delete().eq('id', id)
      if (error) throw error

      setAssignments(assignments.filter((a) => a.id !== id))
      setMessage({ type: 'success', text: 'Penetapan dosen wali berhasil dihapus.' })
      router.refresh()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal menghapus' })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Form Assign */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Input Dosen Wali</h3>
          
          {message && (
            <div className={`mb-4 p-3 rounded text-sm flex items-start ${message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {message.type === 'error' ? <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" /> : <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mahasiswa</label>
              <select
                required
                value={selectedMahasiswa}
                onChange={(e) => setSelectedMahasiswa(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border p-2"
              >
                <option value="">-- Pilih Mahasiswa --</option>
                {availableMahasiswa.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nim_nip} - {m.nama}
                  </option>
                ))}
              </select>
              {availableMahasiswa.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Semua mahasiswa sudah memiliki dosen wali.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosen Wali</label>
              <select
                required
                value={selectedDosen}
                onChange={(e) => setSelectedDosen(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border p-2"
              >
                <option value="">-- Pilih Dosen --</option>
                {dosenList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nim_nip} - {d.nama}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedMahasiswa || !selectedDosen}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-slate-400"
            >
              {loading ? 'Menyimpan...' : <><Plus className="h-4 w-4 mr-2" /> Tetapkan</>}
            </button>
          </form>
        </div>
      </div>

      {/* Daftar Dosen Wali */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Daftar Dosen Wali Mahasiswa</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mahasiswa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosen Wali
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      Belum ada data dosen wali yang ditetapkan.
                    </td>
                  </tr>
                ) : (
                  assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assignment.mahasiswa?.nama}</div>
                        <div className="text-sm text-gray-500">{assignment.mahasiswa?.nim_nip}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assignment.dosen?.nama}</div>
                        <div className="text-sm text-gray-500">{assignment.dosen?.nim_nip}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

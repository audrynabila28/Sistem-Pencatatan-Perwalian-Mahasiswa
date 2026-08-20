'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function CatatPerwalianClient({
  mahasiswaId,
  dosenWali
}: {
  mahasiswaId: string
  dosenWali: any
}) {
  const [tahunAkademik, setTahunAkademik] = useState('2023/2024')
  const [semester, setSemester] = useState('Ganjil')
  const [catatan, setCatatan] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

  if (!dosenWali) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 flex items-start">
        <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-medium text-yellow-800">Dosen Wali Belum Ditetapkan</h3>
          <p className="mt-2 text-sm text-yellow-700">
            Anda belum memiliki dosen wali. Silakan hubungi Admin Program Studi untuk penetapan dosen wali Anda sebelum dapat mencatat perwalian.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.from('perwalian').insert({
        mahasiswa_id: mahasiswaId,
        dosen_id: dosenWali.dosen_id,
        tahun_akademik: tahunAkademik,
        semester: semester,
        catatan_mahasiswa: catatan
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Catatan perwalian berhasil disimpan.' })
      setCatatan('') // Reset form
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal menyimpan catatan' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Informasi Dosen Wali</h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{dosenWali.dosen?.nama}</span> ({dosenWali.dosen?.nim_nip})
        </p>
      </div>

      <div className="p-6">
        {message && (
          <div className={`mb-6 p-4 rounded-md flex items-start ${message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {message.type === 'error' ? <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" /> : <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Akademik</label>
              <input
                type="text"
                required
                value={tahunAkademik}
                onChange={(e) => setTahunAkademik(e.target.value)}
                placeholder="Misal: 2023/2024"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border p-2.5 bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border p-2.5 bg-white text-gray-900"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
                <option value="Pendek">Pendek</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Hasil Perwalian</label>
            <textarea
              required
              rows={5}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tuliskan mata kuliah yang disetujui, permasalahan, atau catatan penting lainnya..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border p-2.5 bg-white text-gray-900"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-slate-400"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Menyimpan...' : 'Simpan Catatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

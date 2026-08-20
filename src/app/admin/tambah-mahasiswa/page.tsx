'use client'

import { useState } from 'react'
import { addMahasiswa } from './actions'
import { UserPlus, AlertCircle, Copy, CheckCircle2 } from 'lucide-react'

export default function TambahMahasiswaPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<{nama: string, username: string, password: string} | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setCredentials(null)

    const formData = new FormData(e.currentTarget)
    const result = await addMahasiswa(formData)

    if (result.error) {
      setError(result.error)
    } else if (result.success && result.credentials) {
      setCredentials(result.credentials)
      ;(e.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  const handleCopy = () => {
    if (credentials) {
      const text = `Akun Mahasiswa STMIK Bandung\nNama: ${credentials.nama}\nUsername: ${credentials.username}\nPassword: ${credentials.password}\n\nHarap segera login dan ubah password Anda.`
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Akun Mahasiswa</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                name="nama"
                type="text"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border p-2"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
              <input
                name="nim"
                type="text"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border p-2"
                placeholder="Masukkan Nomor Induk Mahasiswa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
              <select
                name="prodi"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border p-2 bg-white"
              >
                <option value="">-- Pilih Program Studi --</option>
                <option value="Teknik Informatika">Teknik Informatika</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-slate-400 mt-4"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>
        </div>

        <div>
          {credentials ? (
            <div className="bg-green-50 rounded-lg border border-green-200 p-6">
              <div className="flex items-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-green-800">Akun Berhasil Dibuat!</h3>
              </div>
              
              <div className="bg-white p-4 rounded border border-green-100 font-mono text-sm mb-4 space-y-2">
                <div><span className="text-gray-500">Nama:</span> <span className="font-semibold">{credentials.nama}</span></div>
                <div><span className="text-gray-500">Username:</span> <span className="font-semibold">{credentials.username}</span></div>
                <div><span className="text-gray-500">Password:</span> <span className="font-semibold">{credentials.password}</span></div>
              </div>

              <button
                onClick={handleCopy}
                className="w-full flex justify-center items-center py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {copied ? 'Tersalin!' : <><Copy className="h-4 w-4 mr-2" /> Salin Kredensial</>}
              </button>
              <p className="text-xs text-green-700 mt-3 text-center">
                Silakan salin dan berikan informasi login ini kepada mahasiswa yang bersangkutan. Mahasiswa akan diminta mengganti password saat login pertama kali.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <UserPlus className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm">Kredensial akun yang baru dibuat akan muncul di sini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

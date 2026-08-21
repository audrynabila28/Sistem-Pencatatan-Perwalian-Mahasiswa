'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { processImportCSV } from './actions'
import { Upload, AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react'

export default function ImportDataPage() {
  const [role, setRole] = useState<'mahasiswa' | 'dosen'>('mahasiswa')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; summary: string; errors: string[] } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    setResult(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rawData = results.data as any[]
        
        // Mapping kolom CSV ke expected format
        const formattedData = rawData.map(row => {
          // Handle possible variation in header names
          const nama = row['Nama Lengkap'] || row['nama'] || row['Nama'] || ''
          const nim_nip = row['NIM / NIP'] || row['NIM'] || row['NIP'] || row['nim_nip'] || ''
          const prodi = row['Program Studi'] || row['Jurusan'] || row['prodi'] || ''
          
          return { nama, nim_nip, prodi }
        })

        const response = await processImportCSV(formattedData, role)
        setResult(response)
        setLoading(false)
        if (response.success) {
           setFile(null)
           const fileInput = document.getElementById('file-upload') as HTMLInputElement
           if(fileInput) fileInput.value = ''
        }
      },
      error: (error) => {
        setResult({
          success: false,
          summary: 'Gagal membaca file CSV',
          errors: [error.message]
        })
        setLoading(false)
      }
    })
  }

  const downloadTemplate = () => {
    const csvContent = "Nama Lengkap,NIM / NIP,Program Studi\nAudry Nabila Anastasya,1223009,Teknik Informatika\nBudi Santoso,1223010,Sistem Informasi"
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `Template_Import_${role}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Import Data Massal</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600 mb-6">
          Gunakan fitur ini untuk mendaftarkan akun Mahasiswa atau Dosen secara massal menggunakan file CSV. 
          Sistem akan secara otomatis men-generate Username dan Password rahasia (<code>stmik@[NIM/NIP]</code>) untuk setiap baris data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tipe Data</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border p-2 bg-white text-gray-900"
              >
                <option value="mahasiswa">Data Mahasiswa</option>
                <option value="dosen">Data Dosen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unggah File CSV</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-slate-600 hover:text-slate-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-slate-500"
                    >
                      <span>Pilih File</span>
                      <input id="file-upload" name="file-upload" type="file" accept=".csv" className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {file ? file.name : "Hanya file .csv yang didukung"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-slate-400"
            >
              {loading ? (
                <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Memproses Data...</>
              ) : (
                'Mulai Import'
              )}
            </button>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-blue-500" /> Panduan File CSV
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 mb-4">
              <li>Pastikan baris pertama (Header) berisi teks yang sesuai.</li>
              <li>Sistem akan mencari kolom dengan nama: <strong>Nama Lengkap</strong>, <strong>NIM / NIP</strong>, dan <strong>Program Studi</strong>.</li>
              <li>Jangan memasukkan data ganda (NIM yang sama).</li>
              <li>Jika menggunakan Microsoft Excel, pilih <em>Save As &gt; CSV (Comma delimited)</em>.</li>
            </ul>
            
            <button
              onClick={downloadTemplate}
              className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2 text-gray-500" /> Unduh Template CSV
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className={`rounded-lg border p-6 ${result.success ? (result.errors.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200') : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center mb-4">
            {result.success && result.errors.length === 0 ? (
              <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
            ) : (
              <AlertCircle className={`h-6 w-6 mr-2 ${result.success ? 'text-yellow-600' : 'text-red-600'}`} />
            )}
            <h3 className={`text-lg font-medium ${result.success ? (result.errors.length > 0 ? 'text-yellow-800' : 'text-green-800') : 'text-red-800'}`}>
              Hasil Import: {result.summary}
            </h3>
          </div>
          
          {result.errors.length > 0 && (
            <div className="bg-white rounded p-4 border border-gray-100 max-h-40 overflow-y-auto text-sm text-gray-700">
              <p className="font-semibold mb-2">Detail Error:</p>
              <ul className="list-disc list-inside space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
              {result.errors.length === 10 && (
                <p className="text-gray-500 italic mt-2">...dan error lainnya disembunyikan.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

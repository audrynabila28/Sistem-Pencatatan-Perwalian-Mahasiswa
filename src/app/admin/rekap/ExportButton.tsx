'use client'

import { Download } from 'lucide-react'
import Papa from 'papaparse'

export default function ExportButton({ data }: { data: any[] }) {
  const handleExport = () => {
    // Format data for export
    const exportData = data.map(item => ({
      'Tanggal': new Date(item.tanggal).toLocaleString('id-ID'),
      'Nama Mahasiswa': item.mahasiswa?.nama || '-',
      'NIM': item.mahasiswa?.nim_nip || '-',
      'Dosen Wali': item.dosen?.nama || '-',
      'NIP/NIDN': item.dosen?.nim_nip || '-',
      'Tahun Akademik': item.tahun_akademik,
      'Semester': item.semester,
      'Catatan': item.catatan_mahasiswa || '-'
    }))

    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `Rekap_Perwalian_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleExport}
      disabled={!data || data.length === 0}
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-gray-100 disabled:text-gray-400"
    >
      <Download className="h-4 w-4 mr-2" />
      Export Excel (CSV)
    </button>
  )
}

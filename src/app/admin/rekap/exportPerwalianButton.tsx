'use client'

import { Download } from 'lucide-react'
import * as XLSX from 'xlsx'

type Perwalian = {
  tanggal: string
  tahun_akademik: string
  semester: string
  status: string
  catatan_mahasiswa: string | null
  mahasiswa: { nama: string; nim_nip: string }[]
  dosen: { nama: string; nim_nip: string }[]
}

const STATUS_LABEL: Record<string, string> = {
  diajukan: 'Diajukan',
  diproses: 'Diproses',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
}

export default function ExportPerwalianButton({ data }: { data: Perwalian[] }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('Tidak ada data untuk diekspor.')
      return
    }

    const headers = [
      'Tanggal',
      'Mahasiswa',
      'NIM',
      'Dosen Wali',
      'NIP',
      'Tahun Akademik',
      'Semester',
      'Status',
      'Catatan',
    ]

    const rows = data.map((item) => [
      new Date(item.tanggal).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      item.mahasiswa?.[0]?.nama || '-',
      item.mahasiswa?.[0]?.nim_nip || '-',
      item.dosen?.[0]?.nama || '-',
      item.dosen?.[0]?.nim_nip || '-',
      item.tahun_akademik,
      item.semester,
      STATUS_LABEL[item.status] || item.status,
      item.catatan_mahasiswa || '-',
    ])

    // Buat worksheet dari array of arrays
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])

    // Paksa kolom NIM (index 2) & NIP (index 4) jadi text, biar angka nol di depan tidak hilang
    for (let r = 1; r <= rows.length; r++) {
      ;[2, 4].forEach((col) => {
        const cellRef = XLSX.utils.encode_cell({ r, c: col })
        if (worksheet[cellRef]) {
          worksheet[cellRef].t = 's' // set type = string
        }
      })
    }

    // Atur lebar kolom biar tidak kepotong
    worksheet['!cols'] = [
      { wch: 20 }, // Tanggal
      { wch: 25 }, // Mahasiswa
      { wch: 15 }, // NIM
      { wch: 25 }, // Dosen Wali
      { wch: 15 }, // NIP
      { wch: 15 }, // Tahun Akademik
      { wch: 10 }, // Semester
      { wch: 12 }, // Status
      { wch: 35 }, // Catatan
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Perwalian')

    const filename = `rekap-perwalian-${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(workbook, filename)
  }

  return (
    <button
      onClick={handleExport}
      disabled={!data || data.length === 0}
      className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md shadow-sm hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      <Download className="w-4 h-4 mr-2" />
      Ekspor Data
    </button>
  )
}
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface StatusPerwalianProps {
  id: string
  status: string
}

export default function StatusPerwalian({
  id,
  status
}: StatusPerwalianProps) {
  const [loading, setLoading] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('perwalian')
        .update({
          status: newStatus
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      window.location.reload()
    } catch (error: any) {
      alert(error.message || 'Gagal mengubah status')
    } finally {
      setLoading(false)
    }
  }

  // Status DIAJUKAN
  if (status === 'diajukan') {
    return (
      <button
        onClick={() => updateStatus('diproses')}
        disabled={loading}
        className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Memproses...' : 'Proses'}
      </button>
    )
  }

  // Status DIPROSES
  if (status === 'diproses') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => updateStatus('diterima')}
          disabled={loading}
          className="px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
        >
          Terima
        </button>

        <button
          onClick={() => updateStatus('ditolak')}
          disabled={loading}
          className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
        >
          Tolak
        </button>
      </div>
    )
  }

  // Status selesai
  if (status === 'diterima') {
    return (
      <span className="text-xs font-medium text-green-600">
        Perwalian telah diterima
      </span>
    )
  }

  if (status === 'ditolak') {
    return (
      <span className="text-xs font-medium text-red-600">
        Perwalian telah ditolak
      </span>
    )
  }

  return null
}
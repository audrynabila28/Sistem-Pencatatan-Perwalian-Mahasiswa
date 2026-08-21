'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase
      .from('perwalian')
      .update({
        status: newStatus
      })
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Gagal mengubah status: ' + error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.refresh()
  }

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

  return (
    <span className="text-xs text-gray-400">
      Selesai
    </span>
  )
}
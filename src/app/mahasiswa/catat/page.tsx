import { createClient } from '@/utils/supabase/server'
import CatatPerwalianClient from './client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Catat Perwalian - Mahasiswa',
}

export default async function CatatPerwalianPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch Dosen Wali for this Mahasiswa
  const { data: dosenWali } = await supabase
    .from('dosen_wali')
    .select(`
      dosen_id,
      dosen:profiles!dosen_wali_dosen_id_fkey(nama, nim_nip)
    `)
    .eq('mahasiswa_id', user.id)
    .single()

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Catat Hasil Perwalian</h2>
      <CatatPerwalianClient 
        mahasiswaId={user.id} 
        dosenWali={dosenWali} 
      />
    </div>
  )
}

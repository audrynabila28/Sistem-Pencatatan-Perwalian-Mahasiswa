import { createClient } from '@/utils/supabase/server'
import DosenWaliClient from './client'

export const metadata = {
  title: 'Kelola Dosen Wali - Admin',
}

export default async function DosenWaliPage() {
  const supabase = await createClient()

  // Fetch all mahasiswa
  const { data: mahasiswa } = await supabase
    .from('profiles')
    .select('id, nama, nim_nip')
    .eq('role', 'mahasiswa')
    .order('nama')

  // Fetch all dosen
  const { data: dosen } = await supabase
    .from('profiles')
    .select('id, nama, nim_nip')
    .eq('role', 'dosen')
    .order('nama')

  // Fetch existing assignments with join on profiles
  const { data: assignments } = await supabase
    .from('dosen_wali')
    .select(`
      id,
      mahasiswa_id,
      dosen_id,
      mahasiswa:profiles!dosen_wali_mahasiswa_id_fkey(nama, nim_nip),
      dosen:profiles!dosen_wali_dosen_id_fkey(nama, nim_nip)
    `)

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kelola Dosen Wali</h2>
      <DosenWaliClient 
        mahasiswaList={mahasiswa || []} 
        dosenList={dosen || []} 
        initialAssignments={assignments || []} 
      />
    </div>
  )
}

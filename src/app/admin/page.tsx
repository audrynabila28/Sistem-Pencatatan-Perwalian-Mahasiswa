import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export const metadata = {
  title: 'Dashboard - Admin',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Ambil semua data Mahasiswa
  const { data: mahasiswaList } = await supabase
    .from('profiles')
    .select('id, nama, nim_nip, prodi, role')
    .eq('role', 'mahasiswa')
    .order('nama', { ascending: true })

  // Ambil semua data Dosen
  const { data: dosenList } = await supabase
    .from('profiles')
    .select('id, nama, nim_nip, prodi, role')
    .eq('role', 'dosen')
    .order('nama', { ascending: true })

  // Ambil Mahasiswa yang Sudah Perwalian
  const { data: perwalianData } = await supabase
    .from('perwalian')
    .select('mahasiswa_id')

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Administrator</h2>
      <DashboardClient 
        mahasiswaList={mahasiswaList || []}
        dosenList={dosenList || []}
        perwalianData={perwalianData || []}
      />
    </div>
  )
}

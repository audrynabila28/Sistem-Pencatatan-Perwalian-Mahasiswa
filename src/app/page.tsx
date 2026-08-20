import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role === 'admin') redirect('/admin')
  if (profile?.role === 'mahasiswa') redirect('/mahasiswa')
  if (profile?.role === 'dosen') redirect('/dosen')

  redirect('/login')
}

import { createClient } from '@/utils/supabase/server'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role={profile?.role || null} />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Navbar 
          userIdentifier={profile?.username} 
          userName={profile?.nama} 
          role={profile?.role} 
        />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

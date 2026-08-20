'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, FileText, LayoutDashboard, History, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  role: string | null
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  let menuItems = []

  if (role === 'admin') {
    menuItems = [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Tambah Mahasiswa', href: '/admin/tambah-mahasiswa', icon: Users },
      { name: 'Tambah Dosen', href: '/admin/tambah-dosen', icon: Users },
      { name: 'Kelola Dosen Wali', href: '/admin/dosen-wali', icon: Settings },
      { name: 'Rekap Perwalian', href: '/admin/rekap', icon: FileText },
    ]
  } else if (role === 'mahasiswa') {
    menuItems = [
      { name: 'Dashboard', href: '/mahasiswa', icon: LayoutDashboard },
      { name: 'Catat Perwalian', href: '/mahasiswa/catat', icon: FileText },
      { name: 'Histori Perwalian', href: '/mahasiswa/histori', icon: History },
    ]
  } else if (role === 'dosen') {
    menuItems = [
      { name: 'Dashboard', href: '/dosen', icon: LayoutDashboard },
      { name: 'Histori Perwalian', href: '/dosen/histori', icon: History },
    ]
  }

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white min-h-screen">
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <div className="h-10 w-32 bg-slate-800 rounded animate-pulse flex items-center justify-center text-xs text-slate-500">
          [Slot Logo]
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  } mr-3 flex-shrink-0 h-5 w-5`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  )
}

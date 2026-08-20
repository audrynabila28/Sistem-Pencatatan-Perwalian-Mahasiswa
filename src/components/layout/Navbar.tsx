'use client'

import { Bell, User } from 'lucide-react'

interface NavbarProps {
  userIdentifier?: string
  userName?: string
  role?: string
}

export function Navbar({ userIdentifier, userName, role }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex-1 px-4 flex justify-between h-16">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
            Sistem Pencatatan Perwalian
          </h1>
        </div>
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">{userName || 'Loading...'}</p>
            <p className="text-xs text-gray-500 capitalize">{role || ''} • {userIdentifier}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  )
}

import { type ReactNode } from 'react'

export const metadata = {
  title: 'Login - Sistem Perwalian STMIK Bandung',
  description: 'Login ke Sistem Pencatatan Perwalian Mahasiswa STMIK Bandung',
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

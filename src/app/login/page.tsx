'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogIn, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Gunakan fake email domain untuk Supabase Auth agar bisa pakai Username murni
      const authEmail = `${username}@stmik.edu`

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      })

      if (authError) {
        // Translate error agar user tidak bingung dengan konsep email di belakang layar
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Username atau Password salah')
        }
        throw authError
      }

      if (data.user) {
        // Fetch role & status password
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, is_default_password')
          .eq('id', data.user.id)
          .maybeSingle()

        if (profileError) throw profileError
        if (!profile) throw new Error('Profil pengguna tidak ditemukan. Harap lapor ke Admin.')

        if (profile.is_default_password) {
          router.push('/ganti-password')
        } else {
          if (profile.role === 'admin') router.push('/admin')
          else if (profile.role === 'mahasiswa') router.push('/mahasiswa')
          else if (profile.role === 'dosen') router.push('/dosen')
          else router.push('/')
        }
        
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <div className="mx-auto h-16 w-32 relative">
            <Image
                src="/logo-stmik.png"
                alt="Logo STMIK Bandung"
                fill
                sizes="128px"
                className="object-contain"
                priority
                />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login Sistem Perwalian
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            STMIK Bandung
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username (NIM / NIP / ID)"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-slate-500 group-hover:text-slate-400" aria-hidden="true" />
              </span>
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use server'

import { createClient } from '@supabase/supabase-js'

export async function addMahasiswa(formData: FormData) {
  const nama = formData.get('nama') as string
  const nim = formData.get('nim') as string
  const prodi = formData.get('prodi') as string

  if (!nama || !nim || !prodi) {
    return { error: 'Semua kolom wajib diisi' }
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  const username = nim
  const authEmail = `${nim}@stmik.edu` // Fake email for Supabase Auth
  const password = `stmik@${nim}`

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: authEmail,
      password: password,
      email_confirm: true,
    })

    if (authError) {
      if (authError.message.includes('already exists')) {
        return { error: 'NIM tersebut sudah terdaftar' }
      }
      return { error: `Gagal membuat akun: ${authError.message}` }
    }

    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: username,
          role: 'mahasiswa',
          nama: nama,
          nim_nip: nim,
          prodi: prodi,
          is_default_password: true,
        })

      if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return { error: `Gagal membuat profil: ${profileError.message}` }
      }

      return { 
        success: true, 
        credentials: { 
          nama, 
          username, 
          password 
        } 
      }
    }
    
    return { error: 'Terjadi kesalahan sistem.' }
  } catch (err: any) {
    return { error: err.message || 'Terjadi kesalahan internal server' }
  }
}

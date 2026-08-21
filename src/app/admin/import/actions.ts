'use server'

import { createClient } from '@supabase/supabase-js'

type ImportData = {
  nama: string
  nim_nip: string
  prodi: string
}

export async function processImportCSV(data: ImportData[], role: 'mahasiswa' | 'dosen') {
  if (!data || data.length === 0) {
    return { success: false, message: 'Tidak ada data untuk diproses.' }
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

  let successCount = 0
  let failedCount = 0
  const errors: string[] = []

  // Maksimal batch size untuk mencegah timeout, kita proses secara berurutan
  for (const item of data) {
    const { nama, nim_nip, prodi } = item

    if (!nama || !nim_nip || !prodi) {
      failedCount++
      errors.push(`Baris dengan NIM/NIP ${nim_nip || 'kosong'} ditolak karena data tidak lengkap.`)
      continue
    }

    const username = nim_nip.trim()
    const authEmail = `${username}@stmik.edu` // Fake email untuk Auth
    const password = `stmik@${username}`

    try {
      // 1. Buat User di Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: authEmail,
        password: password,
        email_confirm: true,
      })

      if (authError) {
        failedCount++
        errors.push(`NIM/NIP ${username}: ${authError.message}`)
        continue
      }

      // 2. Buat Profil di public.profiles
      if (authData.user) {
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: username,
            role: role,
            nama: nama.trim(),
            nim_nip: username,
            prodi: prodi.trim(),
            is_default_password: true,
          })

        if (profileError) {
          // Rollback auth user if profile creation fails
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
          failedCount++
          errors.push(`NIM/NIP ${username}: Gagal membuat profil (${profileError.message})`)
        } else {
          successCount++
        }
      }
    } catch (err: any) {
      failedCount++
      errors.push(`NIM/NIP ${username}: Terjadi kesalahan internal`)
    }
  }

  return {
    success: successCount > 0,
    summary: `Berhasil import ${successCount} data. Gagal ${failedCount} data.`,
    errors: errors.slice(0, 10), // Hanya kembalikan max 10 error agar payload tidak terlalu besar
  }
}

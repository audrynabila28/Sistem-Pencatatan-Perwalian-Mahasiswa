'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function deleteUserAction(userId: string) {
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

  try {
    // Menghapus user melalui Auth admin API secara otomatis akan memicu
    // cascade delete ke tabel public.profiles (jika constraint on delete cascade ada)
    // Namun untuk amannya kita hapus manual dari auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath('/admin')
    return { success: true, message: 'User berhasil dihapus.' }
  } catch (err: any) {
    return { success: false, message: 'Terjadi kesalahan sistem saat menghapus.' }
  }
}

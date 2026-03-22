'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — ignore
          }
        },
      },
    }
  )
}

export async function updateAlertStatusAction(
  alertId: string,
  status: 'new' | 'in_progress' | 'resolved'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Using Record<string, string | null> allows any string key but we type the input `status` tightly up top
    const updateData: Record<string, string | null> = { status }
    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString()
    } else {
      updateData.resolved_at = null
    }
    
    const { error } = await supabase
      .from('alerts')
      .update(updateData)
      .eq('id', alertId)
    
    if (error) {
      console.error('Supabase update error:', error)
      return { success: false, error: error.message }
    }
    
    revalidatePath('/[locale]/(dashboard)/alerts', 'page')
    revalidatePath('/[locale]/(dashboard)/dashboard', 'page')
    
    return { success: true }
  } catch (err) {
    console.error('Server action error:', err)
    return { success: false, error: 'Unexpected error' }
  }
}

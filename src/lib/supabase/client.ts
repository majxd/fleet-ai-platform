import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

export function createClient() {
  return getSupabaseBrowserClient()
}

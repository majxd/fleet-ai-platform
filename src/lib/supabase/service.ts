import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Note: This client uses the service role key and MUST NOT be used in client components
// or exposed to the browser. It bypasses RLS and should only be used in secure server environments
// like Server Actions or Route Handlers for administrative tasks (like creating initial user profiles).
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

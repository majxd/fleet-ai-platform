const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data } = await supabase.from('dtc_correlations').select('*').limit(1);
  console.log("pattern.code_pattern type:", typeof data[0].code_pattern);
  console.log("pattern.code_pattern value:", data[0].code_pattern);
}
test();

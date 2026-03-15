import { createClient } from '@/lib/supabase/server';

export async function getActiveDTCCodes(vehicleId: string) {
  const supabase = await createClient();

  // First get the active DTC codes from the latest OBD reading
  const { data: latestReading, error: obdError } = await supabase
    .from('obd_readings')
    .select('dtc_codes')
    .eq('vehicle_id', vehicleId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();

  const reading = latestReading as { dtc_codes: string[] | null } | null;

  if (obdError || !reading || !reading.dtc_codes || reading.dtc_codes.length === 0) {
    return [];
  }

  // Then fetch the details from dtc_library
  const { data: dtcDetails, error: dtcError } = await supabase
    .from('dtc_library')
    .select('*')
    .in('code', reading.dtc_codes);

  if (dtcError) {
    console.error('Error fetching DTC library details:', dtcError);
    return [];
  }

  return dtcDetails as import('@/types/database').DTCCode[];
}

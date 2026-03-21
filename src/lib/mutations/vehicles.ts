import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type AddVehicleInput = Omit<
  Database['public']['Tables']['vehicles']['Insert'],
  'id' | 'company_id' | 'health_score' | 'status' | 'created_at' | 'updated_at' | 'last_obd_reading_at'
>;

export type UpdateVehicleInput = Partial<AddVehicleInput> & { 
  status?: Database['public']['Tables']['vehicles']['Row']['status'] 
};

export async function addVehicle(data: AddVehicleInput, companyId: string) {
  console.log('addVehicle starting...', { companyId, data });
  const supabase = createClient();
  
  console.log('Getting user...');
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error('Auth error:', userError);
    throw new Error('Not authenticated');
  }

  if (!companyId) {
    throw new Error('Company ID is required');
  }

  console.log('Inserting into Supabase...');
  const { data: newVehicle, error } = await supabase
    .from('vehicles')
    // @ts-ignore - Bypass strict never inference from Supabase generic Table type
    .insert({
      ...data,
      company_id: companyId,
      health_score: 100,
      status: 'active',
    } as any)
    .select()
    .single();

  console.log('Insert response:', { newVehicle, error });

  if (error) {
    console.error('Error adding vehicle:', error);
    throw new Error(error.message || 'Failed to add vehicle');
  }

  return newVehicle;
}

export async function updateVehicle(id: string, data: UpdateVehicleInput) {
  const supabase = createClient();

  const safeData = { ...data };
  // @ts-ignore - Ensure protected fields are never updated
  delete safeData.id;
  // @ts-ignore
  delete safeData.company_id;
  // @ts-ignore
  delete safeData.health_score;

  const { data: updatedVehicle, error } = await supabase
    .from('vehicles')
    // @ts-ignore - Bypass strict never inference from Supabase generic Table type
    .update(safeData as any)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }

  return updatedVehicle;
}

export async function deleteVehicle(id: string) {
  const supabase = createClient();

  // Due to possible missing ON CASCADE DELETE constraints, we manually delete related records
  await supabase.from('obd_readings').delete().eq('vehicle_id', id);
  await supabase.from('maintenance_logs').delete().eq('vehicle_id', id);
  await supabase.from('alerts').delete().eq('vehicle_id', id);

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }

  return true;
}

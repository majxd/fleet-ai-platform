"use server";

import { createAdminClient } from "@/lib/supabase/service";
import { AuthUser } from "@/types/auth";
import type { Database } from "@/types/database";

type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
type UserInsert = Database['public']['Tables']['users']['Insert'];

export async function createCompanyAndUser(
  authUser: any,
  companyName: string,
  managerName: string,
  fleetSize: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const supabaseAdmin = createAdminClient();

    // 1. Create company
    const newCompany: CompanyInsert = {
      name: companyName,
    };
    const { data: company, error: companyError } = await (supabaseAdmin.from("companies") as any)
      .insert(newCompany)
      .select()
      .single();

    if (companyError || !company) {
      console.error("Error creating company:", companyError);
      return { success: false, error: "Failed to create company" };
    }

    // 2. Create user linking auth.users.id to company_id
    const newUser: UserInsert = {
      id: authUser.id,
      company_id: company.id,
      email: authUser.email!,
      full_name: managerName,
      role: "owner",
    };
    const { data: user, error: userError } = await (supabaseAdmin.from("users") as any)
      .insert(newUser)
      .select()
      .single();

    if (userError || !user) {
      console.error("Error creating user record:", userError);
      // Rollback company creation (optional but recommended for consistency)
      await supabaseAdmin.from("companies").delete().eq("id", company.id);
      return { success: false, error: "Failed to create user profile" };
    }

    return { success: true, user: user as AuthUser };
  } catch (err: any) {
    console.error("Server action error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch initial profile and company for SSR
  let profile = null;
  let company = null;

  const { data: profileData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileData) {
    profile = profileData;
    const { data: companyData } = await (supabase
      .from("companies")
      .select("*")
      .eq("id", (profileData as any).company_id)
      .single() as any);
    if (companyData) {
      company = companyData;
    }
  }

  // Fetch unread alerts count
  let unreadAlertsCount = 0;
  if (company) {
    const { count } = await supabase
      .from("alerts")
      .select("*", { count: "exact", head: true })
      .eq("company_id", (company as any).id)
      .eq("status", "new");
    unreadAlertsCount = count || 0;
  }
  return (
    <AuthProvider initialUser={user} initialProfile={profile} initialCompany={company}>
      <div className="flex h-screen bg-[#F8FAFC]">
        {/* Sidebar — appears on right side in RTL */}
        <Sidebar unreadAlertsCount={unreadAlertsCount} />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar unreadAlertsCount={unreadAlertsCount} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

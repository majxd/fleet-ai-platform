"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { useRouter } from "next/navigation";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];
type Company = Database["public"]["Tables"]["companies"]["Row"];

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  company: Company | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  company: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({
  children,
  initialUser,
  initialProfile,
  initialCompany,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialProfile?: UserProfile | null;
  initialCompany?: Company | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile ?? null);
  const [company, setCompany] = useState<Company | null>(initialCompany ?? null);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Determine if we need to fetch initial state
    const fetchSession = async () => {
      if (initialUser) return; // Already passed from server
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await hydrateProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await hydrateProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setCompany(null);
          setIsLoading(false);
          router.refresh(); // Refresh to trigger middleware redirects if needed
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const hydrateProfile = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileData) {
        setProfile(profileData as UserProfile);
        const { data: companyData } = await (supabase
          .from("companies")
          .select("*")
          .eq("id", (profileData as any).company_id)
          .single() as any);
        
        if (companyData) {
          setCompany(companyData as Company);
        }
      }
    } catch (err) {
      console.error("Error hydrating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    // Router refresh happens in onAuthStateChange
  };

  return (
    <AuthContext.Provider value={{ user, profile, company, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

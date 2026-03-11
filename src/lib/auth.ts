/**
 * Authentication functions — structured for Supabase integration.
 * Currently uses mock behavior (redirects to dashboard on success).
 * Replace mock implementations with real Supabase calls once credentials are configured.
 */

import type { LoginFormData, RegisterFormData, AuthResponse, AuthUser } from "@/types/auth";

/**
 * Sign in with email and password.
 * Mock: always succeeds after a short delay.
 */
export async function signInWithEmail(data: LoginFormData): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TODO: Replace with real Supabase auth
  // const { data: authData, error } = await supabase.auth.signInWithPassword({
  //   email: data.email,
  //   password: data.password,
  // });

  // Mock success
  const mockUser: AuthUser = {
    id: "user-001",
    email: data.email,
    full_name: "مدير الأسطول",
    company_id: "company-001",
    role: "owner",
    avatar_url: null,
    created_at: new Date().toISOString(),
  };

  return { success: true, user: mockUser };
}

/**
 * Sign up with email and registration data.
 * Mock: always succeeds after a short delay.
 */
export async function signUpWithEmail(data: RegisterFormData): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // TODO: Replace with real Supabase auth
  // const { data: authData, error } = await supabase.auth.signUp({
  //   email: data.email,
  //   password: data.password,
  //   options: {
  //     data: {
  //       full_name: data.managerName,
  //       company_name: data.companyName,
  //       fleet_size: data.fleetSize,
  //     },
  //   },
  // });

  const mockUser: AuthUser = {
    id: "user-002",
    email: data.email,
    full_name: data.managerName,
    company_id: "company-002",
    role: "owner",
    avatar_url: null,
    created_at: new Date().toISOString(),
  };

  return { success: true, user: mockUser };
}

/**
 * Sign in with Google OAuth.
 * Mock: logs intent (real implementation redirects to Google).
 */
export async function signInWithGoogle(): Promise<void> {
  // TODO: Replace with real Supabase OAuth
  // const { error } = await supabase.auth.signInWithOAuth({
  //   provider: "google",
  //   options: { redirectTo: `${window.location.origin}/auth/callback` },
  // });

  // Mock: simulate redirect delay
  await new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  // TODO: Replace with real Supabase signOut
  // await supabase.auth.signOut();
  await new Promise((resolve) => setTimeout(resolve, 300));
}

/**
 * Get the currently authenticated user.
 * Mock: returns null (no session).
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // TODO: Replace with real Supabase session check
  // const { data: { user } } = await supabase.auth.getUser();
  return null;
}

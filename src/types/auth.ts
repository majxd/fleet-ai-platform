export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  companyName: string;
  managerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fleetSize: string;
  agreeToTerms: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  company_id: string;
  role: "owner" | "manager" | "technician" | "viewer";
  avatar_url: string | null;
  created_at: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: AuthError;
}

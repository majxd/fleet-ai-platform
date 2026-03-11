interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F0F4F8] to-[#E2E8F0] p-4">
      {/* Subtle branding in corner */}
      <div className="absolute top-6 start-6 flex items-center gap-2 opacity-60">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2471A3] text-white text-xs font-bold">
          FA
        </div>
        <span className="text-sm font-bold text-[#2471A3]">FleetAI</span>
      </div>

      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

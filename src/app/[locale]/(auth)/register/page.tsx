"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { signUpWithEmail } from "@/lib/auth";
import type { RegisterFormData } from "@/types/auth";

interface FormErrors {
  companyName?: string;
  managerName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  fleetSize?: string;
  agreeToTerms?: string;
}

export default function RegisterPage() {
  const t = useTranslations("auth");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [formData, setFormData] = useState<RegisterFormData>({
    companyName: "",
    managerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    fleetSize: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [globalError, setGlobalError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGlobalError("");
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = t("register.errors.companyRequired");
    }
    if (!formData.managerName.trim()) {
      newErrors.managerName = t("register.errors.nameRequired");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("register.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("register.errors.emailInvalid");
    }
    if (!formData.password) {
      newErrors.password = t("register.errors.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("register.errors.passwordMin");
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("register.errors.confirmRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("register.errors.passwordMismatch");
    }
    if (!formData.fleetSize) {
      newErrors.fleetSize = t("register.errors.fleetSizeRequired");
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t("register.errors.termsRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await signUpWithEmail(formData);
      if (result.success) {
        router.push(`/${locale}/dashboard`);
      } else {
        setGlobalError(result.error?.message ?? t("register.errors.generic"));
      }
    } catch {
      setGlobalError(t("register.errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const fleetSizeOptions = [
    { value: "1-10", label: t("register.fleetSizes.small") },
    { value: "11-50", label: t("register.fleetSizes.medium") },
    { value: "51-100", label: t("register.fleetSizes.large") },
    { value: "100+", label: t("register.fleetSizes.enterprise") },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl shadow-black/5">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2471A3] text-white font-bold text-lg">
          FA
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("register.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("register.subtitle")}
        </p>
      </div>

      {/* Global error */}
      {globalError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {globalError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">{t("register.companyName")}</Label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            placeholder={t("register.companyPlaceholder")}
            value={formData.companyName}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`h-11 focus-visible:ring-[#2471A3] ${errors.companyName ? "border-red-400" : ""}`}
          />
          {errors.companyName && (
            <p className="text-xs text-red-500">{errors.companyName}</p>
          )}
        </div>

        {/* Manager name */}
        <div className="space-y-2">
          <Label htmlFor="managerName">{t("register.managerName")}</Label>
          <Input
            id="managerName"
            name="managerName"
            type="text"
            placeholder={t("register.managerPlaceholder")}
            value={formData.managerName}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`h-11 focus-visible:ring-[#2471A3] ${errors.managerName ? "border-red-400" : ""}`}
          />
          {errors.managerName && (
            <p className="text-xs text-red-500">{errors.managerName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="reg-email">{t("register.email")}</Label>
          <Input
            id="reg-email"
            name="email"
            type="email"
            placeholder={t("register.emailPlaceholder")}
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`h-11 focus-visible:ring-[#2471A3] ${errors.email ? "border-red-400" : ""}`}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="reg-password">{t("register.password")}</Label>
          <div className="relative">
            <Input
              id="reg-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("register.passwordPlaceholder")}
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`h-11 pe-10 focus-visible:ring-[#2471A3] ${errors.password ? "border-red-400" : ""}`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("register.confirmPlaceholder")}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`h-11 pe-10 focus-visible:ring-[#2471A3] ${errors.confirmPassword ? "border-red-400" : ""}`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Fleet size */}
        <div className="space-y-2">
          <Label htmlFor="fleetSize">{t("register.fleetSize")}</Label>
          <Select
            value={formData.fleetSize}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, fleetSize: value }));
              setErrors((prev) => ({ ...prev, fleetSize: undefined }));
            }}
            disabled={isLoading}
          >
            <SelectTrigger
              id="fleetSize"
              className={`h-11 focus:ring-[#2471A3] ${errors.fleetSize ? "border-red-400" : ""}`}
            >
              <SelectValue placeholder={t("register.fleetSizePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {fleetSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fleetSize && (
            <p className="text-xs text-red-500">{errors.fleetSize}</p>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({ ...prev, agreeToTerms: checked === true }));
                setErrors((prev) => ({ ...prev, agreeToTerms: undefined }));
              }}
              disabled={isLoading}
              className="mt-0.5 data-[state=checked]:bg-[#2471A3] data-[state=checked]:border-[#2471A3]"
            />
            <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed cursor-pointer">
              {t("register.agreeToTerms")}
            </Label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-red-500">{errors.agreeToTerms}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full bg-[#2471A3] text-white hover:bg-[#1a5276] font-semibold"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {t("register.submit")}
        </Button>
      </form>

      {/* Login link */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {t("register.hasAccount")}{" "}
        <Link
          href={`/${locale}/login`}
          className="font-semibold text-[#2471A3] hover:underline"
        >
          {t("register.loginLink")}
        </Link>
      </div>
    </div>
  );
}

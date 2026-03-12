"use client";

import { useState, use } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Bell, CreditCard, Save, Crown, Car } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("settings");
  const isRtl = locale === "ar";
  
  // Mock form state
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const mockSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    window.alert(isRtl ? "تم حفظ التغييرات بنجاح" : "Changes saved successfully");
    setIsSaving(false);
  };

  const mockSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    await new Promise(r => setTimeout(r, 800));
    window.alert(isRtl ? "تم حفظ التفضيلات" : "Preferences saved successfully");
    setIsSavingPrefs(false);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Company Settings */}
        <Card>
          <form onSubmit={mockSaveCompany}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#2471A3]" />
                <CardTitle>{t("company.title")}</CardTitle>
              </div>
              <CardDescription>{t("company.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">{t("company.name")}</Label>
                  <Input 
                    id="companyName" 
                    defaultValue={isRtl ? "شركة الأسطول الذكي" : "Smart Fleet Company"} 
                    placeholder={t("company.namePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">{t("company.email")}</Label>
                  <Input 
                    id="companyEmail" 
                    type="email" 
                    defaultValue="admin@smartfleet.com" 
                    dir="ltr"
                    className={cn(isRtl && "text-right")}
                    placeholder={t("company.emailPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">{t("company.phone")}</Label>
                  <Input 
                    id="companyPhone" 
                    type="tel" 
                    defaultValue="+966 50 123 4567" 
                    dir="ltr"
                    className={cn(isRtl && "text-right")}
                    placeholder={t("company.phonePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCity">{t("company.city")}</Label>
                  <Select defaultValue="riyadh">
                    <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                      <SelectValue placeholder={t("company.city")} />
                    </SelectTrigger>
                    <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                      <SelectItem value="riyadh">{t("company.cityOptions.riyadh")}</SelectItem>
                      <SelectItem value="jeddah">{t("company.cityOptions.jeddah")}</SelectItem>
                      <SelectItem value="dammam">{t("company.cityOptions.dammam")}</SelectItem>
                      <SelectItem value="makkah">{t("company.cityOptions.makkah")}</SelectItem>
                      <SelectItem value="madinah">{t("company.cityOptions.madinah")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">{t("company.size")}</Label>
                  <Select defaultValue="small">
                    <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                      <SelectValue placeholder={t("company.size")} />
                    </SelectTrigger>
                    <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                      <SelectItem value="micro">{t("company.sizeOptions.micro")}</SelectItem>
                      <SelectItem value="small">{t("company.sizeOptions.small")}</SelectItem>
                      <SelectItem value="medium">{t("company.sizeOptions.medium")}</SelectItem>
                      <SelectItem value="large">{t("company.sizeOptions.large")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className={cn("border-t p-6", isRtl ? "justify-end" : "justify-start")}>
              <Button type="submit" disabled={isSaving} className="bg-[#2471A3] hover:bg-[#1a5276]">
                <Save className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                {t("saveChanges")}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Notifications */}
        <Card>
          <form onSubmit={mockSavePreferences}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#2471A3]" />
                <CardTitle>{t("notifications.title")}</CardTitle>
              </div>
              <CardDescription>{t("notifications.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2 border border-border rounded-lg p-4">
                  <div className={cn("flex flex-col space-y-1", isRtl ? "ml-4" : "mr-4")}>
                    <Label className="text-base">{t("notifications.email.label")}</Label>
                    <span className="text-sm text-muted-foreground">{t("notifications.email.description")}</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2 border border-border rounded-lg p-4">
                  <div className={cn("flex flex-col space-y-1", isRtl ? "ml-4" : "mr-4")}>
                    <Label className="text-base">{t("notifications.whatsapp.label")}</Label>
                    <span className="text-sm text-muted-foreground">{t("notifications.whatsapp.description")}</span>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2 border border-border rounded-lg p-4">
                  <div className={cn("flex flex-col space-y-1", isRtl ? "ml-4" : "mr-4")}>
                    <Label className="text-base">{t("notifications.sms.label")}</Label>
                    <span className="text-sm text-muted-foreground">{t("notifications.sms.description")}</span>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="threshold">{t("notifications.threshold.label")}</Label>
                <div className="text-sm text-muted-foreground mb-3">{t("notifications.threshold.description")}</div>
                <Input 
                  id="threshold" 
                  type="number" 
                  defaultValue={40} 
                  min={1} 
                  max={100}
                  className="max-w-[120px]"
                  dir="ltr"
                />
              </div>
            </CardContent>
            <CardFooter className={cn("border-t p-6", isRtl ? "justify-end" : "justify-start")}>
              <Button type="submit" variant="secondary" disabled={isSavingPrefs}>
                <Save className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                {t("savePreferences")}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Subscription (Read Only) */}
        <Card className="border-[#2471A3]/20 bg-gradient-to-br from-white to-[#2471A3]/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#2471A3]" />
                <CardTitle>{t("subscription.title")}</CardTitle>
              </div>
              <Badge className="bg-[#2471A3] hover:bg-[#2471A3]">{t("subscription.starter")}</Badge>
            </div>
            <CardDescription>{t("subscription.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("subscription.price")}</p>
                <p className="text-lg font-bold" dir="ltr">{t("subscription.priceValue")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("subscription.activeVehicles")}</p>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-[#2471A3]" />
                  <p className="text-lg font-bold">{t("subscription.vehiclesCount")}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("subscription.nextBilling")}</p>
                <p className="text-lg font-bold" dir="ltr">{t("subscription.billingDate")}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className={cn("border-t border-[#2471A3]/10 p-6", isRtl ? "justify-end" : "justify-start")}>
            <Button disabled variant="outline" className="opacity-50 cursor-not-allowed">
              <Crown className={cn("h-4 w-4 text-yellow-500", isRtl ? "ml-2" : "mr-2")} />
              {t("subscription.upgradePlan")}
            </Button>
            <p className={cn("text-xs text-muted-foreground", isRtl ? "mr-3" : "ml-3")}>
              {t("subscription.comingSoon")}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

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
import { 
  Building2, 
  Bell, 
  CreditCard, 
  Save, 
  Crown, 
  Car, 
  Users, 
  UserPlus, 
  MoreHorizontal,
  Mail,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("settings");
  const isRtl = locale === "ar";
  
  // Mock form state
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Mock team members data
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "Mohammed", email: "mohammed@smartfleet.com", role: "owner", status: "active" },
    { id: 2, name: "Khaled", email: "khaled@smartfleet.com", role: "manager", status: "active" },
    { id: 3, name: "Ahmed", email: "ahmed@smartfleet.com", role: "technician", status: "active" },
    { id: 4, name: "Sara", email: "sara@smartfleet.com", role: "viewer", status: "active" },
    { id: 5, name: "Omar", email: "omar@smartfleet.com", role: "technician", status: "invited" },
  ]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner": return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">{t(`team.roles.owner`)}</Badge>;
      case "manager": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">{t(`team.roles.manager`)}</Badge>;
      case "technician": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">{t(`team.roles.technician`)}</Badge>;
      case "viewer": return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">{t(`team.roles.viewer`)}</Badge>;
      default: return null;
    }
  };

  const handleRemoveMember = (id: number, role: string) => {
    if (role === "owner") {
      window.alert(isRtl ? "لا يمكن حذف المالك" : "Cannot remove owner");
      return;
    }
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

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
        {/* Team Management */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#2471A3]" />
                <CardTitle>{t("team.title")}</CardTitle>
              </div>
            </div>
            <Button 
              className="bg-[#2471A3] hover:bg-[#1a5276]"
              onClick={() => setIsAddingMember(!isAddingMember)}
            >
              <UserPlus className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
              {t("team.addMember")}
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Add Member Form (Inline) */}
            {isAddingMember && (
              <div className="bg-slate-50 border p-4 rounded-lg grid md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label>{t("team.table.name")}</Label>
                  <div className="relative">
                    <User className={cn("absolute top-3 h-4 w-4 text-muted-foreground", isRtl ? "right-3" : "left-3")} />
                    <Input className={cn(isRtl ? "pr-9" : "pl-9")} placeholder={t("team.addForm.namePlaceholder")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("team.table.email")}</Label>
                  <div className="relative">
                    <Mail className={cn("absolute top-3 h-4 w-4 text-muted-foreground", isRtl ? "right-3" : "left-3")} />
                    <Input dir="ltr" className={cn(isRtl ? "pr-9 text-right" : "pl-9")} placeholder={t("team.addForm.emailPlaceholder")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("team.table.role")}</Label>
                  <Select defaultValue="viewer">
                    <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                      <SelectValue placeholder={t("team.addForm.rolePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                      <SelectItem value="manager">{t("team.roles.manager")}</SelectItem>
                      <SelectItem value="technician">{t("team.roles.technician")}</SelectItem>
                      <SelectItem value="viewer">{t("team.roles.viewer")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="w-full bg-[#2471A3] hover:bg-[#1a5276]" onClick={() => setIsAddingMember(false)}>
                    {t("team.addForm.sendInvite")}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setIsAddingMember(false)}>
                    {t("team.addForm.cancel")}
                  </Button>
                </div>
              </div>
            )}

            {/* Team Members List */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn(isRtl && "text-right")}>{t("team.table.name")}</TableHead>
                    <TableHead className={cn(isRtl && "text-right")}>{t("team.table.email")}</TableHead>
                    <TableHead className={cn(isRtl && "text-right")}>{t("team.table.role")}</TableHead>
                    <TableHead className={cn(isRtl && "text-right")}>{t("team.table.status")}</TableHead>
                    <TableHead className={cn(isRtl && "text-right", "w-[100px]")}>{t("team.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell dir="ltr" className={cn(isRtl && "text-right")}>{member.email}</TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            member.status === "active" ? "bg-green-500" : "bg-yellow-500"
                          )} />
                          <span className="text-sm">
                            {member.status === "active" ? t("team.statuses.active") : t("team.statuses.invited")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRtl ? "start" : "end"}>
                            <DropdownMenuLabel>{t("team.table.actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled={member.role === "owner"}>
                              {t("team.actions.editRole")}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              disabled={member.role === "owner"}
                              onClick={() => handleRemoveMember(member.id, member.role)}
                            >
                              {t("team.actions.remove")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

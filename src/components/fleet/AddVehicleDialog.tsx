"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { addVehicle } from "@/lib/mutations/vehicles";

const MAKES = ["Toyota", "Hyundai", "Nissan", "Kia", "Honda", "Chevrolet", "Ford", "GMC", "Mazda", "Other"];
const YEARS = Array.from({ length: 12 }, (_, i) => (2015 + i).toString()); // 2015 to 2026

export default function AddVehicleDialog() {
  const t = useTranslations("vehicles");
  const tForm = useTranslations("vehicles.form");
  const tActions = useTranslations("vehicles.actions");
  const router = useRouter();
  const locale = useLocale();
  const { company } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    plate_number: z.string().min(1, { message: tForm("errors.plateRequired") }),
    plate_number_ar: z.string().optional(),
    make: z.string().min(1, { message: tForm("errors.makeRequired") }),
    model: z.string().min(1, { message: tForm("errors.modelRequired") }),
    year: z.string().min(1, { message: tForm("errors.yearRequired") }),
    color: z.string().optional(),
    vin: z.string().max(17, { message: tForm("errors.vinMax") }).optional(),
    obd_device_id: z.string().optional(),
    mileage: z.string().optional(),
    insurance_expiry: z.date().optional(),
    registration_expiry: z.date().optional(),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate_number: "",
      plate_number_ar: "",
      make: "",
      model: "",
      year: "",
      color: "",
      vin: "",
      obd_device_id: "",
      mileage: undefined,
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (!company?.id) throw new Error("No company found in session");
      
      const newVehicle = await addVehicle({
        ...values,
        year: parseInt(values.year),
        plate_number_ar: values.plate_number_ar || null,
        color: values.color || null,
        vin: values.vin || null,
        obd_device_id: values.obd_device_id || null,
        mileage: values.mileage ? Number(values.mileage) : null,
        insurance_expiry: values.insurance_expiry ? values.insurance_expiry.toISOString().split('T')[0] : null,
        registration_expiry: values.registration_expiry ? values.registration_expiry.toISOString().split('T')[0] : null,
        notes: values.notes || null,
      }, company.id) as { id: string };
      
      toast.success(tActions("successAdd"));
      setOpen(false);
      form.reset();
      router.push(`/${locale}/vehicles/${newVehicle.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(tActions("errorDefault"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#2471A3] hover:bg-[#1a5276] text-white">
          <Plus className="h-4 w-4" />
          {t("addVehicle")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tActions("addTitle")}</DialogTitle>
          <DialogDescription>{tActions("addSubtitle")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="plate_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tForm("plateNumber")}</FormLabel>
                    <FormControl>
                      <Input placeholder={tForm("plateNumberPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="plate_number_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tForm("plateNumberAr")}</FormLabel>
                    <FormControl>
                      <Input placeholder={tForm("plateNumberArPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tForm("make")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tForm("makePlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MAKES.map((make) => (
                          <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tForm("model")}</FormLabel>
                    <FormControl>
                      <Input placeholder={tForm("modelPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tForm("year")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tForm("yearPlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {YEARS.map((y) => (
                          <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tForm("color")}</FormLabel>
                    <FormControl>
                      <Input placeholder={tForm("colorPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tForm("vin")}</FormLabel>
                    <FormControl>
                      <Input placeholder={tForm("vinPlaceholder")} maxLength={17} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="obd_device_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tForm("obdDevice")}</FormLabel>
                    <FormControl>
                      <Input placeholder={tForm("obdDevicePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tForm("mileage")}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={tForm("mileagePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Just a spacer for grid alignment if needed, or put dates */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="insurance_expiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{tForm("insuranceExpiry")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{tForm("pickDate")}</span>
                            )}
                            <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registration_expiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{tForm("registrationExpiry")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{tForm("pickDate")}</span>
                            )}
                            <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tForm("notes")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={tForm("notesPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("cancel" /* wait, the common cancel is accessible via t("../../common") - actually I map it here from another namespace or just use common */)}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#2471A3] hover:bg-[#1a5276] text-white">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tActions("addTitle")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

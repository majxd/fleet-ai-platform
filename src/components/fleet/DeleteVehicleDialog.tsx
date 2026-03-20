"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteVehicle } from "@/lib/mutations/vehicles";
import type { Vehicle } from "@/types/database";

interface DeleteVehicleDialogProps {
  vehicle: Vehicle;
  redirectAfterDelete?: boolean;
}

export default function DeleteVehicleDialog({ vehicle, redirectAfterDelete = false }: DeleteVehicleDialogProps) {
  const tCommon = useTranslations("common");
  const tActions = useTranslations("vehicles.actions");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayPlate = vehicle.plate_number_ar || vehicle.plate_number;

  async function onDelete() {
    setIsDeleting(true);
    try {
      await deleteVehicle(vehicle.id);
      toast.success(tActions("successDelete"));
      setOpen(false);
      
      if (redirectAfterDelete) {
        // Find locale from path
        const locale = window.location.pathname.split('/')[1] || 'ar';
        router.push(`/${locale}/vehicles`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error(tActions("errorDefault"));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" aria-label={tActions("deleteTitle")}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">{tActions("deleteTitle")}</DialogTitle>
          <DialogDescription>
            {tActions("deleteWarning", { plate: displayPlate })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex-row justify-end space-x-2 space-x-reverse sm:space-x-2 sm:space-x-reverse">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            {tCommon("cancel")}
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tActions("confirmDelete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

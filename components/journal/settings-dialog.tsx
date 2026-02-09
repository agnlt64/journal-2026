"use client";

import { useState, useEffect, cloneElement, isValidElement } from "react";
import { useForm } from "react-hook-form";
import { updateSettings, getUserSettings } from "@/actions/user";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface SettingsDialogProps {
  children?: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      blurLevel: 10,
      itemsPerPage: 20,
      pinCode: "",
    },
  });

  const { register, handleSubmit, setValue } = form;

  useEffect(() => {
    if (open) {
      getUserSettings().then((s) => {
        setValue("blurLevel", s.blurLevel);
        setValue("itemsPerPage", s.itemsPerPage);
      });
    }
  }, [open, setValue]);

  interface SettingsFormData {
    blurLevel: number;
    itemsPerPage: number;
    pinCode: string;
  }

  async function onSubmit(data: SettingsFormData) {
    setLoading(true);
    try {
      await updateSettings({
        blurLevel: Number(data.blurLevel),
        itemsPerPage: Number(data.itemsPerPage),
        pinCode: data.pinCode || undefined,
      });
      setOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Render trigger - use cloneElement to add onClick instead of nesting buttons
  const triggerElement = children ? (
    isValidElement(children) ? (
      cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
        onClick: () => setOpen(true),
      })
    ) : (
      <span onClick={() => setOpen(true)}>{children}</span>
    )
  ) : (
    <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
      <Settings className="w-5 h-5" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerElement}
      <DialogContent className="max-w-lg w-[90vw] bg-[rgba(5,5,8,0.95)] border border-[rgba(0,245,255,0.2)] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,245,255,0.1)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#00f5ff] to-transparent opacity-50" />
        <DialogHeader className="pb-6 border-b border-[rgba(255,255,255,0.08)]">
          <DialogTitle className="font-(family-name:--font-display) text-2xl tracking-wider text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#00f5ff]" />
            PARAMÈTRES
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6">
          <div className="flex flex-col gap-3">
            <Label className="text-[10px] text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">
              Intensité du Flou (Défaut)
            </Label>
            <Input
              type="number"
              {...register("blurLevel", { valueAsNumber: true })}
              className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-[10px] text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">
              Éléments par Page
            </Label>
            <Input
              type="number"
              {...register("itemsPerPage", { valueAsNumber: true })}
              className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-[10px] text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">
              Code PIN Global (4 caractères)
            </Label>
            <Input
              type="text"
              maxLength={4}
              placeholder="****"
              {...register("pinCode")}
              className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white font-mono tracking-widest"
            />
            <p className="text-xs text-[rgba(255,255,255,0.4)]">
              Laissez vide pour conserver le PIN actuel.
            </p>
          </div>

          <div className="flex justify-end gap-2 border-t border-[rgba(255,255,255,0.05)] pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl h-10 px-6 bg-[rgba(0,245,255,0.15)] text-[#00f5ff] border border-[rgba(0,245,255,0.4)] hover:bg-[rgba(0,245,255,0.25)] hover:shadow-[0_0_30px_rgba(0,245,255,0.2)] transition-all duration-300 tracking-wider"
            >
              ENREGISTRER
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

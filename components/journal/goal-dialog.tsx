"use client";

import { useState, cloneElement, isValidElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalSchema, GoalFormValues } from "@/lib/types";
import { createGoal } from "@/actions/goal";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Target } from "lucide-react";

interface GoalDialogProps {
    children?: React.ReactNode;
}

export function GoalDialog({ children }: GoalDialogProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<GoalFormValues>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            title: "",
            description: "",
        }
    });

    const { register, handleSubmit, reset, setValue, watch } = form;

    async function onSubmit(data: GoalFormValues) {
        await createGoal(data);
        setOpen(false);
        reset();
    }

    // Handle date input change
    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const dateValue = e.target.value;
        if (dateValue) {
            setValue("deadline", new Date(dateValue));
        }
    }

    const deadlineValue = watch("deadline");

    // Render trigger - use cloneElement to add onClick instead of nesting buttons
    const triggerElement = children
        ? (isValidElement(children)
            ? cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, { onClick: () => setOpen(true) })
            : <span onClick={() => setOpen(true)}>{children}</span>)
        : <Button onClick={() => setOpen(true)}>
            <Target className="w-4 h-4 mr-2" /> NOUVEL OBJECTIF
        </Button>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {triggerElement}
            <DialogContent className="max-w-2xl w-[90vw] bg-[rgba(5,5,8,0.95)] border border-[rgba(255,0,110,0.2)] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(255,0,110,0.1)]">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#ff006e] to-transparent opacity-50" />
                <DialogHeader className="pb-6 border-b border-[rgba(255,255,255,0.08)]">
                    <DialogTitle className="font-(family-name:--font-display) text-2xl tracking-wider text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#ff006e]" />
                        NOUVEL OBJECTIF
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6">
                    <div className="flex flex-col gap-3">
                        <Label className="text-[10px] text-[rgba(255,0,110,0.6)] uppercase tracking-[0.2em]">Titre</Label>
                        <Input {...register("title")} placeholder="Mon objectif..." className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white placeholder:text-[rgba(255,255,255,0.3)]" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label className="text-[10px] text-[rgba(255,0,110,0.6)] uppercase tracking-[0.2em]">Description (optionnelle)</Label>
                        <Textarea {...register("description")} className="min-h-[120px] rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white placeholder:text-[rgba(255,255,255,0.3)]" placeholder="Détails de l'objectif..." />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label className="text-[10px] text-[rgba(255,0,110,0.6)] uppercase tracking-[0.2em]">Date limite</Label>
                        <Input
                            type="date"
                            onChange={handleDateChange}
                            value={deadlineValue ? deadlineValue.toISOString().split('T')[0] : ""}
                            className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white"
                        />
                    </div>
                    <div className="flex justify-end gap-2 border-t border-[rgba(255,255,255,0.05)] pt-6">
                        <Button type="submit" className="rounded-xl h-10 px-6 bg-[rgba(255,0,110,0.15)] text-[#ff006e] border border-[rgba(255,0,110,0.4)] hover:bg-[rgba(255,0,110,0.25)] hover:shadow-[0_0_30px_rgba(255,0,110,0.2)] transition-all duration-300 tracking-wider">ENREGISTRER</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

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
            <Target className="w-4 h-4 mr-2" /> Nouvel Objectif
        </Button>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {triggerElement}
            <DialogContent className="max-w-2xl w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Nouvel Objectif
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-3">
                        <Label>Titre</Label>
                        <Input {...register("title")} placeholder="Mon objectif..." />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Description (optionnelle)</Label>
                        <Textarea {...register("description")} className="min-h-[120px]" placeholder="Détails de l'objectif..." />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Date limite</Label>
                        <Input
                            type="date"
                            onChange={handleDateChange}
                            value={deadlineValue ? deadlineValue.toISOString().split('T')[0] : ""}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="submit">Enregistrer</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

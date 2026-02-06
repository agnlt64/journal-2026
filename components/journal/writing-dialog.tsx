"use client";

import { useState, cloneElement, isValidElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { writingSchema, WritingFormValues } from "@/lib/types";
import { createWriting } from "@/actions/writing";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PenTool } from "lucide-react";

interface WritingDialogProps {
    children?: React.ReactNode;
}

export function WritingDialog({ children }: WritingDialogProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<WritingFormValues>({
        resolver: zodResolver(writingSchema)
    });

    const { register, handleSubmit, reset } = form;

    async function onSubmit(data: WritingFormValues) {
        await createWriting(data);
        setOpen(false);
        reset();
    }

    // Render trigger - use cloneElement to add onClick instead of nesting buttons
    const triggerElement = children
        ? (isValidElement(children)
            ? cloneElement(children as React.ReactElement<any>, { onClick: () => setOpen(true) })
            : <span onClick={() => setOpen(true)}>{children}</span>)
        : <Button onClick={() => setOpen(true)}>
            <PenTool className="w-4 h-4 mr-2" /> NOUVELLE RÉFLEXION
        </Button>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {triggerElement}
            <DialogContent className="max-w-4xl w-[95vw] bg-[rgba(5,5,8,0.95)] border border-[rgba(184,41,221,0.2)] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(184,41,221,0.1)]">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b829dd] to-transparent opacity-50" />
                <DialogHeader className="pb-6 border-b border-[rgba(255,255,255,0.08)]">
                    <DialogTitle className="font-[family-name:var(--font-display)] text-2xl tracking-wider text-white flex items-center gap-2">
                        <PenTool className="w-5 h-5 text-[#b829dd]" />
                        NOUVELLE RÉFLEXION
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6">
                    <div className="flex flex-col gap-3">
                        <Label className="text-[10px] text-[rgba(184,41,221,0.6)] uppercase tracking-[0.2em]">Titre</Label>
                        <Input {...register("title")} placeholder="Sujet..." className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white placeholder:text-[rgba(255,255,255,0.3)]" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label className="text-[10px] text-[rgba(184,41,221,0.6)] uppercase tracking-[0.2em]">Contenu</Label>
                        <Textarea {...register("content")} className="min-h-[250px] rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white placeholder:text-[rgba(255,255,255,0.3)]" placeholder="Pensées..." />
                    </div>
                    <div className="flex justify-end gap-2 border-t border-[rgba(255,255,255,0.05)] pt-6">
                        <Button type="submit" className="rounded-xl h-10 px-6 bg-[rgba(184,41,221,0.15)] text-[#b829dd] border border-[rgba(184,41,221,0.4)] hover:bg-[rgba(184,41,221,0.25)] hover:shadow-[0_0_30px_rgba(184,41,221,0.2)] transition-all duration-300 tracking-wider">ENREGISTRER</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

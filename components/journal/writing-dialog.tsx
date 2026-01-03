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
            <PenTool className="w-4 h-4 mr-2" /> New Reflection
        </Button>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {triggerElement}
            <DialogContent className="max-w-4xl w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PenTool className="w-5 h-5" />
                        New Reflection
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-3">
                        <Label>Title</Label>
                        <Input {...register("title")} placeholder="Topic..." />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Content</Label>
                        <Textarea {...register("content")} className="min-h-[250px]" placeholder="Thoughts..." />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { useState, useEffect, cloneElement, isValidElement } from "react";
import { useForm } from "react-hook-form";
import { updateSettings, getUserSettings } from "@/actions/user";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
        }
    });

    const { register, handleSubmit, setValue } = form;

    useEffect(() => {
        if (open) {
            getUserSettings().then(s => {
                setValue("blurLevel", s.blurLevel);
                setValue("itemsPerPage", s.itemsPerPage);
            });
        }
    }, [open, setValue]);

    async function onSubmit(data: any) {
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
    const triggerElement = children
        ? (isValidElement(children)
            ? cloneElement(children as React.ReactElement<any>, { onClick: () => setOpen(true) })
            : <span onClick={() => setOpen(true)}>{children}</span>)
        : <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Settings className="w-5 h-5" />
        </Button>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {triggerElement}
            <DialogContent className="max-w-lg w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Settings
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-3">
                        <Label>Blur Intensity (Default)</Label>
                        <Input type="number" {...register("blurLevel", { valueAsNumber: true })} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Items Per Page</Label>
                        <Input type="number" {...register("itemsPerPage", { valueAsNumber: true })} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Global PIN Code (4 chars)</Label>
                        <Input
                            type="text"
                            maxLength={4}
                            placeholder="****"
                            {...register("pinCode")}
                        />
                        <p className="text-xs text-muted-foreground">Leave empty to keep current PIN.</p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={loading}>Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

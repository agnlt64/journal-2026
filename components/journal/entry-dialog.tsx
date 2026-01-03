"use client";

import { useState, useEffect, cloneElement, isValidElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entrySchema, EntryFormValues, EntryDTO, TagDTO } from "@/lib/types";
import { createEntry, updateEntry, getTags, createTag } from "@/actions/entry";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Lock, Unlock, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntryDialogProps {
    children?: React.ReactNode;
    entryToEdit?: EntryDTO;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function EntryDialog({ children, entryToEdit, open, onOpenChange }: EntryDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [availableTags, setAvailableTags] = useState<TagDTO[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#6366f1");

    const show = open ?? isOpen;
    const setShow = onOpenChange ?? setIsOpen;

    const form = useForm({
        resolver: zodResolver(entrySchema),
        defaultValues: (entryToEdit ? {
            ...entryToEdit,
            content: entryToEdit.content ?? "",
            date: new Date(entryToEdit.date),
            tagIds: entryToEdit.tags?.map(t => t.id) || [],
            wakeTime: entryToEdit.wakeTime ? new Date(entryToEdit.wakeTime) : undefined,
            sleepTime: entryToEdit.sleepTime ? new Date(entryToEdit.sleepTime) : undefined,
        } : {
            content: "",
            date: new Date(),
            tagIds: [],
            didSport: false,
            asmr: false,
            isLocked: false,
        }) as any,
    });

    const { register, handleSubmit, setValue, watch, reset } = form;
    const date = watch("date");
    const isLocked = watch("isLocked");

    // Load tags on open
    useEffect(() => {
        if (show) {
            getTags().then(tags => {
                setAvailableTags(tags);
                if (entryToEdit) {
                    setSelectedTagIds(entryToEdit.tags?.map(t => t.id) || []);
                } else {
                    setSelectedTagIds([]);
                }
            });
        }
    }, [show, entryToEdit]);

    // Update form when selected tags change
    useEffect(() => {
        setValue("tagIds", selectedTagIds);
    }, [selectedTagIds, setValue]);

    async function onSubmit(data: EntryFormValues) {
        try {
            if (entryToEdit) {
                await updateEntry(entryToEdit.id, { ...data, tagIds: selectedTagIds });
            } else {
                await createEntry({ ...data, tagIds: selectedTagIds });
            }
            setShow(false);
            reset();
            setSelectedTagIds([]);
        } catch (e) {
            console.error(e);
            alert("Error saving entry. Check if you have a PIN set if locking.");
        }
    }

    async function handleCreateTag() {
        if (!newTagName.trim()) return;
        try {
            const newTag = await createTag(newTagName.trim(), newTagColor);
            setAvailableTags(prev => [...prev, newTag]);
            setSelectedTagIds(prev => [...prev, newTag.id]);
            setNewTagName("");
        } catch (e) {
            console.error(e);
        }
    }

    function toggleTag(tagId: string) {
        setSelectedTagIds(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    }

    // Render trigger
    const triggerElement = isValidElement(children)
        ? cloneElement(children as React.ReactElement<any>, { onClick: () => setShow(true) })
        : children;

    return (
        <Dialog open={show} onOpenChange={setShow}>
            {triggerElement}
            <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {entryToEdit ? "Edit Entry" : "New Entry"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Tags */}
                    <div className="flex flex-col gap-3">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map(tag => (
                                <Badge
                                    key={tag.id}
                                    variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                                    className="cursor-pointer transition-all"
                                    style={{
                                        backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : 'transparent',
                                        borderColor: tag.color,
                                        color: selectedTagIds.includes(tag.id) ? 'white' : tag.color,
                                    }}
                                    onClick={() => toggleTag(tag.id)}
                                >
                                    {tag.name}
                                    {selectedTagIds.includes(tag.id) && <X className="w-3 h-3 ml-1" />}
                                </Badge>
                            ))}
                        </div>

                        {/* Add new tag */}
                        <div className="flex gap-2 items-center">
                            <Input
                                placeholder="New tag..."
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                className="w-32"
                            />
                            <Input
                                type="color"
                                value={newTagColor}
                                onChange={(e) => setNewTagColor(e.target.value)}
                                className="w-12 h-9 p-1 border-none"
                            />
                            <Button type="button" size="sm" variant="outline" onClick={handleCreateTag}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="flex flex-col gap-3">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger render={
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            } />
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => d && setValue("date", d)}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-3">
                        <Label>Content (optional)</Label>
                        <Textarea
                            {...register("content")}
                            className="min-h-[200px]"
                            placeholder="Write your thoughts..."
                        />
                    </div>

                    {/* Optional Fields */}
                    <div className="grid grid-cols-2 gap-6 border-t pt-6">
                        <div className="flex flex-col gap-3">
                            <Label>Wake Time</Label>
                            <Input
                                type="time"
                                onChange={(e) => {
                                    const [h, m] = e.target.value.split(':');
                                    const d = new Date();
                                    d.setHours(Number(h));
                                    d.setMinutes(Number(m));
                                    setValue("wakeTime", d);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Sleep Time</Label>
                            <Input
                                type="time"
                                onChange={(e) => {
                                    const [h, m] = e.target.value.split(':');
                                    const d = new Date();
                                    d.setHours(Number(h));
                                    d.setMinutes(Number(m));
                                    setValue("sleepTime", d);
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="sport"
                                checked={watch("didSport")}
                                onCheckedChange={(c) => setValue("didSport", c as boolean)}
                            />
                            <Label htmlFor="sport">Did Sport?</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="asmr"
                                checked={watch("asmr")}
                                onCheckedChange={(c) => setValue("asmr", c as boolean)}
                            />
                            <Label htmlFor="asmr">ASMR?</Label>
                        </div>

                        {/* Image Placeholder */}
                        <div className="col-span-2 flex flex-col gap-3">
                            <Label>Images (TODO)</Label>
                            <Input placeholder="Image URL (mock)" disabled />
                        </div>
                    </div>

                    {/* Lock Logic */}
                    <div className="flex items-center justify-between border-t pt-6">
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant={isLocked ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => setValue("isLocked", !isLocked)}
                            >
                                {isLocked ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                {isLocked ? "Locked" : "Open"}
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {isLocked ? "Requires PIN to view." : "Visible to all."}
                            </span>
                        </div>

                        <Button type="submit">Save</Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}

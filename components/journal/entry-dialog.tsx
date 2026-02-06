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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Lock, Unlock, Plus, PenTool, Clock, Activity, Zap } from "lucide-react";
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
    const [newTagColor, setNewTagColor] = useState("#00f5ff");

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
            screenTime: entryToEdit.screenTime ?? undefined,
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
    const wakeTime = watch("wakeTime");
    const sleepTime = watch("sleepTime");
    const screenTime = watch("screenTime");

    const isMonday = date ? new Date(date).getDay() === 1 : false;

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
            alert("Error saving. Make sure you have a PIN set if you're locking the entry.");
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

    const triggerElement = isValidElement(children)
        ? cloneElement(children as React.ReactElement<any>, { onClick: () => setShow(true) })
        : <Button onClick={() => setIsOpen(true)}>
            <PenTool className="w-4 h-4 mr-2" /> New Entry
        </Button>;

    return (
        <Dialog open={show} onOpenChange={setShow}>
            {triggerElement}
            <DialogContent className={cn(
                "max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto",
                "bg-[rgba(5,5,8,0.95)] border border-[rgba(0,245,255,0.2)]",
                "rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,245,255,0.1)]"
            )}>
                {/* Top glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent opacity-50" />
                
                <DialogHeader className="pb-6 border-b border-[rgba(255,255,255,0.08)]">
                    <DialogTitle className={cn(
                        "font-[family-name:var(--font-display)] text-2xl tracking-wider",
                        "text-white"
                    )}>
                        {entryToEdit ? "EDIT ENTRY" : "NEW ENTRY"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6">
                    {/* Tags Section */}
                    <div className="space-y-3">
                        <Label className="text-[10px] text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">Categories</Label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.id)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider transition-all duration-300 border",
                                        selectedTagIds.includes(tag.id)
                                            ? "border-transparent text-white"
                                            : "border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)] hover:border-[rgba(255,255,255,0.2)] hover:text-white"
                                    )}
                                    style={{
                                        backgroundColor: selectedTagIds.includes(tag.id) ? `${tag.color}30` : "transparent",
                                        borderColor: selectedTagIds.includes(tag.id) ? `${tag.color}60` : undefined,
                                        boxShadow: selectedTagIds.includes(tag.id) ? `0 0 15px ${tag.color}30` : undefined,
                                    }}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>

                        {/* Add new tag */}
                        <div className="flex gap-2 items-center pt-2">
                            <Input
                                placeholder="New category..."
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                className={cn(
                                    "w-40 rounded-xl h-9",
                                    "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                                    "text-white placeholder:text-[rgba(255,255,255,0.3)] text-sm"
                                )}
                            />
                            <Input
                                type="color"
                                value={newTagColor}
                                onChange={(e) => setNewTagColor(e.target.value)}
                                className={cn(
                                    "w-10 h-9 p-1 rounded-xl",
                                    "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]"
                                )}
                            />
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleCreateTag}
                                className={cn(
                                    "h-9 rounded-xl",
                                    "bg-[rgba(0,245,255,0.15)] text-[#00f5ff] border border-[rgba(0,245,255,0.3)]",
                                    "hover:bg-[rgba(0,245,255,0.25)]"
                                )}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-3">
                        <Label className="text-[10px] text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">Date</Label>
                        <Popover>
                            <PopoverTrigger render={
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal rounded-xl h-11",
                                        "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                                        "text-white hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(0,245,255,0.3)]",
                                        !date && "text-[rgba(255,255,255,0.3)]"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-[#00f5ff]" />
                                    {date ? format(date, "PPP") : <span>Choose a date</span>}
                                </Button>
                            } />
                            <PopoverContent className="w-auto p-0 bg-[rgba(10,10,18,0.95)] border border-[rgba(0,245,255,0.2)] rounded-xl">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => d && setValue("date", d)}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <Label className="text-[10px] text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">Content</Label>
                        <Textarea
                            {...register("content")}
                            className={cn(
                                "min-h-[180px] rounded-xl",
                                "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                                "text-white placeholder:text-[rgba(255,255,255,0.3)]",
                                "focus:border-[rgba(0,245,255,0.3)] focus:shadow-[0_0_20px_rgba(0,245,255,0.1)]",
                                "leading-relaxed"
                            )}
                            placeholder="Write your thoughts here..."
                        />
                    </div>

                    {/* Optional Fields Grid */}
                    <div className="grid grid-cols-2 gap-4 border-t border-[rgba(255,255,255,0.05)] pt-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider flex items-center gap-2">
                                <Clock className="w-3 h-3 text-[#ffbe0b]" />
                                Wake Time
                            </Label>
                            <Input
                                type="time"
                                value={wakeTime ? `${String(new Date(wakeTime).getHours()).padStart(2, '0')}:${String(new Date(wakeTime).getMinutes()).padStart(2, '0')}` : ""}
                                onChange={(e) => {
                                    const [h, m] = e.target.value.split(':');
                                    const d = new Date();
                                    d.setHours(Number(h));
                                    d.setMinutes(Number(m));
                                    setValue("wakeTime", d);
                                }}
                                className={cn(
                                    "rounded-xl h-10",
                                    "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                                    "text-white font-[family-name:var(--font-mono)]"
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider flex items-center gap-2">
                                <Clock className="w-3 h-3 text-[#b829dd]" />
                                Sleep Time
                            </Label>
                            <Input
                                type="time"
                                value={sleepTime ? `${String(new Date(sleepTime).getHours()).padStart(2, '0')}:${String(new Date(sleepTime).getMinutes()).padStart(2, '0')}` : ""}
                                onChange={(e) => {
                                    const [h, m] = e.target.value.split(':');
                                    const d = new Date();
                                    d.setHours(Number(h));
                                    d.setMinutes(Number(m));
                                    setValue("sleepTime", d);
                                }}
                                className={cn(
                                    "rounded-xl h-10",
                                    "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                                    "text-white font-[family-name:var(--font-mono)]"
                                )}
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                            <Checkbox
                                id="sport"
                                checked={watch("didSport")}
                                onCheckedChange={(c) => setValue("didSport", c as boolean)}
                                className="border-[rgba(0,245,255,0.3)] data-[state=checked]:bg-[#00f5ff] data-[state=checked]:border-[#00f5ff]"
                            />
                            <Label htmlFor="sport" className="text-white flex items-center gap-2 cursor-pointer text-sm">
                                <Activity className="w-4 h-4 text-[#00f5ff]" />
                                Exercise
                            </Label>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                            <Checkbox
                                id="asmr"
                                checked={watch("asmr")}
                                onCheckedChange={(c) => setValue("asmr", c as boolean)}
                                className="border-[rgba(255,0,110,0.3)] data-[state=checked]:bg-[#ff006e] data-[state=checked]:border-[#ff006e]"
                            />
                            <Label htmlFor="asmr" className="text-white flex items-center gap-2 cursor-pointer text-sm">
                                <Zap className="w-4 h-4 text-[#ff006e]" />
                                ASMR
                            </Label>
                        </div>

                        {isMonday && (
                            <div className="col-span-2 space-y-2">
                                <Label className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">
                                    Screen Time (minutes/day)
                                </Label>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 180 for 3h"
                                    value={screenTime ?? ""}
                                    onChange={(e) => setValue("screenTime", e.target.value ? Number(e.target.value) : undefined)}
                                    className={cn(
                                        "rounded-xl h-10",
                                        "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                                        "text-white placeholder:text-[rgba(255,255,255,0.3)]"
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    {/* Lock & Submit */}
                    <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-6">
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                onClick={() => setValue("isLocked", !isLocked)}
                                className={cn(
                                    "rounded-xl transition-all duration-300 h-10",
                                    isLocked
                                        ? "bg-[rgba(255,0,110,0.15)] text-[#ff006e] border border-[rgba(255,0,110,0.4)] hover:bg-[rgba(255,0,110,0.25)]"
                                        : "bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
                                )}
                            >
                                {isLocked ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                {isLocked ? "LOCKED" : "UNLOCKED"}
                            </Button>
                            <span className="text-xs text-[rgba(255,255,255,0.3)]">
                                {isLocked ? "PIN required" : "Public entry"}
                            </span>
                        </div>

                        <Button
                            type="submit"
                            className={cn(
                                "rounded-xl h-10 px-6",
                                "bg-[rgba(0,245,255,0.15)] text-[#00f5ff] border border-[rgba(0,245,255,0.4)]",
                                "hover:bg-[rgba(0,245,255,0.25)] hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]",
                                "transition-all duration-300 tracking-wider"
                            )}
                        >
                            SAVE ENTRY
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

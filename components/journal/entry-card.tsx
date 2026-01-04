"use client";

import { useState } from "react";
import { EntryDTO } from "@/lib/types";
import { format } from "date-fns";
import { useAppStore } from "@/store/use-app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Sun, Activity, Edit } from "lucide-react";
import { getLockedEntry } from "@/actions/entry";
import { cn } from "@/lib/utils";
import { EntryDialog } from "./entry-dialog";

export function EntryCard({ entry: initialEntry }: { entry: EntryDTO }) {
    const [entry, setEntry] = useState(initialEntry);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [error, setError] = useState("");
    const isGlobalBlurred = useAppStore((s) => s.isBlurred);

    const isLocked = entry.isLocked && !entry.content;

    async function handleUnlock(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        try {
            const res = await getLockedEntry(entry.id, pinInput);
            if (res.success && res.data) {
                setEntry(res.data as EntryDTO);
                setIsUnlocking(false);
            } else {
                setError("Incorrect PIN");
            }
        } catch (err) {
            setError("Error unlocking");
        }
    }

    return (
        <Card className={cn(
            "mb-4 transition-all duration-500",
            isGlobalBlurred && "blur-md hover:blur-none"
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium">
                        {format(new Date(entry.date), "PPP")}
                    </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                    {/* Tags */}
                    {entry.tags?.map(tag => (
                        <Badge
                            key={tag.id}
                            style={{ backgroundColor: tag.color }}
                            className="text-white text-xs"
                        >
                            {tag.name}
                        </Badge>
                    ))}

                    {entry.didSport && <Badge variant="secondary">Sport</Badge>}
                    {entry.asmr && <Badge variant="secondary">ASMR</Badge>}
                    {entry.wakeTime && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Sun className="w-3" /> {format(new Date(entry.wakeTime), "HH:mm")}
                        </div>
                    )}

                    <EntryDialog entryToEdit={entry}>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Edit className="w-3 h-3" />
                        </Button>
                    </EntryDialog>
                </div>
            </CardHeader>

            <CardContent>
                {isLocked ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-md border border-dashed">
                        <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">This entry is locked.</p>

                        {!isUnlocking ? (
                            <Button onClick={() => setIsUnlocking(true)} variant="outline" size="sm">Unlock</Button>
                        ) : (
                            <form onSubmit={handleUnlock} className="flex gap-2">
                                <Input
                                    type="password"
                                    value={pinInput}
                                    onChange={e => setPinInput(e.target.value)}
                                    placeholder="PIN"
                                    className="w-20 h-8"
                                    autoFocus
                                />
                                <Button type="submit" size="sm" className="h-8">Go</Button>
                            </form>
                        )}
                        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap">
                        {entry.content}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

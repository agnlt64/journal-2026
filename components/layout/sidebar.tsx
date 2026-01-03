"use client";

import { EntryDialog } from "@/components/journal/entry-dialog";
import { WritingDialog } from "@/components/journal/writing-dialog";
import { SettingsDialog } from "@/components/journal/settings-dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, PenTool, Settings } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-16 bottom-0 w-16 flex flex-col items-center py-4 bg-background z-40">
            {/* Entry Buttons */}
            <div className="flex flex-col gap-2">
                <EntryDialog>
                    <Button variant="ghost" size="icon-lg" title="New Entry">
                        <BookOpen/>
                    </Button>
                </EntryDialog>

                {/* Writing Button */}
                <WritingDialog>
                    <Button variant="ghost" size="icon-lg" title="New Reflection">
                        <PenTool />
                    </Button>
                </WritingDialog>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Settings at bottom */}
            <SettingsDialog>
                <Button variant="ghost" size="icon-lg" className="mb-2" title="Settings">
                    <Settings />
                </Button>
            </SettingsDialog>
        </aside>
    );
}

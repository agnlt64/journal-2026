"use client";

import { EntryDialog } from "@/components/journal/entry-dialog";
import { WritingDialog } from "@/components/journal/writing-dialog";
import { GoalDialog } from "@/components/journal/goal-dialog";
import { ProjectDialog } from "@/components/journal/project-dialog";
import { SettingsDialog } from "@/components/journal/settings-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Feather, Target, FolderGit, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  return (
    <aside className="fixed left-4 top-0 h-full w-20 flex flex-col items-center justify-center z-40">
      <div className="glass-crystal rounded-2xl p-3 flex flex-col gap-3 border-gradient">
        {/* Primary Action - New Entry */}
        <EntryDialog>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-xl transition-all duration-500 relative overflow-hidden group",
              "bg-linear-to-br from-[rgba(0,245,255,0.2)] to-[rgba(0,245,255,0.05)]",
              "border border-[rgba(0,245,255,0.3)]",
              "hover:border-[#00f5ff] hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]"
            )}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-linear-to-br from-[#00f5ff] to-[#00d4ff] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            
            <Plus className="w-5 h-5 text-[#00f5ff] relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
          </Button>
        </EntryDialog>

        {/* Divider */}
        <div className="w-8 h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent mx-auto" />

        {/* Writing - Cyan style like New Entry */}
        <WritingDialog>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-xl transition-all duration-500 relative overflow-hidden group",
              "bg-linear-to-br from-[rgba(0,245,255,0.2)] to-[rgba(0,245,255,0.05)]",
              "border border-[rgba(0,245,255,0.3)]",
              "hover:border-[#00f5ff] hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]"
            )}
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#00f5ff] to-[#00d4ff] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <Feather className="w-5 h-5 text-[#00f5ff] relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
          </Button>
        </WritingDialog>

        {/* Goal - Cyan style like New Entry */}
        <GoalDialog>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-xl transition-all duration-500 relative overflow-hidden group",
              "bg-linear-to-br from-[rgba(0,245,255,0.2)] to-[rgba(0,245,255,0.05)]",
              "border border-[rgba(0,245,255,0.3)]",
              "hover:border-[#00f5ff] hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]"
            )}
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#00f5ff] to-[#00d4ff] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <Target className="w-5 h-5 text-[#00f5ff] relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
          </Button>
        </GoalDialog>

        {/* Projects - Green accent */}
        <ProjectDialog>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-xl transition-all duration-500 relative overflow-hidden group",
              "bg-linear-to-br from-[rgba(123,184,139,0.2)] to-[rgba(123,184,139,0.05)]",
              "border border-[rgba(123,184,139,0.3)]",
              "hover:border-[#7bb88b] hover:shadow-[0_0_30px_rgba(123,184,139,0.3)]"
            )}
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#7bb88b] to-[#6aa87a] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <FolderGit className="w-5 h-5 text-[#7bb88b] relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
          </Button>
        </ProjectDialog>

        {/* Spacer */}
        <div className="flex-1 min-h-5" />

        {/* Settings */}
        <SettingsDialog>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-xl transition-all duration-300 relative overflow-hidden group",
              "bg-[rgba(255,255,255,0.02)]",
              "border border-[rgba(255,255,255,0.1)]",
              "hover:border-[rgba(255,255,255,0.3)]"
            )}
          >
            <Settings className="w-5 h-5 text-[rgba(255,255,255,0.4)] group-hover:text-white transition-colors duration-300 group-hover:rotate-90" />
          </Button>
        </SettingsDialog>
      </div>
    </aside>
  );
}

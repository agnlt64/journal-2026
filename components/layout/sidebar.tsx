import { EntryDialog } from "@/components/journal/entry-dialog";
import { WritingDialog } from "@/components/journal/writing-dialog";
import { GoalDialog } from "@/components/journal/goal-dialog";
import { ProjectDialog } from "@/components/journal/project-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Feather, Target, FolderGit, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export function Sidebar() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    await router.invalidate();
  }

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
              "hover:border-[#00f5ff] hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]",
            )}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-linear-to-br from-[#00f5ff] to-[#00d4ff] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

            <Plus
              className="w-5 h-5 text-[#00f5ff] relative z-10 group-hover:scale-110 transition-transform duration-300"
              strokeWidth={2.5}
            />
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
              "hover:border-[#00f5ff] hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]",
            )}
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#00f5ff] to-[#00d4ff] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <Feather
              className="w-5 h-5 text-[#00f5ff] relative z-10 group-hover:scale-110 transition-transform duration-300"
              strokeWidth={2.5}
            />
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
              "hover:border-[#00f5ff] hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]",
            )}
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#00f5ff] to-[#00d4ff] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <Target
              className="w-5 h-5 text-[#00f5ff] relative z-10 group-hover:scale-110 transition-transform duration-300"
              strokeWidth={2.5}
            />
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
              "hover:border-[#7bb88b] hover:shadow-[0_0_30px_rgba(123,184,139,0.3)]",
            )}
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#7bb88b] to-[#6aa87a] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <FolderGit
              className="w-5 h-5 text-[#7bb88b] relative z-10 group-hover:scale-110 transition-transform duration-300"
              strokeWidth={2.5}
            />
          </Button>
        </ProjectDialog>

        {/* Divider */}
        <div className="w-8 h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent mx-auto" />

        {/* Logout - Red accent, sits at the bottom of the panel */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Se déconnecter"
          className={cn(
            "w-12 h-12 rounded-xl transition-all duration-500 relative overflow-hidden group",
            "bg-linear-to-br from-[rgba(255,56,100,0.15)] to-[rgba(255,56,100,0.05)]",
            "border border-[rgba(255,56,100,0.3)]",
            "hover:border-[#ff3864] hover:shadow-[0_0_30px_rgba(255,56,100,0.3)]",
          )}
        >
          <div className="absolute inset-0 bg-linear-to-br from-[#ff3864] to-[#ff2044] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          <LogOut
            className="w-5 h-5 text-[#ff3864] relative z-10 group-hover:scale-110 transition-transform duration-300"
            strokeWidth={2.5}
          />
        </Button>
      </div>
    </aside>
  );
}

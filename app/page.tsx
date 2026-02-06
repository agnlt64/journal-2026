import { getEntries, getTags } from "@/actions/entry";
import { getUserSettings } from "@/actions/user";
import { Feed } from "@/components/journal/feed";
import { EntryDialog } from "@/components/journal/entry-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function Home() {
  const [{ data: initialEntries, total }, tags, settings] = await Promise.all([
    getEntries(1, "", true),
    getTags(),
    getUserSettings()
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero Section */}
      <header className="mb-12 relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[rgba(0,245,255,0.03)] rounded-full blur-2xl" />
        <div className="absolute top-8 right-0 w-32 h-32 bg-[rgba(184,41,221,0.03)] rounded-full blur-2xl" />
        
        <div className="relative">
          {/* Label */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-gradient-to-r from-[#00f5ff] to-transparent" />
            <span className="text-[10px] font-medium tracking-[0.3em] text-[rgba(0,245,255,0.6)] uppercase">
              Enregistrements Quotidiens
            </span>
          </div>
          
          <div className="flex items-end justify-between">
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold text-white tracking-tight">
              ENTRÉES
            </h1>
            
            <EntryDialog>
              <Button
                className={cn(
                  "relative overflow-hidden rounded-xl px-6 py-5",
                  "bg-transparent border border-[rgba(0,245,255,0.5)]",
                  "text-[#00f5ff] font-medium tracking-wider text-sm",
                  "hover:bg-[rgba(0,245,255,0.1)] hover:border-[#00f5ff]",
                  "hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]",
                  "transition-all duration-500 group"
                )}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.1)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Plus className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">NOUVELLE ENTRÉE</span>
              </Button>
            </EntryDialog>
          </div>
          
          {/* Stats row */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[rgba(0,245,255,0.6)]" />
              <span className="text-sm text-[rgba(255,255,255,0.5)]">
                {total} <span className="text-[rgba(255,255,255,0.3)]">entrées enregistrées</span>
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
            <span className="text-sm text-[rgba(255,255,255,0.3)]">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
      </header>

      <Feed
        initialEntries={initialEntries}
        initialTotal={total}
        itemsPerPage={settings.itemsPerPage}
        availableTags={tags}
      />
    </div>
  );
}

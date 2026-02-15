import { getEntries, getTags } from "@/actions/entry";
import { getUserSettings } from "@/actions/user";
import { Feed } from "@/components/journal/feed";
import { Sparkles } from "lucide-react";

export default async function Home() {
  const [{ data: initialEntries, total }, tags, settings] = await Promise.all([
    getEntries(1, "", true),
    getTags(),
    getUserSettings(),
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
            <div className="w-8 h-px bg-linear-to-r from-[#00f5ff] to-transparent" />
            <span className="text-[10px] font-medium tracking-[0.3em] text-[rgba(0,245,255,0.6)] uppercase">
              Enregistrements Quotidiens
            </span>
          </div>

          <div className="flex items-end justify-between">
            <h1 className="font-(family-name:--font-display) text-5xl font-bold text-white tracking-tight">
              ENTRÉES
            </h1>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[rgba(0,245,255,0.6)]" />
              <span className="text-sm text-[rgba(255,255,255,0.5)]">
                {total}{" "}
                <span className="text-[rgba(255,255,255,0.3)]">
                  entrées enregistrées
                </span>
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
            <span className="text-sm text-[rgba(255,255,255,0.3)]">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
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

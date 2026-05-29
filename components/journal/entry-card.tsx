import type { EntryDTO } from "@/lib/types";
import { format } from "date-fns";
import { Sun, Moon, Activity, Edit, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { EntryDialog } from "./entry-dialog";
import { useState } from "react";

interface EntryCardProps {
  entry: EntryDTO;
  index?: number;
  onEntryChange?: () => void;
}

export function EntryCard({
  entry,
  index = 0,
  onEntryChange,
}: EntryCardProps) {
  const entryDate = new Date(entry.date);
  const isEvening = entryDate.getHours() >= 18 || entryDate.getHours() < 6;
  const hasActivity = entry.didSport || entry.asmr || entry.wakeTime;

  return (
    <article
      className={cn(
        "group relative rounded-2xl transition-all duration-500 overflow-hidden",
        "bg-[rgba(10,10,18,0.5)] border border-[rgba(0,245,255,0.1)]",
        "hover:border-[rgba(0,245,255,0.3)] hover:shadow-[0_0_40px_rgba(0,245,255,0.1)]",
        "animate-fade-in-up",
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[rgba(0,245,255,0.3)] to-transparent" />

      {/* Content */}
      <div className="p-6">
        {/* Header - Date on left, Tags + Edit on right same row */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Date Block */}
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-[rgba(0,245,255,0.05)] border border-[rgba(0,245,255,0.15)]">
              <span className="text-[9px] font-medium tracking-[0.2em] text-[rgba(0,245,255,0.6)] uppercase">
                {format(entryDate, "MMM")}
              </span>
              <span className="font-(family-name:--font-display) text-2xl font-bold text-white">
                {format(entryDate, "d")}
              </span>
            </div>

            <div>
              <h3 className="font-(family-name:--font-display) text-lg font-medium text-white tracking-wide">
                {format(entryDate, "EEEE")}
              </h3>
              <p className="text-xs text-[rgba(255,255,255,0.4)] tracking-wider">
                {format(entryDate, "yyyy")}
              </p>
            </div>
          </div>

          {/* Tags & Edit - Same row */}
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-1.5 justify-end max-w-50">
              {entry.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider border"
                  style={{
                    backgroundColor: `${tag.color}15`,
                    color: tag.color,
                    borderColor: `${tag.color}30`,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <EntryDialog entryToEdit={entry} onSuccess={onEntryChange}>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-[rgba(0,245,255,0.1)] border border-transparent hover:border-[rgba(0,245,255,0.3)]">
                <Edit className="w-4 h-4 text-[rgba(0,245,255,0.7)]" />
              </button>
            </EntryDialog>
          </div>
        </header>

        {/* Activity Bar */}
        {hasActivity && (
          <div className="flex items-center gap-4 mb-4 py-2 px-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
            {entry.wakeTime && (
              <div className="flex items-center gap-1.5 text-xs">
                <Sun className="w-3.5 h-3.5 text-[#ffbe0b]" />
                <span className="text-[rgba(255,255,255,0.5)] font-mono">
                  {format(new Date(entry.wakeTime), "HH:mm")}
                </span>
              </div>
            )}
            {entry.sleepTime && isEvening && (
              <div className="flex items-center gap-1.5 text-xs">
                <Moon className="w-3.5 h-3.5 text-[#b829dd]" />
                <span className="text-[rgba(255,255,255,0.5)]">
                  {format(new Date(entry.sleepTime), "HH:mm")}
                </span>
              </div>
            )}
            {entry.didSport && (
              <div className="flex items-center gap-1.5 text-xs">
                <Activity className="w-3.5 h-3.5 text-[#00f5ff]" />
                <span className="text-[#00f5ff]">ACTIF</span>
              </div>
            )}
            {entry.asmr && (
              <div className="flex items-center gap-1.5 text-xs">
                <Zap className="w-3.5 h-3.5 text-[#ff006e]" />
                <span className="text-[#ff006e]">ASMR</span>
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        <div>
          <div className="text-[rgba(255,255,255,0.8)] leading-relaxed">
            {!entry.content || entry.content.length === 0 ? (
              <p className="text-sm text-[rgba(255,255,255,0.3)] italic tracking-wide">
                Aucun contenu enregistré pour ce jour...
              </p>
            ) : (
              <div className="whitespace-pre-wrap">{entry.content}</div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

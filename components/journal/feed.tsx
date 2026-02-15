"use client";

import { useState, useEffect, useCallback } from "react";
import { getEntries } from "@/actions/entry";
import { EntryDTO, TagDTO } from "@/lib/types";
import { EntryCard } from "./entry-card";
import { EntryDialog } from "./entry-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";
import { Loader2, ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedProps {
  initialEntries: EntryDTO[];
  initialTotal: number;
  itemsPerPage: number;
  availableTags: TagDTO[];
}

export function Feed({
  initialEntries,
  initialTotal,
  itemsPerPage,
  availableTags,
}: FeedProps) {
  const [entries, setEntries] = useState<EntryDTO[]>(initialEntries);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  const totalPages = Math.ceil(total / itemsPerPage);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  // Function to refresh entries from server
  const refreshEntries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, total: newTotal } = await getEntries(
        page,
        searchQuery,
        true,
      );
      setEntries(data);
      setTotal(newTotal);
      setRefreshKey((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const { data, total: newTotal } = await getEntries(
          1,
          searchQuery,
          true,
        );
        setEntries(data);
        setTotal(newTotal);
        setPage(1);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  async function goToPage(newPage: number) {
    setLoading(true);
    try {
      const { data, total: newTotal } = await getEntries(
        newPage,
        searchQuery,
        true,
      );
      setEntries(data);
      setTotal(newTotal);
      setPage(newPage);
    } finally {
      setLoading(false);
    }
  }

  const filteredEntries =
    selectedTagIds.length > 0
      ? entries.filter((entry) =>
          selectedTagIds.some((tagId) =>
            entry.tags.some((t) => t.id === tagId),
          ),
        )
      : entries;

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,255,255,0.3)] group-focus-within:text-[#00f5ff] transition-colors duration-300" />
          <Input
            placeholder="Rechercher vos entrées..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-11 h-12 rounded-xl",
              "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
              "text-white placeholder:text-[rgba(255,255,255,0.3)]",
              "focus:border-[rgba(0,245,255,0.5)] focus:shadow-[0_0_20px_rgba(0,245,255,0.1)]",
              "transition-all duration-500",
            )}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[rgba(0,245,255,0.3)] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider transition-all duration-300",
                    "border",
                    isSelected
                      ? "border-transparent text-white"
                      : "border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)] hover:border-[rgba(255,255,255,0.2)] hover:text-white",
                  )}
                  style={{
                    backgroundColor: isSelected
                      ? `${tag.color}30`
                      : "transparent",
                    borderColor: isSelected ? `${tag.color}60` : undefined,
                    boxShadow: isSelected
                      ? `0 0 15px ${tag.color}30`
                      : undefined,
                  }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Entry Button */}
      <div className="flex justify-end">
        <EntryDialog onSuccess={refreshEntries}>
          <Button
            className={cn(
              "relative overflow-hidden rounded-xl px-6 py-5",
              "bg-transparent border border-[rgba(0,245,255,0.5)]",
              "text-[#00f5ff] font-medium tracking-wider text-sm",
              "hover:bg-[rgba(0,245,255,0.1)] hover:border-[#00f5ff]",
              "hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]",
              "transition-all duration-500 group",
            )}
          >
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-[rgba(0,245,255,0.1)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Plus className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">NOUVELLE ENTRÉE</span>
          </Button>
        </EntryDialog>
      </div>

      {/* Entries */}
      <div className="space-y-6">
        {loading && entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-[#00f5ff] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[#00f5ff] opacity-30" />
            </div>
            <p className="mt-4 text-[rgba(255,255,255,0.4)] text-sm tracking-wider">
              CHARGEMENT DES ENTRÉES...
            </p>
          </div>
        ) : (
          <>
            {filteredEntries.map((entry, index) => (
              <EntryCard
                key={`${entry.id}-${refreshKey}`}
                entry={entry}
                index={index}
                onEntryChange={refreshEntries}
              />
            ))}
            {filteredEntries.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center relative">
                <div className="absolute inset-0 bg-linear-to-b from-[rgba(0,245,255,0.02)] to-transparent rounded-3xl" />
                <div className="relative w-24 h-24 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center mb-6">
                  <div className="text-4xl opacity-50">◈</div>
                </div>
                <h3 className="font-(family-name:--font-display) text-2xl text-white mb-2 tracking-wider">
                  AUCUNE ENTRÉE
                </h3>
                <p className="text-[rgba(255,255,255,0.4)] text-sm max-w-md">
                  Votre journal est une toile vierge. Créez votre première
                  entrée pour commencer votre voyage.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToPage(page - 1)}
            disabled={!hasPrevPage || loading}
            className={cn(
              "w-10 h-10 rounded-xl",
              "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]",
              "text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(0,245,255,0.3)]",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "transition-all duration-300",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-1 px-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={cn(
                  "w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300",
                  p === page
                    ? "bg-[rgba(0,245,255,0.2)] text-[#00f5ff] border border-[rgba(0,245,255,0.5)] shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                    : "text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]",
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToPage(page + 1)}
            disabled={!hasNextPage || loading}
            className={cn(
              "w-10 h-10 rounded-xl",
              "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]",
              "text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(0,245,255,0.3)]",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "transition-all duration-300",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

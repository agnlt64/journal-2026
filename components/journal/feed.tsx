"use client";

import { useState, useEffect, useRef } from "react";
import { getEntries } from "@/actions/entry";
import { EntryDTO, TagDTO } from "@/lib/types";
import { EntryCard } from "./entry-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/use-app-store";
import { Loader2, X } from "lucide-react";

interface FeedProps {
    initialEntries: EntryDTO[];
    availableTags: TagDTO[];
}

export function Feed({ initialEntries, availableTags }: FeedProps) {
    const [entries, setEntries] = useState<EntryDTO[]>(initialEntries);
    const [loading, setLoading] = useState(false);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const isFirstRender = useRef(true);

    const searchQuery = useAppStore(s => s.searchQuery);
    const setSearchQuery = useAppStore(s => s.setSearchQuery);

    // Search logic with debounce
    useEffect(() => {
        const handler = setTimeout(async () => {
            setLoading(true);
            try {
                const { data } = await getEntries(1, searchQuery);
                setEntries(data);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Filter entries by selected tags
    const filteredEntries = selectedTagIds.length > 0
        ? entries.filter(entry =>
            selectedTagIds.some(tagId => entry.tags.some(t => t.id === tagId))
        )
        : entries;

    function toggleTag(tagId: string) {
        setSelectedTagIds(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and Tag Filters */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                    <Input
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                </div>

                {/* Tag Filters */}
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
            </div>

            {/* {loading && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>} */}

            <div className="space-y-6">
                {filteredEntries.map(entry => (
                    <EntryCard key={entry.id} entry={entry} />
                ))}
                {filteredEntries.length === 0 && !loading && (
                    <p className="text-center text-muted-foreground">Aucune entrée trouvée.</p>
                )}
            </div>
        </div>
    );
}

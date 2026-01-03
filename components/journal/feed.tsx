"use client";

import { useState, useEffect } from "react";
import { getEntries } from "@/actions/entry";
import { EntryDTO } from "@/lib/types";
import { EntryCard } from "./entry-card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";
import { Loader2 } from "lucide-react";

export function Feed({ initialEntries }: { initialEntries: EntryDTO[] }) {
    // We can use SWR or React Query for real stuff, but for now simple useEffect with Search
    const [entries, setEntries] = useState<EntryDTO[]>(initialEntries);
    const [loading, setLoading] = useState(false);

    const searchQuery = useAppStore(s => s.searchQuery);
    const setSearchQuery = useAppStore(s => s.setSearchQuery);

    // We need a debounce hook to avoid spamming the server
    // I'll inline the logic or create a hook file
    // Let's create a hook file next.

    // Search Logic
    useEffect(() => {
        // If empty query, maybe revert to initial? Or re-fetch?
        // Let's just re-fetch to be safe incase of updates.

        // Actually, handling this cleanly inside useEffect is tricky with debouncing.
        // I'll assume passing searchQuery to the parent Page or managing it here.
        // Let's simple fetch when searchQuery changes (debounced).

        const handler = setTimeout(async () => {
            setLoading(true);
            try {
                const { data } = await getEntries(1, searchQuery); // Page 1 for search results
                setEntries(data);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);


    return (
        <div className="space-y-4">
            <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-6"
            />

            {loading && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}

            <div className="space-y-6">
                {entries.map(entry => (
                    <EntryCard key={entry.id} entry={entry} />
                ))}
                {entries.length === 0 && !loading && (
                    <p className="text-center text-muted-foreground">No entries found.</p>
                )}
            </div>
        </div>
    );
}

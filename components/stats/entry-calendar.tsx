"use client";

import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";

interface EntryCalendarProps {
    entryDates: Date[];
}

export function EntryCalendar({ entryDates }: EntryCalendarProps) {
    // Convert dates to Set of date strings for quick lookup
    const entryDateSet = useMemo(() => {
        return new Set(
            entryDates.map(d => new Date(d).toDateString())
        );
    }, [entryDates]);

    // Custom modifiers for dates with entries
    const modifiers = useMemo(() => ({
        hasEntry: (date: Date) => entryDateSet.has(date.toDateString())
    }), [entryDateSet]);

    const modifiersStyles = {
        hasEntry: {
            backgroundColor: 'hsl(var(--primary))',
            color: 'white',
            borderRadius: '50%',
        }
    };

    return (
        <div className="flex justify-center">
            <Calendar
                mode="multiple"
                selected={entryDates.map(d => new Date(d))}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border"
                disabled={() => false}
            />
        </div>
    );
}

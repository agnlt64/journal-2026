"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";

export function BlurToggle() {
    const toggleBlur = useAppStore(s => s.toggleBlur);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input/textarea
            const target = e.target as HTMLElement;
            if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) return;

            if (e.key.toLowerCase() === 'b') {
                toggleBlur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleBlur]);

    return null; // Invisible component
}

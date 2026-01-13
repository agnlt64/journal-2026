"use client";

import { useState } from "react";
import { updateCounter } from "@/actions/stats";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface CounterProps {
    initialValue: number;
}

export function Counter({ initialValue }: CounterProps) {
    const [value, setValue] = useState(initialValue);
    const [loading, setLoading] = useState(false);

    async function handleUpdate(delta: number) {
        setLoading(true);
        try {
            const newValue = await updateCounter(delta);
            setValue(newValue);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center gap-4">
            <Button
                variant="outline"
                size="icon"
                onClick={() => handleUpdate(-1)}
                disabled={loading}
            >
                <Minus className="w-4 h-4" />
            </Button>
            <span className="text-4xl font-bold min-w-[80px] text-center">
                {value}
            </span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => handleUpdate(1)}
                disabled={loading}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
}

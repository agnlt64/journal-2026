"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { StatsEntry } from "@/actions/stats";

interface SleepChartProps {
    entries: StatsEntry[];
}

// Convert time to decimal hours for chart display
function timeToHours(date: Date | null): number | null {
    if (!date) return null;
    const d = new Date(date);
    return d.getHours() + d.getMinutes() / 60;
}

// Format hours back to time string for tooltip
function formatHours(value: number): string {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function SleepChart({ entries }: SleepChartProps) {
    const chartData = useMemo(() => {
        return entries
            .filter(e => e.wakeTime || e.sleepTime)
            .map(entry => ({
                date: new Intl.DateTimeFormat('fr-FR', {
                    day: '2-digit',
                    month: '2-digit'
                }).format(new Date(entry.date)),
                wakeTime: timeToHours(entry.wakeTime),
                sleepTime: timeToHours(entry.sleepTime),
            }));
    }, [entries]);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                Aucune donnée de sommeil disponible
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis
                    domain={[0, 24]}
                    ticks={[0, 6, 12, 18, 24]}
                    tickFormatter={(v) => `${v}h`}
                    stroke="#888"
                    fontSize={12}
                />
                <Tooltip
                    formatter={(value: number | undefined) => value !== undefined ? formatHours(value) : '-'}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="wakeTime"
                    name="Réveil"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: '#22c55e' }}
                    connectNulls
                />
                <Line
                    type="monotone"
                    dataKey="sleepTime"
                    name="Coucher"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1' }}
                    connectNulls
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

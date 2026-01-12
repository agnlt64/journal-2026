"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatsEntry } from "@/actions/stats";

interface ScreenTimeChartProps {
    entries: StatsEntry[];
}

// Get ISO week number
function getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Format minutes to hours and minutes
function formatMinutes(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h${m.toString().padStart(2, '0')}`;
}

export function ScreenTimeChart({ entries }: ScreenTimeChartProps) {
    const chartData = useMemo(() => {
        // Group by week and calculate average
        const weekData = new Map<string, { total: number; count: number; year: number; week: number }>();

        for (const entry of entries) {
            if (entry.screenTime === null) continue;

            const date = new Date(entry.date);
            const year = date.getFullYear();
            const week = getWeekNumber(date);
            const key = `${year}-S${week}`;

            const existing = weekData.get(key) || { total: 0, count: 0, year, week };
            existing.total += entry.screenTime;
            existing.count += 1;
            weekData.set(key, existing);
        }

        // Convert to array and calculate averages
        return Array.from(weekData.entries())
            .map(([key, data]) => ({
                week: key,
                average: Math.round(data.total / data.count),
                year: data.year,
                weekNum: data.week,
            }))
            .sort((a, b) => a.year - b.year || a.weekNum - b.weekNum);
    }, [entries]);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                Aucune donnée de temps d'écran disponible
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" stroke="#888" fontSize={12} />
                <YAxis
                    stroke="#888"
                    fontSize={12}
                    tickFormatter={(v) => formatMinutes(v)}
                />
                <Tooltip
                    formatter={(value: number | undefined) => value !== undefined ? formatMinutes(value) : '-'}
                    labelFormatter={(label) => `Semaine ${label}`}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Bar
                    dataKey="average"
                    name="Moyenne quotidienne"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

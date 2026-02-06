import { getStatsData, getEntryDates, getCounter } from "@/actions/stats";
import { SleepChart } from "@/components/stats/sleep-chart";
import { ScreenTimeChart } from "@/components/stats/screen-time-chart";
import { EntryCalendar } from "@/components/stats/entry-calendar";
import { Counter } from "@/components/stats/counter";
import { BarChart3, Moon, Smartphone, CalendarDays, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function StatsPage() {
    const [entries, entryDates, counterValue] = await Promise.all([
        getStatsData(),
        getEntryDates(),
        getCounter()
    ]);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <header className="mb-12 relative">
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-[rgba(255,190,11,0.03)] rounded-full blur-2xl" />
                
                <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-px bg-gradient-to-r from-[#ffbe0b] via-[#ff006e] to-[#00f5ff]" />
                        <span className="text-[10px] font-medium tracking-[0.3em] text-[rgba(255,255,255,0.4)] uppercase">
                            Personal Analytics
                        </span>
                    </div>
                    
                    <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold text-white tracking-tight">
                        ANALYTICS
                    </h1>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="space-y-8">
                {/* Counter Card */}
                <section className={cn(
                    "rounded-2xl border p-6 relative overflow-hidden",
                    "bg-[rgba(10,10,18,0.5)] border-[rgba(0,245,255,0.1)]"
                )}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent opacity-50" />
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.2)] flex items-center justify-center">
                            <Activity className="w-5 h-5 text-[#00f5ff]" />
                        </div>
                        <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-white tracking-wide">
                            Counter
                        </h2>
                    </div>
                    <Counter initialValue={counterValue} />
                </section>

                {/* Sleep Chart */}
                <section className={cn(
                    "rounded-2xl border p-6 relative overflow-hidden",
                    "bg-[rgba(10,10,18,0.5)] border-[rgba(184,41,221,0.1)]"
                )}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b829dd] to-transparent opacity-50" />
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(184,41,221,0.1)] border border-[rgba(184,41,221,0.2)] flex items-center justify-center">
                            <Moon className="w-5 h-5 text-[#b829dd]" />
                        </div>
                        <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-white tracking-wide">
                            Sleep Patterns
                        </h2>
                    </div>
                    <SleepChart entries={entries} />
                </section>

                {/* Screen Time Chart */}
                <section className={cn(
                    "rounded-2xl border p-6 relative overflow-hidden",
                    "bg-[rgba(10,10,18,0.5)] border-[rgba(255,0,110,0.1)]"
                )}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff006e] to-transparent opacity-50" />
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(255,0,110,0.1)] border border-[rgba(255,0,110,0.2)] flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-[#ff006e]" />
                        </div>
                        <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-white tracking-wide">
                            Weekly Screen Time
                        </h2>
                    </div>
                    <ScreenTimeChart entries={entries} />
                </section>

                {/* Entry Calendar */}
                <section className={cn(
                    "rounded-2xl border p-6 relative overflow-hidden",
                    "bg-[rgba(10,10,18,0.5)] border-[rgba(255,190,11,0.1)]"
                )}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffbe0b] to-transparent opacity-50" />
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(255,190,11,0.1)] border border-[rgba(255,190,11,0.2)] flex items-center justify-center">
                            <CalendarDays className="w-5 h-5 text-[#ffbe0b]" />
                        </div>
                        <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-white tracking-wide">
                            Entry Calendar
                        </h2>
                    </div>
                    <EntryCalendar entryDates={entryDates} />
                </section>
            </div>
        </div>
    );
}

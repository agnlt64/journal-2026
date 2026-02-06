import { getGoals } from "@/actions/goal";
import { GoalDialog } from "@/components/journal/goal-dialog";
import { GoalCard } from "@/components/journal/goal-card";
import { GoalDTO } from "@/lib/types";
import { Target, Flag, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function groupGoalsByPeriod(goals: GoalDTO[]): Map<string, GoalDTO[]> {
    const groups = new Map<string, GoalDTO[]>();

    for (const goal of goals) {
        const deadline = new Date(goal.deadline);
        const key = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric'
        }).format(deadline);

        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key)!.push(goal);
    }

    return groups;
}

export default async function ObjectifsPage() {
    const goals = await getGoals() as GoalDTO[];
    const groupedGoals = groupGoalsByPeriod(goals);

    return (
        <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <header className="mb-12 relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[rgba(255,0,110,0.03)] rounded-full blur-2xl" />
                
                <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-px bg-gradient-to-r from-[#ff006e] to-transparent" />
                        <span className="text-[10px] font-medium tracking-[0.3em] text-[rgba(255,0,110,0.6)] uppercase">
                            Track Progress
                        </span>
                    </div>
                    
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[#888888] text-sm mb-1 tracking-wide uppercase">Track Your Progress</p>
                        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-[#f5f0e8]">
                            Goals
                        </h1>
                    </div>
                    <GoalDialog>
                        <button
                            className={cn(
                                "relative overflow-hidden rounded-xl px-6 py-3",
                                "bg-transparent border border-[rgba(0,245,255,0.5)]",
                                "text-[#00f5ff] font-medium tracking-wider text-sm",
                                "hover:bg-[rgba(0,245,255,0.1)] hover:border-[#00f5ff]",
                                "hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]",
                                "transition-all duration-500 group"
                            )}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.1)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <span className="relative z-10 flex items-center">
                                <Plus className="w-4 h-4 mr-2" />
                                NEW GOAL
                            </span>
                        </button>
                    </GoalDialog>
                </div>
                    
                    <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-[rgba(255,0,110,0.6)]" />
                            <span className="text-sm text-[rgba(255,255,255,0.5)]">
                                {goals.length} <span className="text-[rgba(255,255,255,0.3)]">goals defined</span>
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Goals by Period */}
            <div className="space-y-10">
                {Array.from(groupedGoals.entries()).map(([period, periodGoals], groupIndex) => (
                    <section key={period}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[rgba(255,0,110,0.1)] border border-[rgba(255,0,110,0.2)] flex items-center justify-center">
                                <Flag className="w-5 h-5 text-[#ff006e]" />
                            </div>
                            <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-white tracking-wide capitalize">
                                {period}
                            </h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-[rgba(255,0,110,0.2)] to-transparent" />
                        </div>
                        
                        <div className="space-y-4">
                            {periodGoals.map((goal, index) => (
                                <GoalCard key={goal.id} goal={goal} index={groupIndex * 10 + index} />
                            ))}
                        </div>
                    </section>
                ))}
                
                {goals.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,0,110,0.02)] to-transparent rounded-3xl" />
                        <div className="relative w-24 h-24 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center mb-6">
                            <Target className="w-10 h-10 text-[rgba(255,0,110,0.4)]" />
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] text-2xl text-white mb-2 tracking-wider">
                            NO GOALS
                        </h3>
                        <p className="text-[rgba(255,255,255,0.4)] text-sm max-w-md">
                            Set meaningful goals to track your progress throughout your journey.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

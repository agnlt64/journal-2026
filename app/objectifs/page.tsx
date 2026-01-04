import { getGoals } from "@/actions/goal";
import { GoalDialog } from "@/components/journal/goal-dialog";
import { GoalCard } from "@/components/journal/goal-card";
import { GoalDTO } from "@/lib/types";

// Group goals by month/year
function groupGoalsByPeriod(goals: GoalDTO[]): Map<string, GoalDTO[]> {
    const groups = new Map<string, GoalDTO[]>();

    for (const goal of goals) {
        const deadline = new Date(goal.deadline);
        const key = new Intl.DateTimeFormat('fr-FR', {
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
        <main className="container mx-auto py-8 max-w-3xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Objectifs</h1>
                <GoalDialog />
            </div>

            <div className="space-y-8">
                {Array.from(groupedGoals.entries()).map(([period, periodGoals]) => (
                    <section key={period}>
                        <h2 className="text-lg font-semibold text-muted-foreground mb-4 capitalize">
                            {period}
                        </h2>
                        <div className="grid gap-3">
                            {periodGoals.map((goal) => (
                                <GoalCard key={goal.id} goal={goal} />
                            ))}
                        </div>
                    </section>
                ))}
                {goals.length === 0 && (
                    <p className="text-center text-muted-foreground">
                        Aucun objectif pour le moment.
                    </p>
                )}
            </div>
        </main>
    );
}

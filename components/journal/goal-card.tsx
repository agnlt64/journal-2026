"use client";

import { useState } from "react";
import { GoalDTO } from "@/lib/types";
import { toggleGoalCompletion } from "@/actions/goal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
    goal: GoalDTO;
}

export function GoalCard({ goal }: GoalCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleToggle() {
        setIsUpdating(true);
        try {
            await toggleGoalCompletion(goal.id);
        } finally {
            setIsUpdating(false);
        }
    }

    const formattedDeadline = new Intl.DateTimeFormat('fr-FR', {
        month: 'long',
        year: 'numeric'
    }).format(new Date(goal.deadline));

    const formattedCompletedAt = goal.completedAt
        ? new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(goal.completedAt))
        : null;

    return (
        <Card className={cn(
            "transition-all",
            goal.isCompleted && "opacity-70"
        )}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <Checkbox
                    checked={goal.isCompleted}
                    onCheckedChange={handleToggle}
                    disabled={isUpdating}
                    className="mt-1"
                />
                <div className="flex-1">
                    <CardTitle className={cn(
                        "text-lg",
                        goal.isCompleted && "line-through text-muted-foreground"
                    )}>
                        {goal.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Avant {formattedDeadline}
                    </p>
                </div>
            </CardHeader>
            {(goal.description || goal.isCompleted) && (
                <CardContent className="pt-0 pl-12">
                    {goal.description && (
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {goal.description}
                        </p>
                    )}
                    {goal.isCompleted && formattedCompletedAt && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Complété le {formattedCompletedAt}
                        </p>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

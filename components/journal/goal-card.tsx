"use client";

import { useState } from "react";
import { GoalDTO } from "@/lib/types";
import { toggleGoalCompletion, updateGoalRemark } from "@/actions/goal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Target, CheckCircle2, XCircle, MessageSquare, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
    goal: GoalDTO;
}

export function GoalCard({ goal }: GoalCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditingRemark, setIsEditingRemark] = useState(false);
    const [remarkText, setRemarkText] = useState(goal.remark || "");
    const [isSavingRemark, setIsSavingRemark] = useState(false);

    const now = new Date();
    const deadlineDate = new Date(goal.deadline);
    const isPastDeadline = deadlineDate < now;

    async function handleToggle() {
        setIsUpdating(true);
        try {
            await toggleGoalCompletion(goal.id);
        } finally {
            setIsUpdating(false);
        }
    }

    async function handleSaveRemark() {
        setIsSavingRemark(true);
        try {
            await updateGoalRemark(goal.id, remarkText || null);
            setIsEditingRemark(false);
        } finally {
            setIsSavingRemark(false);
        }
    }

    function handleCancelRemark() {
        setRemarkText(goal.remark || "");
        setIsEditingRemark(false);
    }

    // Full date format: "15 janvier 2026"
    const formattedDeadline = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(deadlineDate);

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
            isPastDeadline && goal.isCompleted && "border-green-500/30 bg-green-500/5",
            isPastDeadline && !goal.isCompleted && "border-red-500/30 bg-red-500/5"
        )}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                {/* Show checkbox only for future objectives */}
                {!isPastDeadline && (
                    <Checkbox
                        checked={goal.isCompleted}
                        onCheckedChange={handleToggle}
                        disabled={isUpdating}
                        className="mt-1"
                    />
                )}
                {/* Show status badge for past objectives */}
                {isPastDeadline && (
                    <div className="mt-1">
                        {goal.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                    </div>
                )}
                <div className="flex-1">
                    <CardTitle className={cn(
                        "text-lg",
                        goal.isCompleted && "line-through text-muted-foreground"
                    )}>
                        {goal.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Avant le {formattedDeadline}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="pt-0 pl-12">
                {goal.description && (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                        {goal.description}
                    </p>
                )}

                {/* Status display and toggle for past objectives */}
                {isPastDeadline && (
                    <div className="mt-3 pt-3 border-t border-border space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Statut :</span>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={goal.isCompleted ? "default" : "outline"}
                                    onClick={handleToggle}
                                    disabled={isUpdating}
                                    className={cn(
                                        "h-7 text-xs",
                                        goal.isCompleted && "bg-green-600 hover:bg-green-700"
                                    )}
                                >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Atteint
                                </Button>
                                <Button
                                    size="sm"
                                    variant={!goal.isCompleted ? "default" : "outline"}
                                    onClick={handleToggle}
                                    disabled={isUpdating}
                                    className={cn(
                                        "h-7 text-xs",
                                        !goal.isCompleted && "bg-red-600 hover:bg-red-700"
                                    )}
                                >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Non atteint
                                </Button>
                            </div>
                        </div>

                        {goal.isCompleted && formattedCompletedAt && (
                            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Marqué atteint le {formattedCompletedAt}
                            </p>
                        )}

                        {/* Remark section */}
                        {isEditingRemark ? (
                            <div className="space-y-2">
                                <Textarea
                                    value={remarkText}
                                    onChange={(e) => setRemarkText(e.target.value)}
                                    placeholder="Ajouter une remarque..."
                                    className="min-h-[80px]"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleSaveRemark}
                                        disabled={isSavingRemark}
                                    >
                                        <Save className="w-3 h-3 mr-1" />
                                        Enregistrer
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancelRemark}
                                        disabled={isSavingRemark}
                                    >
                                        <X className="w-3 h-3 mr-1" />
                                        Annuler
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {goal.remark ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            Remarque
                                        </p>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {goal.remark}
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setIsEditingRemark(true)}
                                            className="mt-1 h-7 text-xs"
                                        >
                                            Modifier
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setIsEditingRemark(true)}
                                        className="h-7 text-xs text-muted-foreground"
                                    >
                                        <MessageSquare className="w-3 h-3 mr-1" />
                                        Ajouter une remarque
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* For future objectives, just show completion date if completed */}
                {!isPastDeadline && goal.isCompleted && formattedCompletedAt && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Complété le {formattedCompletedAt}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

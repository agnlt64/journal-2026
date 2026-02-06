"use client";

import { useState } from "react";
import { GoalDTO } from "@/lib/types";
import { toggleGoalCompletion, updateGoalRemark } from "@/actions/goal";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Target, CheckCircle2, XCircle, MessageSquare, X, Save, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
    goal: GoalDTO;
    index?: number;
}

export function GoalCard({ goal, index = 0 }: GoalCardProps) {
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

    const formattedDeadline = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(deadlineDate);

    const formattedCompletedAt = goal.completedAt
        ? new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(goal.completedAt))
        : null;

    return (
        <div
            className={cn(
                "group relative rounded-xl transition-all duration-500 overflow-hidden",
                "bg-[rgba(10,10,18,0.5)] border border-[rgba(255,0,110,0.1)]",
                "hover:border-[rgba(255,0,110,0.25)]",
                goal.isCompleted && "border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.03)]",
                !goal.isCompleted && isPastDeadline && "border-[rgba(255,0,110,0.25)] bg-[rgba(255,0,110,0.03)]",
                "animate-fade-in-up"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Top accent line */}
            <div 
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background: goal.isCompleted 
                        ? "linear-gradient(90deg, transparent, rgba(0,245,255,0.5), transparent)"
                        : "linear-gradient(90deg, transparent, rgba(255,0,110,0.4), transparent)"
                }}
            />

            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Status Indicator */}
                    <div className="mt-0.5">
                        {!isPastDeadline ? (
                            <Checkbox
                                checked={goal.isCompleted}
                                onCheckedChange={handleToggle}
                                disabled={isUpdating}
                                className={cn(
                                    "w-5 h-5 rounded border-2",
                                    "border-[rgba(255,0,110,0.3)]",
                                    "data-[state=checked]:bg-[#ff006e] data-[state=checked]:border-[#ff006e]"
                                )}
                            />
                        ) : (
                            <div 
                                className={cn(
                                    "w-5 h-5 rounded flex items-center justify-center",
                                    goal.isCompleted ? "bg-[#00f5ff]" : "bg-[#ff3864]"
                                )}
                            >
                                {goal.isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                                ) : (
                                    <XCircle className="w-3.5 h-3.5 text-black" />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className={cn(
                            "font-[family-name:var(--font-display)] text-base font-medium tracking-wide transition-all duration-300",
                            goal.isCompleted ? "text-[#00f5ff] line-through opacity-60" : "text-white"
                        )}>
                            {goal.title}
                        </h3>

                        {/* Deadline */}
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[rgba(255,255,255,0.4)]">
                            <Calendar className="w-3 h-3" />
                            <span className="font-[family-name:var(--font-mono)]">DUE {formattedDeadline.toUpperCase()}</span>
                        </div>

                        {/* Description */}
                        {goal.description && (
                            <p className="mt-2 text-sm text-[rgba(255,255,255,0.6)] leading-relaxed">
                                {goal.description}
                            </p>
                        )}

                        {/* Past Deadline Status */}
                        {isPastDeadline && (
                            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Status</span>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => !goal.isCompleted && handleToggle()}
                                            disabled={isUpdating}
                                            className={cn(
                                                "h-7 text-[10px] rounded-lg tracking-wider transition-all",
                                                goal.isCompleted
                                                    ? "bg-[#00f5ff] text-black hover:bg-[#00d4ff]"
                                                    : "bg-transparent border border-[#00f5ff] text-[#00f5ff] hover:bg-[rgba(0,245,255,0.1)]"
                                            )}
                                        >
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            ACHIEVED
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => goal.isCompleted && handleToggle()}
                                            disabled={isUpdating}
                                            className={cn(
                                                "h-7 text-[10px] rounded-lg tracking-wider transition-all",
                                                !goal.isCompleted
                                                    ? "bg-[#ff3864] text-black hover:bg-[#ff2044]"
                                                    : "bg-transparent border border-[#ff3864] text-[#ff3864] hover:bg-[rgba(255,56,100,0.1)]"
                                            )}
                                        >
                                            <XCircle className="w-3 h-3 mr-1" />
                                            MISSED
                                        </Button>
                                    </div>
                                </div>

                                {/* Remark Section */}
                                {isEditingRemark ? (
                                    <div className="mt-3 space-y-2">
                                        <Textarea
                                            value={remarkText}
                                            onChange={(e) => setRemarkText(e.target.value)}
                                            placeholder="Add a note..."
                                            className={cn(
                                                "min-h-[80px] rounded-xl text-sm",
                                                "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                                                "text-white placeholder:text-[rgba(255,255,255,0.3)]"
                                            )}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={handleSaveRemark}
                                                disabled={isSavingRemark}
                                                className="rounded-lg bg-[rgba(0,245,255,0.15)] text-[#00f5ff] border border-[rgba(0,245,255,0.3)] hover:bg-[rgba(0,245,255,0.25)] h-8 text-xs"
                                            >
                                                <Save className="w-3 h-3 mr-1" />
                                                SAVE
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCancelRemark}
                                                disabled={isSavingRemark}
                                                className="rounded-lg border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)] h-8 text-xs"
                                            >
                                                <X className="w-3 h-3 mr-1" />
                                                CANCEL
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-3">
                                        {goal.remark ? (
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider flex items-center gap-1">
                                                    <MessageSquare className="w-3 h-3" />
                                                    Note
                                                </p>
                                                <p className="text-sm text-[rgba(255,255,255,0.7)]">
                                                    {goal.remark}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setIsEditingRemark(true)}
                                                    className="h-6 text-[10px] text-[rgba(255,255,255,0.4)] hover:text-[#00f5ff]"
                                                >
                                                    EDIT
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setIsEditingRemark(true)}
                                                className="h-6 text-[10px] text-[rgba(255,255,255,0.4)] hover:text-[#00f5ff]"
                                            >
                                                <MessageSquare className="w-3 h-3 mr-1" />
                                                ADD NOTE
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Completion Date */}
                        {!isPastDeadline && goal.isCompleted && formattedCompletedAt && (
                            <p className="mt-3 text-xs text-[#00f5ff] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Completed on {formattedCompletedAt}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createProjectStep,
  updateProjectStep,
  deleteProjectStep,
  toggleProjectStep,
  reorderProjectSteps,
} from "@/actions/project";
import { ProjectStepDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  GripVertical,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Circle,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Step content (shared between sortable row and drag overlay) ──────────────

interface StepContentProps {
  step: ProjectStepDTO;
  statusColor: string;
  onEdit?: (step: ProjectStepDTO) => void;
  onDelete?: (id: string) => void;
  onToggle?: (step: ProjectStepDTO) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isOverlay?: boolean;
}

function StepContent({
  step,
  statusColor,
  onEdit,
  onDelete,
  onToggle,
  dragHandleProps,
  isOverlay,
}: StepContentProps) {
  const isCompleted = !!step.completedAt;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl border transition-colors duration-200",
        isOverlay
          ? "bg-[rgba(15,15,25,0.95)] border-[rgba(255,255,255,0.2)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          : isCompleted
          ? "bg-[rgba(10,10,18,0.3)] border-[rgba(255,255,255,0.05)]"
          : "bg-[rgba(10,10,18,0.5)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]",
      )}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="cursor-grab active:cursor-grabbing text-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.5)] transition-colors shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Checkbox */}
      {onToggle && (
        <button
          onClick={() => onToggle(step)}
          className="shrink-0 transition-colors"
          style={{ color: isCompleted ? statusColor : "rgba(255,255,255,0.3)" }}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            isCompleted
              ? "line-through text-[rgba(255,255,255,0.35)]"
              : "text-white",
          )}
        >
          {step.title}
        </p>
        {step.description && !isCompleted && (
          <p className="text-xs text-[rgba(255,255,255,0.45)] mt-0.5 leading-relaxed">
            {step.description}
          </p>
        )}
        {step.completionComment && isCompleted && (
          <p className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5 italic flex items-center gap-1">
            <MessageSquare className="w-3 h-3 shrink-0" />
            {step.completionComment}
          </p>
        )}
      </div>

      {/* Actions */}
      {!isOverlay && (onEdit || onDelete) && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {!isCompleted && onEdit && (
            <button
              onClick={() => onEdit(step)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[rgba(123,184,139,0.6)] hover:text-[#7bb88b] hover:bg-[rgba(123,184,139,0.1)] transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(step.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[rgba(255,56,100,0.5)] hover:text-[#ff3864] hover:bg-[rgba(255,56,100,0.1)] transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

interface SortableStepProps {
  step: ProjectStepDTO;
  onEdit: (step: ProjectStepDTO) => void;
  onDelete: (id: string) => void;
  onToggle: (step: ProjectStepDTO) => void;
  statusColor: string;
}

function SortableStep({
  step,
  onEdit,
  onDelete,
  onToggle,
  statusColor,
}: SortableStepProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    // Slot placeholder — shows where the item will land
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[52px] rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.02)]"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <StepContent
        step={step}
        statusColor={statusColor}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProjectStepsProps {
  projectId: string;
  initialSteps: ProjectStepDTO[];
  statusColor: string;
}

export function ProjectSteps({
  projectId,
  initialSteps,
  statusColor,
}: ProjectStepsProps) {
  const [steps, setSteps] = useState<ProjectStepDTO[]>(initialSteps);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Add form
  const [addTitle, setAddTitle] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Edit dialog
  const [editStep, setEditStep] = useState<ProjectStepDTO | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Toggle/comment dialog
  const [completingStep, setCompletingStep] = useState<ProjectStepDTO | null>(null);
  const [completionComment, setCompletionComment] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const activeStep = steps.find((s) => s.id === activeId) ?? null;

  // ── Drag handlers ────────────────────────────────────────────────────────────
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = steps.findIndex((s) => s.id === active.id);
    const newIndex = steps.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(steps, oldIndex, newIndex).map((s, i) => ({
      ...s,
      order: i,
    }));
    setSteps(reordered);

    startTransition(() => {
      reorderProjectSteps(
        projectId,
        reordered.map((s) => s.id),
      );
    });
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  // ── Add step ────────────────────────────────────────────────────────────────
  async function handleAdd() {
    const title = addTitle.trim();
    if (!title) return;

    const optimistic: ProjectStepDTO = {
      id: `temp-${Date.now()}`,
      title,
      description: addDescription.trim() || null,
      order: steps.length,
      completedAt: null,
      completionComment: null,
    };
    setSteps((prev) => [...prev, optimistic]);
    setAddTitle("");
    setAddDescription("");
    setIsAdding(false);

    startTransition(async () => {
      const created = await createProjectStep(projectId, {
        title,
        description: addDescription.trim() || undefined,
      });
      setSteps((prev) =>
        prev.map((s) => (s.id === optimistic.id ? created : s)),
      );
    });
  }

  // ── Edit step ───────────────────────────────────────────────────────────────
  function openEdit(step: ProjectStepDTO) {
    setEditStep(step);
    setEditTitle(step.title);
    setEditDescription(step.description || "");
  }

  async function handleEdit() {
    if (!editStep) return;
    const title = editTitle.trim();
    if (!title) return;

    setSteps((prev) =>
      prev.map((s) =>
        s.id === editStep.id
          ? { ...s, title, description: editDescription.trim() || null }
          : s,
      ),
    );
    setEditStep(null);

    startTransition(async () => {
      const updated = await updateProjectStep(editStep.id, {
        title,
        description: editDescription.trim() || undefined,
      });
      setSteps((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    });
  }

  // ── Delete step ─────────────────────────────────────────────────────────────
  function handleDelete(id: string) {
    setSteps((prev) => prev.filter((s) => s.id !== id));
    startTransition(() => deleteProjectStep(id));
  }

  // ── Toggle step ─────────────────────────────────────────────────────────────
  function handleToggle(step: ProjectStepDTO) {
    if (step.completedAt) {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === step.id
            ? { ...s, completedAt: null, completionComment: null }
            : s,
        ),
      );
      startTransition(async () => {
        const updated = await toggleProjectStep(step.id, false);
        setSteps((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s)),
        );
      });
    } else {
      setCompletingStep(step);
      setCompletionComment("");
    }
  }

  async function handleCompleteConfirm() {
    if (!completingStep) return;
    const comment = completionComment.trim();
    const now = new Date();

    setSteps((prev) =>
      prev.map((s) =>
        s.id === completingStep.id
          ? { ...s, completedAt: now, completionComment: comment || null }
          : s,
      ),
    );
    setCompletingStep(null);
    setCompletionComment("");

    startTransition(async () => {
      const updated = await toggleProjectStep(
        completingStep.id,
        true,
        comment || undefined,
      );
      setSteps((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
    });
  }

  const completedCount = steps.filter((s) => s.completedAt).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-(family-name:--font-display) text-sm font-medium text-white tracking-[0.15em] uppercase">
            Plan du projet
          </h2>
          {steps.length > 0 && (
            <span className="text-xs text-[rgba(255,255,255,0.4)]">
              {completedCount}/{steps.length} étapes
            </span>
          )}
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          disabled={isPending}
          className="h-8 rounded-lg bg-[rgba(123,184,139,0.15)] text-[#7bb88b] border border-[rgba(123,184,139,0.3)] hover:bg-[rgba(123,184,139,0.25)]"
        >
          <Plus className="w-3 h-3 mr-1" />
          Ajouter
        </Button>
      </div>

      {/* Progress bar */}
      {steps.length > 0 && (
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className="h-1 flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: step.completedAt
                  ? `${statusColor}80`
                  : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
      )}

      {/* Add form */}
      {isAdding && (
        <div className="p-4 rounded-xl border border-[rgba(123,184,139,0.3)] bg-[rgba(123,184,139,0.05)] space-y-3">
          <Input
            autoFocus
            value={addTitle}
            onChange={(e) => setAddTitle(e.target.value)}
            placeholder="Titre de l'étape..."
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAdd()}
            className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white placeholder:text-[rgba(255,255,255,0.3)]"
          />
          <Textarea
            value={addDescription}
            onChange={(e) => setAddDescription(e.target.value)}
            placeholder="Description (optionnelle)..."
            rows={2}
            className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white placeholder:text-[rgba(255,255,255,0.3)] text-sm resize-none"
          />
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setAddTitle("");
                setAddDescription("");
              }}
              className="text-[rgba(255,255,255,0.4)] hover:text-white"
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!addTitle.trim()}
              className="bg-[rgba(123,184,139,0.15)] text-[#7bb88b] border border-[rgba(123,184,139,0.3)] hover:bg-[rgba(123,184,139,0.25)]"
            >
              Ajouter
            </Button>
          </div>
        </div>
      )}

      {/* Steps list */}
      {steps.length === 0 && !isAdding ? (
        <p className="text-sm text-[rgba(255,255,255,0.3)] italic py-4 text-center">
          Aucune étape. Ajoutez des étapes pour suivre la progression du projet.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={steps.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {steps.map((step) => (
                <SortableStep
                  key={step.id}
                  step={step}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  statusColor={statusColor}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={null}>
            {activeStep ? (
              <StepContent
                step={activeStep}
                statusColor={statusColor}
                isOverlay
                dragHandleProps={{}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editStep} onOpenChange={(o) => !o && setEditStep(null)}>
        <DialogContent className="max-w-md bg-[rgba(5,5,8,0.95)] border border-[rgba(123,184,139,0.2)] rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#7bb88b] to-transparent opacity-50" />
          <DialogHeader>
            <DialogTitle className="font-(family-name:--font-display) text-xl tracking-wider text-white">
              MODIFIER L&apos;ÉTAPE
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-[10px] text-[rgba(123,184,139,0.6)] uppercase tracking-[0.2em]">
                Titre
              </Label>
              <Input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleEdit()
                }
                className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-[rgba(123,184,139,0.6)] uppercase tracking-[0.2em]">
                Description
              </Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setEditStep(null)}
                className="text-[rgba(255,255,255,0.4)] hover:text-white"
              >
                Annuler
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!editTitle.trim()}
                className="bg-[rgba(123,184,139,0.15)] text-[#7bb88b] border border-[rgba(123,184,139,0.3)] hover:bg-[rgba(123,184,139,0.25)]"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Completion comment dialog */}
      <Dialog
        open={!!completingStep}
        onOpenChange={(o) => !o && setCompletingStep(null)}
      >
        <DialogContent className="max-w-md bg-[rgba(5,5,8,0.95)] border border-[rgba(123,184,139,0.2)] rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#7bb88b] to-transparent opacity-50" />
          <DialogHeader>
            <DialogTitle className="font-(family-name:--font-display) text-xl tracking-wider text-white">
              MARQUER COMME TERMINÉ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-[rgba(255,255,255,0.6)]">
              {completingStep?.title}
            </p>
            <div className="space-y-2">
              <Label className="text-[10px] text-[rgba(123,184,139,0.6)] uppercase tracking-[0.2em]">
                Commentaire (optionnel)
              </Label>
              <Textarea
                autoFocus
                value={completionComment}
                onChange={(e) => setCompletionComment(e.target.value)}
                placeholder="Notes sur cette étape terminée..."
                rows={3}
                className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white placeholder:text-[rgba(255,255,255,0.3)] resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setCompletingStep(null)}
                className="text-[rgba(255,255,255,0.4)] hover:text-white"
              >
                Annuler
              </Button>
              <Button
                onClick={handleCompleteConfirm}
                className="bg-[rgba(123,184,139,0.15)] text-[#7bb88b] border border-[rgba(123,184,139,0.3)] hover:bg-[rgba(123,184,139,0.25)]"
              >
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

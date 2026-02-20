"use client";

import { useState, cloneElement, isValidElement } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectSchema,
  ProjectFormValues,
  ProjectDTO,
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_OPTIONS,
} from "@/lib/types";
import { createProject, updateProject } from "@/actions/project";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FolderGit, Plus, Link2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectDialogProps {
  children?: React.ReactNode;
  projectToEdit?: ProjectDTO;
}

const STATUS_OPTIONS: {
  value: ProjectDTO["status"];
  label: string;
  color: string;
}[] = PROJECT_STATUS_OPTIONS.map((status) => ({
  value: status,
  label: PROJECT_STATUS_LABELS[status],
  color: PROJECT_STATUS_COLORS[status],
}));

export function ProjectDialog({ children, projectToEdit }: ProjectDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: projectToEdit
      ? {
          title: projectToEdit.title,
          description: projectToEdit.description || "",
          status: projectToEdit.status,
          links: projectToEdit.links.map((l) => ({
            id: l.id,
            title: l.title,
            url: l.url,
          })),
        }
      : {
          title: "",
          description: "",
          status: "IDEA",
          links: [],
        },
  });

  const { register, control, handleSubmit, reset, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const currentStatus = watch("status");

  async function onSubmit(data: ProjectFormValues) {
    try {
      if (projectToEdit) {
        await updateProject(projectToEdit.id, data);
      } else {
        await createProject(data);
      }
      setOpen(false);
      reset();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'enregistrement du projet");
    }
  }

  function handleAddLink() {
    append({ title: "", url: "" });
  }

  const triggerElement = isValidElement(children) ? (
    cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => setOpen(true),
    })
  ) : (
    <Button
      onClick={() => setOpen(true)}
      className={cn(
        "relative overflow-hidden rounded-xl px-6 py-3",
        "bg-transparent border border-[rgba(123,184,139,0.5)]",
        "text-[#7bb88b] font-medium tracking-wider text-sm",
        "hover:bg-[rgba(123,184,139,0.1)] hover:border-[#7bb88b]",
        "hover:shadow-[0_0_30px_rgba(123,184,139,0.3)]",
        "transition-all duration-500 group",
      )}
    >
      <Plus className="w-4 h-4 mr-2" />
      NOUVEAU PROJET
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerElement}
      <DialogContent
        className={cn(
          "max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto",
          "bg-[rgba(5,5,8,0.95)] border border-[rgba(123,184,139,0.2)]",
          "rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(123,184,139,0.1)]",
        )}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#7bb88b] to-transparent opacity-50" />

        <DialogHeader className="pb-6 border-b border-[rgba(255,255,255,0.08)]">
          <DialogTitle className="font-(family-name:--font-display) text-2xl tracking-wider text-white flex items-center gap-2">
            <FolderGit className="w-5 h-5 text-[#7bb88b]" />
            {projectToEdit ? "MODIFIER LE PROJET" : "NOUVEAU PROJET"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6">
          {/* Title */}
          <div className="space-y-3">
            <Label className="text-[10px] text-[rgba(123,184,139,0.6)] uppercase tracking-[0.2em]">
              Titre
            </Label>
            <Input
              {...register("title")}
              placeholder="Nom du projet..."
              className={cn(
                "rounded-xl h-11",
                "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                "text-white placeholder:text-[rgba(255,255,255,0.3)]",
              )}
            />
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="text-[10px] text-[rgba(123,184,139,0.6)] uppercase tracking-[0.2em]">
              Statut
            </Label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("status", option.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider transition-all duration-300 border",
                    currentStatus === option.value
                      ? "border-transparent text-white"
                      : "border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)] hover:border-[rgba(255,255,255,0.2)] hover:text-white",
                  )}
                  style={{
                    backgroundColor:
                      currentStatus === option.value
                        ? `${option.color}30`
                        : "transparent",
                    borderColor:
                      currentStatus === option.value
                        ? `${option.color}60`
                        : undefined,
                    boxShadow:
                      currentStatus === option.value
                        ? `0 0 15px ${option.color}30`
                        : undefined,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label className="text-[10px] text-[rgba(123,184,139,0.6)] uppercase tracking-[0.2em]">
              Description
            </Label>
            <Textarea
              {...register("description")}
              placeholder="Décrivez votre projet..."
              className={cn(
                "min-h-32 rounded-xl",
                "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                "text-white placeholder:text-[rgba(255,255,255,0.3)]",
                "focus:border-[rgba(123,184,139,0.3)] focus:shadow-[0_0_20px_rgba(123,184,139,0.1)]",
                "leading-relaxed",
              )}
            />
          </div>

          {/* Links Section */}
          <div className="space-y-3 border-t border-[rgba(255,255,255,0.05)] pt-6">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-[rgba(123,184,139,0.6)] uppercase tracking-[0.2em] flex items-center gap-2">
                <Link2 className="w-3 h-3" />
                Liens & Ressources
              </Label>
              <Button
                type="button"
                onClick={handleAddLink}
                size="sm"
                className="h-8 rounded-lg bg-[rgba(123,184,139,0.15)] text-[#7bb88b] border border-[rgba(123,184,139,0.3)] hover:bg-[rgba(123,184,139,0.25)]"
              >
                <Plus className="w-3 h-3 mr-1" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <Input
                    {...register(`links.${index}.title`)}
                    placeholder="Titre du lien..."
                    className={cn(
                      "flex-1 rounded-xl h-10",
                      "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                      "text-white placeholder:text-[rgba(255,255,255,0.3)] text-sm",
                    )}
                  />
                  <Input
                    {...register(`links.${index}.url`)}
                    placeholder="https://..."
                    className={cn(
                      "flex-2 rounded-xl h-10",
                      "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
                      "text-white placeholder:text-[rgba(255,255,255,0.3)] text-sm",
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 p-0 rounded-xl text-[rgba(255,255,255,0.4)] hover:text-[#ff3864] hover:bg-[rgba(255,56,100,0.1)]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {fields.length === 0 && (
                <p className="text-sm text-[rgba(255,255,255,0.3)] italic">
                  Aucun lien ajouté. Cliquez sur &quot;Ajouter&quot; pour
                  ajouter des ressources.
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 border-t border-[rgba(255,255,255,0.05)] pt-6">
            <Button
              type="submit"
              className={cn(
                "rounded-xl h-10 px-6",
                "bg-[rgba(123,184,139,0.15)] text-[#7bb88b] border border-[rgba(123,184,139,0.4)]",
                "hover:bg-[rgba(123,184,139,0.25)] hover:shadow-[0_0_30px_rgba(123,184,139,0.2)]",
                "transition-all duration-300 tracking-wider",
              )}
            >
              {projectToEdit ? "ENREGISTRER" : "CRÉER LE PROJET"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

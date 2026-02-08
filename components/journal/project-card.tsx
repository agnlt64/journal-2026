"use client";

import { ProjectDTO, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from "@/lib/types";
import { ProjectDialog } from "./project-dialog";
import { deleteProject, updateProjectStatus } from "@/actions/project";
import { FolderGit, ExternalLink, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProjectCardProps {
    project: ProjectDTO;
    index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const statusColor = PROJECT_STATUS_COLORS[project.status];
    const statusLabel = PROJECT_STATUS_LABELS[project.status];

    async function handleDelete() {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;
        setIsDeleting(true);
        try {
            await deleteProject(project.id);
        } finally {
            setIsDeleting(false);
        }
    }

    async function handleStatusChange(newStatus: ProjectDTO["status"]) {
        await updateProjectStatus(project.id, newStatus);
    }

    return (
        <div
            className={cn(
                "group relative rounded-xl transition-all duration-500 overflow-hidden",
                "bg-[rgba(10,10,18,0.5)] border",
                "hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]",
                "animate-fade-in-up"
            )}
            style={{ 
                animationDelay: `${index * 50}ms`,
                borderColor: `${statusColor}30`
            }}
        >
            {/* Top accent line */}
            <div 
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background: `linear-gradient(90deg, transparent, ${statusColor}50, transparent)`
                }}
            />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center border"
                            style={{ 
                                backgroundColor: `${statusColor}15`,
                                borderColor: `${statusColor}30`
                            }}
                        >
                            <FolderGit className="w-5 h-5" style={{ color: statusColor }} />
                        </div>
                        <div>
                            <h3 className="font-(family-name:--font-display) text-base font-medium text-white tracking-wide">
                                {project.title}
                            </h3>
                            <span 
                                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border"
                                style={{
                                    backgroundColor: `${statusColor}15`,
                                    borderColor: `${statusColor}30`,
                                    color: statusColor
                                }}
                            >
                                {statusLabel}
                            </span>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ProjectDialog projectToEdit={project}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 rounded-lg hover:bg-[rgba(123,184,139,0.1)] border border-transparent hover:border-[rgba(123,184,139,0.3)]"
                            >
                                <Edit className="w-4 h-4 text-[rgba(123,184,139,0.7)]" />
                            </Button>
                        </ProjectDialog>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-8 h-8 rounded-lg hover:bg-[rgba(255,56,100,0.1)] border border-transparent hover:border-[rgba(255,56,100,0.3)]"
                        >
                            <Trash2 className="w-4 h-4 text-[rgba(255,56,100,0.7)]" />
                        </Button>
                    </div>
                </div>

                {/* Description */}
                {project.description && (
                    <p className="text-sm text-[rgba(255,255,255,0.6)] leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                    </p>
                )}

                {/* Links */}
                {project.links.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">
                            Liens & Ressources
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs",
                                        "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]",
                                        "text-[rgba(255,255,255,0.6)] hover:text-[#00f5ff]",
                                        "hover:border-[rgba(0,245,255,0.3)] hover:bg-[rgba(0,245,255,0.05)]",
                                        "transition-all duration-300"
                                    )}
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    {link.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Status Quick Change */}
                <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">
                            Changer le statut:
                        </span>
                        <div className="flex gap-1">
                            {["DRAFT", "IN_PROGRESS", "POC_DONE", "MVP_DONE", "DONE"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status as ProjectDTO["status"])}
                                    className={cn(
                                        "w-6 h-6 rounded border transition-all duration-300",
                                        project.status === status 
                                            ? "border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                                            : "border-transparent hover:border-[rgba(255,255,255,0.3)]"
                                    )}
                                    style={{
                                        backgroundColor: PROJECT_STATUS_COLORS[status as ProjectDTO["status"]],
                                    }}
                                    title={PROJECT_STATUS_LABELS[status as ProjectDTO["status"]]}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

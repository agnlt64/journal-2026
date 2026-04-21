"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      router.push("/projets");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs border border-[rgba(255,56,100,0.2)] text-[rgba(255,56,100,0.6)] hover:bg-[rgba(255,56,100,0.1)] hover:text-[#ff3864] hover:border-[rgba(255,56,100,0.4)] transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Supprimer
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm bg-[rgba(5,5,8,0.95)] border border-[rgba(255,56,100,0.2)] rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#ff3864] to-transparent opacity-40" />
          <DialogHeader>
            <DialogTitle className="font-(family-name:--font-display) text-xl tracking-wider text-white">
              SUPPRIMER LE PROJET
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[rgba(255,255,255,0.5)] mt-2">
            Cette action est irréversible. Toutes les étapes et liens associés
            seront supprimés.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
              className="text-[rgba(255,255,255,0.4)] hover:text-white"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-[rgba(255,56,100,0.15)] text-[#ff3864] border border-[rgba(255,56,100,0.4)] hover:bg-[rgba(255,56,100,0.25)]"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

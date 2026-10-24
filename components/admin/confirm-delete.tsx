"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import type { ActionResult } from "@/app/admin/actions/common";

/** Botón de borrado con modal de confirmación. */
export function ConfirmDelete({
  label,
  message,
  onConfirm,
  onDeleted,
}: {
  label: string;
  message: string;
  onConfirm: () => Promise<ActionResult>;
  onDeleted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="text-accent-strong"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" aria-hidden />
        {label}
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="¿Borrar?"
        description={message}
      >
        <div className="flex flex-col gap-3">
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const result = await onConfirm();
              setBusy(false);
              if (result.ok) {
                setOpen(false);
                toast.success("Borrado");
                onDeleted?.();
              } else {
                toast.error(result.error);
              }
            }}
          >
            {busy ? "Borrando…" : "Sí, borrar"}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </>
  );
}

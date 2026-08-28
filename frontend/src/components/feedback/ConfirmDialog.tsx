import { X } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  pending,
  danger = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  pending?: boolean;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open && !pending) onCancel();
      }}
    >
      <AlertDialogContent className="catalog-dialog">
        <AlertDialogHeader className="dialog-header">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogCancel asChild disabled={pending}>
            <Button
              aria-label="Fermer"
              size="icon"
              type="button"
              variant="ghost"
            >
              <X aria-hidden="true" />
            </Button>
          </AlertDialogCancel>
        </AlertDialogHeader>
        <AlertDialogDescription asChild>
          <div className="dialog-body">{children}</div>
        </AlertDialogDescription>
        <AlertDialogFooter className="dialog-actions">
          <AlertDialogCancel asChild disabled={pending}>
            <Button
              className="secondary-button"
              type="button"
              variant="secondary"
            >
              Annuler
            </Button>
          </AlertDialogCancel>
          <Button
            className={danger ? "danger-button" : "primary-button"}
            disabled={pending}
            onClick={onConfirm}
            type="button"
            variant={danger ? "destructive" : "default"}
          >
            {pending ? "Traitement…" : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

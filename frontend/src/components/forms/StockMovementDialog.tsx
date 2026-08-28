import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, X } from "@phosphor-icons/react";
import { useState } from "react";
import { inventoryApi } from "../../api/inventory-api";
import type { InventoryMovementType, StockItem } from "../../types/api";
import { statusLabel } from "../../utils/format";
import { InlineFeedback } from "../feedback/PageState";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const movementTypes: InventoryMovementType[] = [
  "INITIAL_STOCK",
  "PURCHASE",
  "CUSTOMER_RETURN",
  "SUPPLIER_RETURN",
  "DAMAGE",
  "CORRECTION",
];
const outgoingTypes = new Set<InventoryMovementType>([
  "SUPPLIER_RETURN",
  "DAMAGE",
]);

export function StockMovementDialog({
  inventory,
  onClose,
}: {
  inventory: StockItem[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [productId, setProductId] = useState(inventory[0]?.productId ?? 0);
  const [type, setType] = useState<InventoryMovementType>("PURCHASE");
  const [quantityInput, setQuantityInput] = useState("");
  const [reason, setReason] = useState("");
  const [step, setStep] = useState<"form" | "confirm">("form");
  const selected =
    inventory.find((item) => item.productId === productId) ?? inventory[0];
  const unsigned = Number(quantityInput);
  const quantity =
    type === "CORRECTION"
      ? unsigned
      : outgoingTypes.has(type)
        ? -Math.abs(unsigned)
        : Math.abs(unsigned);
  const resultingStock = selected.currentStock + quantity;
  const valid =
    Number.isInteger(unsigned) &&
    unsigned !== 0 &&
    reason.trim().length > 0 &&
    resultingStock >= 0;
  const record = useMutation({
    mutationFn: () =>
      inventoryApi.record({ productId, type, quantity, reason: reason.trim() }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onClose();
    },
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !record.isPending) onClose();
      }}
    >
      <DialogContent className="catalog-modal stock-movement-modal">
        <header>
          <div>
            <p>{step === "form" ? "Nouveau mouvement" : "Étape 2 sur 2"}</p>
            <DialogTitle id="stock-movement-title">
              {step === "form"
                ? "Enregistrer un mouvement de stock"
                : "Confirmer le mouvement"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Saisissez puis confirmez un mouvement qui sera enregistré dans
              l’historique de stock.
            </DialogDescription>
          </div>
          <DialogClose asChild disabled={record.isPending}>
            <Button
              aria-label="Fermer"
              className="catalog-icon-button"
              size="icon"
              type="button"
              variant="ghost"
            >
              <X aria-hidden="true" />
            </Button>
          </DialogClose>
        </header>
        {step === "form" ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (valid) setStep("confirm");
            }}
          >
            <div className="stock-movement-form">
              <Label className="stock-movement-field stock-movement-field--wide">
                <span>Produit</span>
                <Select
                  value={String(productId)}
                  onValueChange={(value) => setProductId(Number(value))}
                >
                  <SelectTrigger aria-label="Produit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map((item) => (
                      <SelectItem
                        key={item.productId}
                        value={String(item.productId)}
                      >
                        {item.title} — {item.sku}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>
              <Label className="stock-movement-field">
                <span>Type de mouvement</span>
                <Select
                  value={type}
                  onValueChange={(value) => {
                    setType(value as InventoryMovementType);
                    setQuantityInput("");
                  }}
                >
                  <SelectTrigger aria-label="Type de mouvement">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {movementTypes.map((value) => (
                      <SelectItem key={value} value={value}>
                        {statusLabel(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>
              <Label className="stock-movement-field">
                <span>
                  {type === "CORRECTION" ? "Variation signée" : "Quantité"}
                </span>
                <Input
                  aria-invalid={
                    quantityInput !== "" &&
                    (!Number.isInteger(unsigned) || unsigned === 0)
                  }
                  inputMode="numeric"
                  min={type === "CORRECTION" ? undefined : 1}
                  type="number"
                  value={quantityInput}
                  onChange={(event) => setQuantityInput(event.target.value)}
                />
              </Label>
              <Label className="stock-movement-field stock-movement-field--wide">
                <span>Raison</span>
                <Textarea
                  aria-invalid={reason.length > 0 && !reason.trim()}
                  rows={3}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </Label>
            </div>
            <div
              aria-live="polite"
              className={`movement-impact-card${resultingStock < 0 ? " is-danger" : ""}`}
            >
              <div>
                <span>Effet du mouvement</span>
                <p>
                  Le backend additionne la variation au stock courant ; chaque
                  modification crée un mouvement audité.
                </p>
              </div>
              <div className="movement-stock-equation">
                <span>
                  <small>Stock actuel</small>
                  <strong>{selected.currentStock}</strong>
                </span>
                <b>{quantity >= 0 ? "+" : "−"}</b>
                <span>
                  <small>Variation</small>
                  <strong>{Math.abs(quantity) || "—"}</strong>
                </span>
                <b>=</b>
                <span>
                  <small>Stock résultant</small>
                  <strong>{quantityInput ? resultingStock : "—"}</strong>
                </span>
              </div>
            </div>
            {resultingStock < 0 ? (
              <InlineFeedback tone="error">
                Ce mouvement produirait un stock négatif et ne peut pas être
                soumis.
              </InlineFeedback>
            ) : null}
            <footer className="stock-movement-actions">
              <DialogClose asChild>
                <Button
                  className="catalog-secondary-button"
                  variant="secondary"
                >
                  Annuler
                </Button>
              </DialogClose>
              <Button
                className="catalog-primary-button"
                disabled={!valid}
                type="submit"
              >
                Vérifier le mouvement
              </Button>
            </footer>
          </form>
        ) : (
          <div className="movement-confirmation">
            <div className="movement-confirmation-intro">
              <CheckCircle aria-hidden="true" />
              <div>
                <h3>Vérifiez avant d’enregistrer</h3>
                <p>Le stock sera modifié immédiatement après confirmation.</p>
              </div>
            </div>
            <dl>
              <div>
                <dt>Produit</dt>
                <dd>
                  {selected.title}
                  <small>{selected.sku}</small>
                </dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{statusLabel(type)}</dd>
              </div>
              <div>
                <dt>Raison</dt>
                <dd>{reason}</dd>
              </div>
            </dl>
            <div className="movement-confirmation-change">
              <span>
                <small>Stock actuel</small>
                <strong>{selected.currentStock}</strong>
              </span>
              <span>
                <small>Variation</small>
                <strong>
                  {quantity > 0 ? "+" : ""}
                  {quantity}
                </strong>
              </span>
              <span>
                <small>Stock résultant</small>
                <strong>{resultingStock}</strong>
              </span>
            </div>
            {record.isError ? (
              <InlineFeedback tone="error">
                {record.error.message}
              </InlineFeedback>
            ) : null}
            <footer className="stock-movement-actions">
              <Button
                className="catalog-secondary-button"
                disabled={record.isPending}
                onClick={() => setStep("form")}
                type="button"
                variant="secondary"
              >
                Modifier
              </Button>
              <Button
                className="catalog-primary-button"
                disabled={record.isPending}
                onClick={() => record.mutate()}
                type="button"
              >
                {record.isPending
                  ? "Enregistrement…"
                  : "Confirmer et enregistrer"}
              </Button>
            </footer>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

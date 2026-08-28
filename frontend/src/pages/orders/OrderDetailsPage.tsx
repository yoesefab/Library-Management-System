import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Prohibit } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ordersApi } from "../../api/orders-api";
import { ConfirmDialog } from "../../components/feedback/ConfirmDialog";
import { PageState } from "../../components/feedback/PageState";
import {
  formatCurrency,
  formatDateTime,
  statusLabel,
} from "../../utils/format";

export function OrderDetailsPage() {
  const id = Number(useParams().id);
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState(false);
  const order = useQuery({
    queryKey: ["order", id],
    queryFn: ({ signal }) => ordersApi.get(id, signal),
  });
  const cancel = useMutation({
    mutationFn: () => ordersApi.setStatus(id, "CANCELLED"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await order.refetch();
      setConfirm(false);
    },
  });
  if (order.isPending)
    return (
      <PageState
        loading
        title="Chargement de la commande"
        message="Récupération du détail…"
      />
    );
  if (order.isError)
    return (
      <PageState title="Commande introuvable" message={order.error.message} />
    );
  const item = order.data;
  const cancellable = item.status === "PENDING" || item.status === "PROCESSING";
  return (
    <section className="order-details-page">
      <div className="product-details-heading">
        <div>
          <Link className="back-link" to="/orders">
            <ArrowLeft aria-hidden="true" />
            Retour aux commandes
          </Link>
          <p className="eyebrow">
            {item.externalReference || `CMD-${item.id}`}
          </p>
          <h2>Détails de la commande</h2>
          <p>Créée le {formatDateTime(item.createdAt)}</p>
        </div>
        <button
          className="danger-button"
          disabled={!cancellable}
          onClick={() => setConfirm(true)}
          title={
            !cancellable
              ? "Seules les commandes en attente ou en traitement peuvent être annulées."
              : undefined
          }
          type="button"
        >
          <Prohibit aria-hidden="true" />
          Annuler la commande
        </button>
      </div>
      <section className="product-kpi-grid">
        <article>
          <span>Statut</span>
          <strong>{statusLabel(item.status)}</strong>
        </article>
        <article>
          <span>Total</span>
          <strong>{formatCurrency(item.totalAmount)}</strong>
        </article>
        <article>
          <span>Ville</span>
          <strong>{item.customerCity || "—"}</strong>
        </article>
        <article>
          <span>Source</span>
          <strong>
            {item.source === "MANUAL" ? "Manuelle" : "Import CSV"}
          </strong>
        </article>
      </section>
      <section className="dashboard-table-panel">
        <h3>Articles</h3>
        <div className="compact-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Remise</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {item.items.map((line) => (
                <tr key={line.id}>
                  <td>
                    {line.title}
                    <small>{line.sku}</small>
                  </td>
                  <td>{line.quantity}</td>
                  <td>{formatCurrency(line.unitPrice)}</td>
                  <td>{formatCurrency(line.discount)}</td>
                  <td>{formatCurrency(line.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {confirm ? (
        <ConfirmDialog
          danger
          title="Annuler la commande"
          confirmLabel="Confirmer l’annulation"
          pending={cancel.isPending}
          onCancel={() => setConfirm(false)}
          onConfirm={() => cancel.mutate()}
        >
          <p>
            L’annulation déclenchera les mouvements de retour prévus par le
            backend. Cette action est auditée.
          </p>
          {cancel.isError ? <p role="alert">{cancel.error.message}</p> : null}
        </ConfirmDialog>
      ) : null}
    </section>
  );
}

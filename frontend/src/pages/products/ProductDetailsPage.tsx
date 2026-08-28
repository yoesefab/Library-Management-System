import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, PencilSimple, Prohibit } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../app/auth-context";
import { inventoryApi } from "../../api/inventory-api";
import { productsApi } from "../../api/products-api";
import { ConfirmDialog } from "../../components/feedback/ConfirmDialog";
import { PageState } from "../../components/feedback/PageState";
import {
  formatCurrency,
  formatDateTime,
  statusLabel,
} from "../../utils/format";

export function ProductDetailsPage() {
  const id = Number(useParams().id);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState(false);
  const product = useQuery({
    queryKey: ["product", id],
    queryFn: ({ signal }) => productsApi.get(id, signal),
    enabled: Number.isFinite(id),
  });
  const movements = useQuery({
    queryKey: ["movements", id],
    queryFn: ({ signal }) => inventoryApi.movements(id, 0, signal),
    enabled: Number.isFinite(id),
  });
  const deactivate = useMutation({
    mutationFn: () => productsApi.deactivate(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await product.refetch();
      setConfirm(false);
    },
  });
  if (product.isPending)
    return (
      <PageState
        loading
        title="Chargement du produit"
        message="Récupération de la fiche détaillée…"
      />
    );
  if (product.isError)
    return (
      <PageState title="Produit introuvable" message={product.error.message} />
    );
  const item = product.data;
  const canWrite = user?.role !== "STOCK_EMPLOYEE";
  return (
    <section className="product-details-page">
      <div className="product-details-heading">
        <div>
          <Link className="back-link" to="/products">
            <ArrowLeft aria-hidden="true" />
            Retour au catalogue
          </Link>
          <p className="eyebrow">{item.sku}</p>
          <h2>{item.title}</h2>
          <p>{item.description || "Aucune description renseignée."}</p>
        </div>
        <div className="product-details-actions">
          {canWrite ? (
            <>
              <Link className="secondary-button" to={`/products/${id}/edit`}>
                <PencilSimple aria-hidden="true" />
                Modifier
              </Link>
              <button
                className="danger-button"
                disabled={!item.active}
                onClick={() => setConfirm(true)}
                title={
                  !item.active
                    ? "Le backend ne propose pas la réactivation."
                    : undefined
                }
                type="button"
              >
                <Prohibit aria-hidden="true" />
                Désactiver
              </button>
            </>
          ) : null}
        </div>
      </div>
      <section className="product-kpi-grid">
        <article>
          <span>Prix de vente</span>
          <strong>{formatCurrency(item.sellingPrice)}</strong>
        </article>
        <article>
          <span>Coût d’achat</span>
          <strong>
            {item.purchaseCost == null
              ? "—"
              : formatCurrency(item.purchaseCost)}
          </strong>
        </article>
        <article>
          <span>Seuil minimum</span>
          <strong>{item.minimumStockThreshold}</strong>
        </article>
        <article>
          <span>Statut</span>
          <strong>{item.active ? "Actif" : "Inactif"}</strong>
        </article>
      </section>
      <section className="product-details-grid">
        <article className="detail-panel">
          <h3>Informations bibliographiques</h3>
          <dl>
            <div>
              <dt>ISBN</dt>
              <dd>{item.isbn || "—"}</dd>
            </div>
            <div>
              <dt>Langue</dt>
              <dd>{item.language.toUpperCase()}</dd>
            </div>
            <div>
              <dt>Catégorie</dt>
              <dd>{item.category?.name ?? "—"}</dd>
            </div>
            <div>
              <dt>Éditeur</dt>
              <dd>{item.publisher?.name ?? "—"}</dd>
            </div>
            <div>
              <dt>Auteurs</dt>
              <dd>
                {item.authors.map((author) => author.name).join(", ") || "—"}
              </dd>
            </div>
          </dl>
        </article>
        <article className="detail-panel">
          <h3>Approvisionnement</h3>
          <dl>
            <div>
              <dt>Fournisseur</dt>
              <dd>{item.supplier?.name ?? "—"}</dd>
            </div>
            <div>
              <dt>Délai</dt>
              <dd>
                {item.supplierLeadTimeDays == null
                  ? "—"
                  : `${item.supplierLeadTimeDays} jours`}
              </dd>
            </div>
            <div>
              <dt>Dernière modification</dt>
              <dd>{formatDateTime(item.updatedAt)}</dd>
            </div>
          </dl>
        </article>
      </section>
      <section className="dashboard-table-panel">
        <h3>Mouvements de stock récents</h3>
        {movements.isPending ? (
          <p role="status">Chargement…</p>
        ) : movements.isError ? (
          <p role="alert">{movements.error.message}</p>
        ) : movements.data.content.length ? (
          <div className="compact-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Quantité</th>
                  <th>Stock résultant</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                {movements.data.content.map((movement) => (
                  <tr key={movement.id}>
                    <td>{formatDateTime(movement.occurredAt)}</td>
                    <td>{statusLabel(movement.type)}</td>
                    <td>{movement.quantity}</td>
                    <td>{movement.resultingStock}</td>
                    <td>{movement.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aucun mouvement pour ce produit.</p>
        )}
      </section>
      {confirm ? (
        <ConfirmDialog
          danger
          title="Désactiver le produit"
          confirmLabel="Désactiver"
          pending={deactivate.isPending}
          onCancel={() => setConfirm(false)}
          onConfirm={() => deactivate.mutate()}
        >
          <p>
            Cette action conserve tout l’historique et désactive uniquement les
            opérations futures.
          </p>
          {deactivate.isError ? (
            <p role="alert">{deactivate.error.message}</p>
          ) : null}
        </ConfirmDialog>
      ) : null}
    </section>
  );
}

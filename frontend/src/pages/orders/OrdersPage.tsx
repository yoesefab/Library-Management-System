import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Plus, X } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api/orders-api";
import { productsApi } from "../../api/products-api";
import { InlineFeedback, PageState } from "../../components/feedback/PageState";
import { Pagination } from "../../components/tables/Pagination";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../components/ui/dialog";
import type { OrderStatus } from "../../types/api";
import {
  formatCurrency,
  formatDateTime,
  statusLabel,
} from "../../utils/format";

function ManualOrderDialog({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const products = useQuery({
    queryKey: ["products", "order-select"],
    queryFn: ({ signal }) =>
      productsApi.list({ active: true, size: 100 }, signal),
  });
  const [productId, setProductId] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [city, setCity] = useState("");
  const selected =
    products.data?.content.find((item) => item.id === productId) ??
    products.data?.content[0];
  const create = useMutation({
    mutationFn: () =>
      ordersApi.create({
        orderDate: new Date().toISOString(),
        status: "PENDING",
        customerCity: city || undefined,
        items: [
          {
            productId: selected!.id,
            quantity,
            unitPrice: selected!.sellingPrice,
            discount: 0,
          },
        ],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      onClose();
    },
  });
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="catalog-modal">
        <header>
          <div>
            <p>Nouvelle commande</p>
            <DialogTitle asChild>
              <h2>Créer une commande manuelle</h2>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Saisissez le produit, la quantité et la ville du client.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              aria-label="Fermer"
              size="icon"
              type="button"
              variant="ghost"
            >
              <X aria-hidden="true" />
            </Button>
          </DialogClose>
        </header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (selected) create.mutate();
          }}
        >
          <div className="stock-movement-form">
            <label className="stock-movement-field stock-movement-field--wide">
              <span>Produit</span>
              <select
                value={selected?.id ?? ""}
                onChange={(event) => setProductId(Number(event.target.value))}
              >
                {products.data?.content.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} — {formatCurrency(item.sellingPrice)}
                  </option>
                ))}
              </select>
            </label>
            <label className="stock-movement-field">
              <span>Quantité</span>
              <input
                min={1}
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
            <label className="stock-movement-field">
              <span>Ville du client</span>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </label>
          </div>
          {create.isError ? (
            <InlineFeedback tone="error">{create.error.message}</InlineFeedback>
          ) : null}
          <footer className="stock-movement-actions">
            <Button
              className="catalog-secondary-button"
              onClick={onClose}
              type="button"
            >
              Annuler
            </Button>
            <Button
              className="catalog-primary-button"
              disabled={!selected || quantity < 1 || create.isPending}
              type="submit"
            >
              {create.isPending ? "Création…" : "Créer la commande"}
            </Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function OrdersPage() {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState(false);
  const orders = useQuery({
    queryKey: ["orders", status, page],
    queryFn: ({ signal }) => ordersApi.list(status || undefined, page, signal),
    placeholderData: (previous) => previous,
  });
  return (
    <section className="orders-management">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Ventes</p>
          <h2>Commandes</h2>
          <p>Suivez les commandes réelles et leurs mouvements de stock.</p>
        </div>
        <Button
          className="primary-button"
          onClick={() => setDialog(true)}
          type="button"
        >
          <Plus aria-hidden="true" />
          Commande manuelle
        </Button>
      </div>
      <div className="catalog-toolbar">
        <label>
          <span>Statut</span>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as OrderStatus | "");
              setPage(0);
            }}
          >
            <option value="">Tous</option>
            {(
              [
                "PENDING",
                "PROCESSING",
                "COMPLETED",
                "CANCELLED",
                "REFUNDED",
              ] as OrderStatus[]
            ).map((value) => (
              <option key={value} value={value}>
                {statusLabel(value)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {orders.isPending ? (
        <PageState
          loading
          title="Chargement des commandes"
          message="Récupération des ventes…"
        />
      ) : orders.isError ? (
        <PageState
          title="Commandes indisponibles"
          message={orders.error.message}
        />
      ) : orders.data.content.length ? (
        <>
          <div className="catalog-table-scroll">
            <table className="catalog-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Date</th>
                  <th>Ville</th>
                  <th>Source</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.data.content.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>
                        {order.externalReference || `CMD-${order.id}`}
                      </strong>
                    </td>
                    <td>{formatDateTime(order.orderDate)}</td>
                    <td>{order.customerCity || "—"}</td>
                    <td>
                      {order.source === "MANUAL" ? "Manuelle" : "Import CSV"}
                    </td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span className="status-badge">
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      <Link
                        aria-label={`Voir la commande ${order.id}`}
                        to={`/orders/${order.id}`}
                      >
                        <Eye aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={orders.data.page}
            totalPages={orders.data.totalPages}
            totalElements={orders.data.totalElements}
            onChange={setPage}
          />
        </>
      ) : (
        <PageState
          title="Aucune commande"
          message="Aucune commande ne correspond au statut sélectionné."
        />
      )}
      {dialog ? <ManualOrderDialog onClose={() => setDialog(false)} /> : null}
    </section>
  );
}

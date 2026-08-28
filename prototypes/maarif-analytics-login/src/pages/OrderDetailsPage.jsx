import { useEffect, useId, useState } from "react";
import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowClockwise,
  ArrowRight,
  ArrowUp,
  Bell,
  Books,
  BookOpen,
  CalendarBlank,
  CaretDown,
  ChartBar,
  ChartLineUp,
  CheckCircle,
  CircleNotch,
  CloudArrowUp,
  Cube,
  CurrencyDollar,
  DownloadSimple,
  FileText,
  FileCsv,
  FloppyDisk,
  GearSix,
  Eye,
  List,
  MapPin,
  MagnifyingGlass,
  Key,
  PencilSimple,
  Plus,
  Prohibit,
  ShoppingBagOpen,
  ShoppingCart,
  Shield,
  SignOut,
  TrendUp,
  Truck,
  User,
  UserPlus,
  Users,
  Warning,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


import { formatMad } from "../shared/catalogData.js";
import { detailsForOrder, OrderStatus } from "../shared/orderData.jsx";

function CancelOrderDialog({ itemCount, onCancel, onConfirm, order }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const confirm = () => {
    setIsCancelling(true);
    window.setTimeout(onConfirm, 650);
  };
  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isCancelling && onCancel()
      }
    >
      <section
        aria-labelledby="cancel-order-title"
        aria-modal="true"
        className="catalog-modal catalog-confirm-modal"
        role="alertdialog"
      >
        <span className="catalog-confirm-icon">
          <Prohibit aria-hidden="true" />
        </span>
        <div>
          <h2 id="cancel-order-title">Annuler {order.reference} ?</h2>
          <p>
            La commande passera au statut <strong>Annulée</strong> et{" "}
            {itemCount} exemplaire{itemCount > 1 ? "s" : ""} seront réintégrés
            au stock par des mouvements traçables.
          </p>
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            disabled={isCancelling}
            onClick={onCancel}
            type="button"
          >
            Retour
          </button>
          <button
            className="catalog-danger-button"
            disabled={isCancelling}
            onClick={confirm}
            type="button"
          >
            {isCancelling ? (
              <>
                <CircleNotch aria-hidden="true" className="spinner" />
                Annulation…
              </>
            ) : (
              "Confirmer l’annulation"
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}

export function OrderDetailsPage({ onBack, order, role = "Gestionnaire" }) {
  const details = detailsForOrder(order);
  const [status, setStatus] = useState(order.status);
  const [movements, setMovements] = useState(details.movements);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [dateLabel, timeLabel] = order.date.split(" à ");
  const canCancel =
    ["Administrateur", "Gestionnaire"].includes(role) &&
    ["Brouillon", "En préparation"].includes(status);

  const cancelOrder = () => {
    const returnMovements = details.lines.map((line, index) => {
      const originalMovement = details.movements.find(
        (movement) => movement.sku === line.sku,
      );
      return {
        id: `MVT-2026-087${index + 1}`,
        date: "27 août 2026 à 20:42",
        product: line.product,
        sku: line.sku,
        type: "Retour après annulation",
        quantity: line.quantity,
        balance: (originalMovement?.balance ?? 0) + line.quantity,
      };
    });
    setMovements([...returnMovements, ...details.movements]);
    setStatus("Annulée");
    setShowCancelDialog(false);
    setFeedback(
      `Commande ${order.reference} annulée. ${order.itemCount} exemplaires ont été réintégrés au stock.`,
    );
  };

  return (
    <div className="product-details order-details">
      {feedback ? (
        <div
          className="product-feedback product-feedback--success"
          role="status"
        >
          <CheckCircle aria-hidden="true" weight="fill" />
          <span>{feedback}</span>
          <button
            aria-label="Fermer le message"
            onClick={() => setFeedback("")}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <header className="product-detail-heading order-detail-heading">
        <div>
          <button className="product-back-link" onClick={onBack} type="button">
            <ArrowLeft aria-hidden="true" />
            Retour aux commandes
          </button>
          <div className="product-detail-title-row">
            <div>
              <p>Commande client</p>
              <h2>{order.reference}</h2>
              <span>
                {order.itemCount} article{order.itemCount > 1 ? "s" : ""} ·{" "}
                {order.source}
              </span>
            </div>
            <OrderStatus status={status} />
          </div>
        </div>
        <div className="product-detail-actions">
          {canCancel ? (
            <button
              className="product-disable-button"
              onClick={() => setShowCancelDialog(true)}
              type="button"
            >
              <Prohibit aria-hidden="true" />
              Annuler la commande
            </button>
          ) : null}
        </div>
      </header>

      <section
        aria-label="Résumé de la commande"
        className="product-detail-kpis order-detail-kpis"
      >
        <article>
          <CalendarBlank aria-hidden="true" />
          <span>Date</span>
          <strong>{dateLabel}</strong>
          <small>à {timeLabel}</small>
        </article>
        <article>
          <ShoppingCart aria-hidden="true" />
          <span>Source</span>
          <strong>{order.source}</strong>
          <small>Canal de création</small>
        </article>
        <article>
          <MapPin aria-hidden="true" />
          <span>Ville du client</span>
          <strong>{order.city}</strong>
          <small>Maroc</small>
        </article>
        <article>
          <CurrencyDollar aria-hidden="true" />
          <span>Montant total</span>
          <strong>{formatMad(order.total)}</strong>
          <small>Remises incluses</small>
        </article>
      </section>

      <article className="product-detail-panel order-lines-panel">
        <header>
          <Books aria-hidden="true" />
          <div>
            <h3>Articles de la commande</h3>
            <p>
              {details.lines.length} ligne{details.lines.length > 1 ? "s" : ""}{" "}
              · {order.itemCount} exemplaire{order.itemCount > 1 ? "s" : ""}
            </p>
          </div>
        </header>
        <div className="product-detail-table-scroll order-lines-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Quantité</th>
                <th scope="col">Prix unitaire</th>
                <th scope="col">Remise</th>
                <th scope="col">Total ligne</th>
              </tr>
            </thead>
            <tbody>
              {details.lines.map((line) => (
                <tr key={line.sku}>
                  <td>
                    <strong>{line.product}</strong>
                    <small>{line.sku}</small>
                  </td>
                  <td>{line.quantity}</td>
                  <td>{formatMad(line.unitPrice)}</td>
                  <td>{line.discount ? `${line.discount} %` : "—"}</td>
                  <td>{formatMad(line.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">Total de la commande</td>
                <td>{formatMad(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </article>

      <article className="product-detail-panel inventory-timeline-panel order-movements-panel">
        <header>
          <Archive aria-hidden="true" />
          <div>
            <h3>Mouvements de stock associés</h3>
            <p>
              {movements.length} mouvement{movements.length > 1 ? "s" : ""} lié
              {movements.length > 1 ? "s" : ""} à {order.reference}
            </p>
          </div>
        </header>
        {movements.length ? (
          <ol>
            {movements.map((movement) => (
              <li key={movement.id}>
                <span
                  className={`movement-icon movement-icon--${movement.quantity >= 0 ? "in" : "out"}`}
                >
                  {movement.quantity >= 0 ? (
                    <ArrowDown aria-hidden="true" />
                  ) : (
                    <ArrowUp aria-hidden="true" />
                  )}
                </span>
                <div>
                  <strong>
                    {movement.type} — {movement.product}
                  </strong>
                  <time>{movement.date}</time>
                </div>
                <span
                  className={`movement-quantity movement-quantity--${movement.quantity >= 0 ? "in" : "out"}`}
                >
                  {movement.quantity > 0 ? "+" : ""}
                  {movement.quantity}
                </span>
                <small>Stock après : {movement.balance}</small>
              </li>
            ))}
          </ol>
        ) : (
          <div className="order-movements-empty">
            <Archive aria-hidden="true" />
            <p>
              Aucun mouvement de stock n’est encore associé à cette commande.
            </p>
          </div>
        )}
      </article>

      {showCancelDialog ? (
        <CancelOrderDialog
          itemCount={order.itemCount}
          onCancel={() => setShowCancelDialog(false)}
          onConfirm={cancelOrder}
          order={order}
        />
      ) : null}
    </div>
  );
}

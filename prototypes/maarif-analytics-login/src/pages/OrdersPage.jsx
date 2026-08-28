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
import { ORDERS, OrderStatus } from "../shared/orderData.jsx";

function ManualOrderDialog({ onClose, onCreate }) {
  const [isCreating, setIsCreating] = useState(false);
  const create = () => {
    setIsCreating(true);
    window.setTimeout(onCreate, 600);
  };

  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isCreating && onClose()
      }
    >
      <section
        aria-labelledby="manual-order-title"
        aria-modal="true"
        className="catalog-modal order-dialog"
        role="dialog"
      >
        <header>
          <div>
            <p>Nouvelle commande</p>
            <h2 id="manual-order-title">Créer une commande manuelle</h2>
          </div>
          <button
            aria-label="Fermer"
            className="catalog-icon-button"
            disabled={isCreating}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="order-dialog-content">
          <div className="manual-order-preview">
            <ShoppingCart aria-hidden="true" />
            <div>
              <strong>CMD-MAN-2026-0085</strong>
              <p>
                Un brouillon vide sera créé avec la source « Manuelle ». Vous
                pourrez ensuite l’ouvrir depuis la liste.
              </p>
            </div>
          </div>
          <dl className="order-summary-grid">
            <div>
              <dt>Date</dt>
              <dd>27 août 2026 à 20:18</dd>
            </div>
            <div>
              <dt>Statut</dt>
              <dd>Brouillon</dd>
            </div>
            <div>
              <dt>Ville</dt>
              <dd>Casablanca</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>0,00 MAD</dd>
            </div>
          </dl>
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            disabled={isCreating}
            onClick={onClose}
            type="button"
          >
            Annuler
          </button>
          <button
            className="catalog-primary-button"
            disabled={isCreating}
            onClick={create}
            type="button"
          >
            {isCreating ? (
              <>
                <CircleNotch aria-hidden="true" className="spinner" />
                Création…
              </>
            ) : (
              <>
                <Plus aria-hidden="true" />
                Créer le brouillon
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}

export function OrdersManagement({ onView }) {
  const [orders, setOrders] = useState(ORDERS);
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState("01–27 août 2026");
  const [status, setStatus] = useState("Tous les statuts");
  const [source, setSource] = useState("Toutes les sources");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualOrder, setShowManualOrder] = useState(false);
  const [feedback, setFeedback] = useState("");
  const pageSize = 6;

  const matchesDateRange = (order) => {
    if (dateRange === "Toutes les dates") return true;
    if (dateRange === "20–27 août 2026")
      return order.isoDate >= "2026-08-20" && order.isoDate <= "2026-08-27";
    if (dateRange === "01–31 juillet 2026")
      return order.isoDate >= "2026-07-01" && order.isoDate <= "2026-07-31";
    return order.isoDate >= "2026-08-01" && order.isoDate <= "2026-08-27";
  };

  const filtered = orders.filter((order) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    const matchesQuery =
      !normalizedQuery ||
      [order.reference, order.city].some((value) =>
        value.toLocaleLowerCase("fr").includes(normalizedQuery),
      );
    const matchesStatus =
      status === "Tous les statuts" || order.status === status;
    const matchesSource =
      source === "Toutes les sources" || order.source === source;
    return (
      matchesQuery && matchesDateRange(order) && matchesStatus && matchesSource
    );
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleOrders = filtered.slice((page - 1) * pageSize, page * pageSize);

  const runServerRequest = (callback) => {
    setIsLoading(true);
    window.setTimeout(() => {
      callback();
      setIsLoading(false);
    }, 450);
  };
  const updateFilter = (setter, value) =>
    runServerRequest(() => {
      setter(value);
      setPage(1);
    });
  const createManualOrder = () => {
    const newOrder = {
      reference: "CMD-MAN-2026-0085",
      isoDate: "2026-08-27",
      date: "27 août 2026 à 20:18",
      status: "Brouillon",
      source: "Manuelle",
      city: "Casablanca",
      itemCount: 0,
      total: 0,
    };
    setOrders((current) => [newOrder, ...current]);
    setShowManualOrder(false);
    setPage(1);
    setFeedback("Brouillon CMD-MAN-2026-0085 créé avec succès.");
  };

  return (
    <div className="orders-management">
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
      <section
        aria-label="Recherche et filtres des commandes"
        className="orders-toolbar"
      >
        <form
          className="catalog-search"
          onSubmit={(event) => {
            event.preventDefault();
            runServerRequest(() => {
              setQuery(queryInput);
              setPage(1);
            });
          }}
          role="search"
        >
          <MagnifyingGlass aria-hidden="true" />
          <label className="sr-only" htmlFor="orders-search">
            Rechercher une commande
          </label>
          <input
            id="orders-search"
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Référence ou ville"
            type="search"
            value={queryInput}
          />
          <button disabled={isLoading} type="submit">
            Rechercher
          </button>
        </form>
        <div className="orders-filters">
          <label>
            <span>Période</span>
            <select
              aria-label="Filtrer par période"
              onChange={(event) =>
                updateFilter(setDateRange, event.target.value)
              }
              value={dateRange}
            >
              <option>01–27 août 2026</option>
              <option>20–27 août 2026</option>
              <option>01–31 juillet 2026</option>
              <option>Toutes les dates</option>
            </select>
            <CaretDown aria-hidden="true" />
          </label>
          <label>
            <span>Statut</span>
            <select
              aria-label="Filtrer par statut"
              onChange={(event) => updateFilter(setStatus, event.target.value)}
              value={status}
            >
              <option>Tous les statuts</option>
              <option>Livrée</option>
              <option>Expédiée</option>
              <option>En préparation</option>
              <option>Annulée</option>
              <option>Brouillon</option>
            </select>
            <CaretDown aria-hidden="true" />
          </label>
          <label>
            <span>Source</span>
            <select
              aria-label="Filtrer par source"
              onChange={(event) => updateFilter(setSource, event.target.value)}
              value={source}
            >
              <option value="Toutes les sources">Toutes</option>
              <option>Boutique Maarif</option>
              <option>Site web</option>
              <option>Téléphone</option>
              <option>Manuelle</option>
            </select>
            <CaretDown aria-hidden="true" />
          </label>
        </div>
        <button
          className="catalog-create-button"
          onClick={() => setShowManualOrder(true)}
          type="button"
        >
          <Plus aria-hidden="true" />
          Créer une commande manuelle
        </button>
      </section>

      <section
        aria-labelledby="orders-table-title"
        className="catalog-panel orders-panel"
      >
        <div className="catalog-panel-header">
          <div>
            <h2 id="orders-table-title">Liste des commandes</h2>
            <p aria-live="polite">
              {isLoading
                ? "Chargement des commandes…"
                : `${filtered.length} commande${filtered.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <span>Dernière actualisation : 27 août 2026 à 20:18</span>
        </div>
        <div className="catalog-table-scroll orders-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Référence</th>
                <th scope="col">Date</th>
                <th scope="col">Statut</th>
                <th scope="col">Source</th>
                <th scope="col">Ville</th>
                <th scope="col">Articles</th>
                <th scope="col">Total</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody aria-busy={isLoading}>
              {isLoading
                ? Array.from({ length: pageSize }, (_, index) => (
                    <tr className="catalog-skeleton-row" key={index}>
                      {Array.from({ length: 8 }, (__, cell) => (
                        <td key={cell}>
                          <span />
                        </td>
                      ))}
                    </tr>
                  ))
                : null}
              {!isLoading &&
                visibleOrders.map((order) => (
                  <tr key={order.reference}>
                    <td className="order-reference">{order.reference}</td>
                    <td>
                      <time dateTime={order.isoDate}>{order.date}</time>
                    </td>
                    <td>
                      <OrderStatus status={order.status} />
                    </td>
                    <td className="order-source">{order.source}</td>
                    <td>{order.city}</td>
                    <td className="catalog-number">
                      {order.itemCount} article{order.itemCount > 1 ? "s" : ""}
                    </td>
                    <td className="catalog-number order-total">
                      {formatMad(order.total)}
                    </td>
                    <td>
                      <div className="catalog-row-actions">
                        <button
                          aria-label={`Voir la commande ${order.reference}`}
                          className="catalog-icon-button"
                          onClick={() => onView(order)}
                          title="Voir"
                          type="button"
                        >
                          <Eye aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!isLoading && visibleOrders.length === 0 ? (
            <div className="catalog-empty">
              <ShoppingCart aria-hidden="true" />
              <h3>Aucune commande trouvée</h3>
              <p>
                Modifiez la recherche ou les filtres pour afficher des
                commandes.
              </p>
            </div>
          ) : null}
        </div>
        <footer className="catalog-pagination">
          <p>
            Affichage de {filtered.length ? (page - 1) * pageSize + 1 : 0} à{" "}
            {Math.min(page * pageSize, filtered.length)} sur {filtered.length}
          </p>
          <nav aria-label="Pagination des commandes">
            <button
              disabled={page === 1 || isLoading}
              onClick={() =>
                runServerRequest(() => setPage((current) => current - 1))
              }
              type="button"
            >
              Précédent
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  aria-current={page === pageNumber ? "page" : undefined}
                  className={page === pageNumber ? "is-current" : ""}
                  disabled={isLoading}
                  key={pageNumber}
                  onClick={() => runServerRequest(() => setPage(pageNumber))}
                  type="button"
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              disabled={page === pageCount || isLoading}
              onClick={() =>
                runServerRequest(() => setPage((current) => current + 1))
              }
              type="button"
            >
              Suivant
            </button>
          </nav>
        </footer>
      </section>

      {showManualOrder ? (
        <ManualOrderDialog
          onClose={() => setShowManualOrder(false)}
          onCreate={createManualOrder}
        />
      ) : null}
    </div>
  );
}


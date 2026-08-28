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


const STOCK_ALERTS = [
  {
    id: "ALT-2026-0038",
    product: "Les Misérables — Tome I",
    sku: "LIV-000619",
    type: "Rupture de stock",
    severity: "Critique",
    explanation: "Le stock est à 0 exemplaire, sous le seuil minimum de 5.",
    suggestedAction: "Commander 20 exemplaires auprès de Sodis Maroc.",
    createdAt: "27 août 2026 à 18:42",
    status: "Nouvelle",
  },
  {
    id: "ALT-2026-0037",
    product: "Antigone",
    sku: "LIV-000538",
    type: "Stock faible",
    severity: "Élevée",
    explanation:
      "5 exemplaires restent en stock pour un seuil minimum fixé à 8.",
    suggestedAction: "Réceptionner REC-2026-0321 ou commander 12 exemplaires.",
    createdAt: "27 août 2026 à 17:08",
    status: "Nouvelle",
  },
  {
    id: "ALT-2026-0036",
    product: "Le Petit Prince",
    sku: "LIV-000812",
    type: "Risque de rupture",
    severity: "Élevée",
    explanation:
      "La prévision indique une rupture dans 4 jours au rythme actuel.",
    suggestedAction: "Commander 18 exemplaires avant le 29 août 2026.",
    createdAt: "27 août 2026 à 09:30",
    status: "Acquittée",
  },
  {
    id: "ALT-2026-0035",
    product: "L’Enfant de sable",
    sku: "LIV-000947",
    type: "Stock faible",
    severity: "Moyenne",
    explanation:
      "7 exemplaires restent en stock pour un seuil minimum fixé à 9.",
    suggestedAction: "Vérifier les ventes prévues avant le prochain réassort.",
    createdAt: "26 août 2026 à 16:24",
    status: "Nouvelle",
  },
  {
    id: "ALT-2026-0034",
    product: "موسم الهجرة إلى الشمال",
    sku: "LIV-001026",
    type: "Risque de rupture",
    severity: "Moyenne",
    explanation:
      "Le stock couvrira environ 8 jours de ventes au rythme actuel.",
    suggestedAction:
      "Ajouter 10 exemplaires à la prochaine commande fournisseur.",
    createdAt: "26 août 2026 à 11:16",
    status: "Acquittée",
  },
  {
    id: "ALT-2026-0033",
    product: "La Civilisation, ma Mère !...",
    sku: "LIV-001104",
    type: "Stock faible",
    severity: "Élevée",
    explanation:
      "3 exemplaires restent en stock pour un seuil minimum fixé à 6.",
    suggestedAction:
      "Commander 15 exemplaires auprès de Distribution Livre Maroc.",
    createdAt: "25 août 2026 à 15:52",
    status: "Nouvelle",
  },
  {
    id: "ALT-2026-0032",
    product: "Ainsi parlait Zarathoustra",
    sku: "LIV-001233",
    type: "Risque de rupture",
    severity: "Moyenne",
    explanation:
      "Une hausse des ventes réduit la couverture de stock à 10 jours.",
    suggestedAction:
      "Surveiller les ventes pendant 3 jours avant réapprovisionnement.",
    createdAt: "24 août 2026 à 14:40",
    status: "Résolue",
  },
  {
    id: "ALT-2026-0031",
    product: "Harry Potter à l’école des sorciers",
    sku: "LIV-001315",
    type: "Stock faible",
    severity: "Moyenne",
    explanation:
      "9 exemplaires restent en stock pour un seuil minimum fixé à 10.",
    suggestedAction: "Inclure 12 exemplaires dans la prochaine commande.",
    createdAt: "23 août 2026 à 10:05",
    status: "Acquittée",
  },
  {
    id: "ALT-2026-0030",
    product: "ذاكرة الجسد",
    sku: "LIV-001408",
    type: "Rupture de stock",
    severity: "Critique",
    explanation:
      "Le stock était épuisé alors que 6 commandes étaient en attente.",
    suggestedAction: "Réception fournisseur effectuée et commandes libérées.",
    createdAt: "22 août 2026 à 13:18",
    status: "Résolue",
  },
];

function StockAlertSeverity({ severity }) {
  const tone =
    severity === "Critique"
      ? "critical"
      : severity === "Élevée"
        ? "high"
        : "medium";
  return (
    <span className={`stock-alert-severity stock-alert-severity--${tone}`}>
      <WarningCircle aria-hidden="true" weight="fill" />
      {severity}
    </span>
  );
}

function StockAlertStatus({ status }) {
  const tone =
    status === "Nouvelle"
      ? "new"
      : status === "Acquittée"
        ? "acknowledged"
        : "resolved";
  return (
    <span className={`stock-alert-status stock-alert-status--${tone}`}>
      {status === "Résolue" ? (
        <CheckCircle aria-hidden="true" weight="fill" />
      ) : (
        <Bell
          aria-hidden="true"
          weight={status === "Nouvelle" ? "fill" : "regular"}
        />
      )}
      {status}
    </span>
  );
}

function StockAlertConfirmDialog({ alert, mode, onCancel, onConfirm }) {
  const [isSaving, setIsSaving] = useState(false);
  const isResolve = mode === "resolve";

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !isSaving) onCancel();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isSaving, onCancel]);

  const confirm = () => {
    setIsSaving(true);
    window.setTimeout(onConfirm, 620);
  };

  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isSaving && onCancel()
      }
    >
      <section
        aria-labelledby="stock-alert-confirm-title"
        aria-modal="true"
        className="catalog-modal catalog-confirm-modal stock-alert-confirm-modal"
        role="alertdialog"
      >
        <span
          className={`catalog-confirm-icon${isResolve ? " stock-alert-confirm-icon--resolve" : ""}`}
        >
          {isResolve ? (
            <CheckCircle aria-hidden="true" />
          ) : (
            <Bell aria-hidden="true" />
          )}
        </span>
        <div>
          <p>
            {alert.id} · {alert.sku}
          </p>
          <h2 id="stock-alert-confirm-title">
            {isResolve ? "Résoudre cette alerte ?" : "Acquitter cette alerte ?"}
          </h2>
          <p>
            {isResolve ? (
              <>
                L’alerte concernant <strong>{alert.product}</strong> sera
                marquée comme résolue. Cette action ne modifie pas le stock.
              </>
            ) : (
              <>
                Vous confirmez avoir pris connaissance de l’alerte concernant{" "}
                <strong>{alert.product}</strong>. Elle restera ouverte jusqu’à
                sa résolution.
              </>
            )}
          </p>
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            Annuler
          </button>
          <button
            className="catalog-primary-button"
            disabled={isSaving}
            onClick={confirm}
            type="button"
          >
            {isSaving ? (
              <>
                <CircleNotch aria-hidden="true" className="spinner" />
                Enregistrement…
              </>
            ) : isResolve ? (
              <>
                <CheckCircle aria-hidden="true" />
                Résoudre l’alerte
              </>
            ) : (
              <>
                <Bell aria-hidden="true" />
                Acquitter l’alerte
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}

export function StockAlertsPage() {
  const [alerts, setAlerts] = useState(STOCK_ALERTS);
  const [type, setType] = useState("Tous les types");
  const [severity, setSeverity] = useState("Toutes les sévérités");
  const [status, setStatus] = useState("Tous les statuts");
  const [product, setProduct] = useState("Tous les produits");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [feedback, setFeedback] = useState("");
  const pageSize = 6;

  const filteredAlerts = alerts.filter(
    (alert) =>
      (type === "Tous les types" || alert.type === type) &&
      (severity === "Toutes les sévérités" || alert.severity === severity) &&
      (status === "Tous les statuts" || alert.status === status) &&
      (product === "Tous les produits" || alert.sku === product),
  );
  const pageCount = Math.max(1, Math.ceil(filteredAlerts.length / pageSize));
  const visibleAlerts = filteredAlerts.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const productOptions = [
    ...new Map(alerts.map((alert) => [alert.sku, alert])).values(),
  ];

  const updateFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const resetFilters = () => {
    setType("Tous les types");
    setSeverity("Toutes les sévérités");
    setStatus("Tous les statuts");
    setProduct("Tous les produits");
    setPage(1);
  };

  const confirmAction = () => {
    const nextStatus = dialog.mode === "resolve" ? "Résolue" : "Acquittée";
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === dialog.alert.id ? { ...alert, status: nextStatus } : alert,
      ),
    );
    setFeedback(
      dialog.mode === "resolve"
        ? `Alerte ${dialog.alert.id} résolue avec succès.`
        : `Alerte ${dialog.alert.id} acquittée par Nadia El Mansouri.`,
    );
    setPage(1);
    setDialog(null);
  };

  return (
    <div className="stock-alert-page">
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
        aria-label="Filtres des alertes de stock"
        className="stock-alert-toolbar"
      >
        <div className="stock-alert-filters">
          <label>
            <span>Type d’alerte</span>
            <select
              aria-label="Filtrer par type d’alerte"
              onChange={(event) => updateFilter(setType, event.target.value)}
              value={type}
            >
              <option>Tous les types</option>
              <option>Rupture de stock</option>
              <option>Stock faible</option>
              <option>Risque de rupture</option>
            </select>
            <CaretDown aria-hidden="true" />
          </label>
          <label>
            <span>Sévérité</span>
            <select
              aria-label="Filtrer par sévérité"
              onChange={(event) =>
                updateFilter(setSeverity, event.target.value)
              }
              value={severity}
            >
              <option>Toutes les sévérités</option>
              <option>Critique</option>
              <option>Élevée</option>
              <option>Moyenne</option>
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
              <option>Nouvelle</option>
              <option>Acquittée</option>
              <option>Résolue</option>
            </select>
            <CaretDown aria-hidden="true" />
          </label>
          <label>
            <span>Produit</span>
            <select
              aria-label="Filtrer par produit"
              onChange={(event) => updateFilter(setProduct, event.target.value)}
              value={product}
            >
              <option>Tous les produits</option>
              {productOptions.map((item) => (
                <option key={item.sku} value={item.sku}>
                  {item.product}
                </option>
              ))}
            </select>
            <CaretDown aria-hidden="true" />
          </label>
        </div>
        <button
          className="catalog-secondary-button stock-alert-reset"
          onClick={resetFilters}
          type="button"
        >
          <ArrowClockwise aria-hidden="true" />
          Réinitialiser
        </button>
      </section>

      <section
        aria-labelledby="stock-alert-table-title"
        className="catalog-panel stock-alert-panel"
      >
        <div className="catalog-panel-header">
          <div>
            <h2 id="stock-alert-table-title">Alertes de stock</h2>
            <p aria-live="polite">
              {filteredAlerts.length} alerte
              {filteredAlerts.length > 1 ? "s" : ""}
            </p>
          </div>
          <span>Dernière actualisation : 27 août 2026 à 18:45</span>
        </div>
        <div className="catalog-table-scroll stock-alert-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Type</th>
                <th scope="col">Sévérité</th>
                <th scope="col">Explication</th>
                <th scope="col">Action suggérée</th>
                <th scope="col">Créée le</th>
                <th scope="col">Statut</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <div className="stock-alert-product">
                      <strong>{alert.product}</strong>
                      <span>
                        {alert.sku} · {alert.id}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="stock-alert-type">{alert.type}</span>
                  </td>
                  <td>
                    <StockAlertSeverity severity={alert.severity} />
                  </td>
                  <td>
                    <p className="stock-alert-copy">{alert.explanation}</p>
                  </td>
                  <td>
                    <p className="stock-alert-copy stock-alert-copy--action">
                      {alert.suggestedAction}
                    </p>
                  </td>
                  <td>
                    <time>{alert.createdAt}</time>
                  </td>
                  <td>
                    <StockAlertStatus status={alert.status} />
                  </td>
                  <td>
                    <div className="stock-alert-actions">
                      {alert.status === "Nouvelle" ? (
                        <button
                          className="stock-alert-action-button"
                          onClick={() =>
                            setDialog({ alert, mode: "acknowledge" })
                          }
                          type="button"
                        >
                          <Bell aria-hidden="true" />
                          Acquitter
                        </button>
                      ) : null}
                      {alert.status !== "Résolue" ? (
                        <button
                          className="stock-alert-action-button stock-alert-action-button--primary"
                          onClick={() => setDialog({ alert, mode: "resolve" })}
                          type="button"
                        >
                          <CheckCircle aria-hidden="true" />
                          Résoudre
                        </button>
                      ) : (
                        <span className="stock-alert-no-action">
                          Aucune action
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleAlerts.length === 0 ? (
            <div className="catalog-empty">
              <Bell aria-hidden="true" />
              <h3>Aucune alerte trouvée</h3>
              <p>
                Modifiez les filtres pour afficher d’autres alertes de stock.
              </p>
            </div>
          ) : null}
        </div>
        <footer className="catalog-pagination">
          <p>
            {filteredAlerts.length
              ? `Affichage de ${(page - 1) * pageSize + 1} à ${Math.min(page * pageSize, filteredAlerts.length)} sur ${filteredAlerts.length}`
              : "Aucune alerte à afficher"}
          </p>
          <nav aria-label="Pagination des alertes de stock">
            <button
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              type="button"
            >
              Précédent
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  aria-current={page === pageNumber ? "page" : undefined}
                  className={page === pageNumber ? "is-current" : ""}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              disabled={page === pageCount}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              Suivant
            </button>
          </nav>
        </footer>
      </section>
      {dialog ? (
        <StockAlertConfirmDialog
          alert={dialog.alert}
          mode={dialog.mode}
          onCancel={() => setDialog(null)}
          onConfirm={confirmAction}
        />
      ) : null}
    </div>
  );
}


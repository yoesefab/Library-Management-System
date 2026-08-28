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


import { ErrorMessage } from "../shared/ErrorMessage.jsx";
import { CATALOG_PRODUCTS, formatMad } from "../shared/catalogData.js";

const INVENTORY_HISTORY = [
  {
    id: "MVT-2026-0842",
    date: "27 août 2026 à 16:42",
    product: "La Boîte à merveilles",
    sku: "LIV-000184",
    type: "Sortie",
    quantity: -2,
    balance: 42,
    reference: "CMD-2026-1842",
  },
  {
    id: "MVT-2026-0841",
    date: "27 août 2026 à 15:18",
    product: "Antigone",
    sku: "LIV-000538",
    type: "Réception",
    quantity: 12,
    balance: 5,
    reference: "REC-2026-0321",
  },
  {
    id: "MVT-2026-0840",
    date: "27 août 2026 à 11:08",
    product: "Le Pain nu",
    sku: "LIV-000231",
    type: "Sortie",
    quantity: -1,
    balance: 18,
    reference: "CMD-2026-1834",
  },
  {
    id: "MVT-2026-0839",
    date: "26 août 2026 à 17:36",
    product: "Les Misérables — Tome I",
    sku: "LIV-000619",
    type: "Ajustement",
    quantity: -2,
    balance: 0,
    reference: "INV-2026-0089",
  },
  {
    id: "MVT-2026-0838",
    date: "26 août 2026 à 15:20",
    product: "La Boîte à merveilles",
    sku: "LIV-000184",
    type: "Réception",
    quantity: 24,
    balance: 45,
    reference: "REC-2026-0318",
  },
];

function InventoryStatus({ stock, threshold }) {
  if (stock === 0)
    return <span className="catalog-status catalog-status--out">Rupture</span>;
  if (stock <= threshold)
    return (
      <span className="catalog-status catalog-status--low">Stock faible</span>
    );
  return (
    <span className="catalog-status catalog-status--active">Stock normal</span>
  );
}

function StockMovementDialog({ inventory, onClose, onRecord }) {
  const [sku, setSku] = useState(inventory[0]?.sku ?? "");
  const [movementType, setMovementType] = useState("Achat");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form");
  const [isSaving, setIsSaving] = useState(false);
  const selectedProduct =
    inventory.find((product) => product.sku === sku) ?? inventory[0];
  const parsedQuantity = Number(quantity);
  const setsStockLevel =
    movementType === "Stock initial" || movementType === "Correction";
  const removesStock =
    movementType === "Retour fournisseur" || movementType === "Dommage";
  const quantityIsValid =
    quantity !== "" &&
    Number.isInteger(parsedQuantity) &&
    (setsStockLevel ? parsedQuantity >= 0 : parsedQuantity > 0);
  const stockChange = !quantityIsValid
    ? 0
    : setsStockLevel
      ? parsedQuantity - selectedProduct.stock
      : removesStock
        ? -parsedQuantity
        : parsedQuantity;
  const stockAfter = selectedProduct.stock + stockChange;
  const createsNegativeStock = quantityIsValid && stockAfter < 0;
  const changeLabel = `${stockChange > 0 ? "+" : ""}${stockChange}`;

  const resetForEditing = () => {
    setStep("form");
    setIsSaving(false);
  };

  const validate = () => {
    const nextErrors = {};
    if (!quantityIsValid)
      nextErrors.quantity = setsStockLevel
        ? "Saisissez un stock compté entier supérieur ou égal à zéro."
        : "Saisissez une quantité entière supérieure à zéro.";
    if (!reason.trim())
      nextErrors.reason = "Précisez la raison de ce mouvement.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && !createsNegativeStock;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setStep("confirm");
  };

  const confirm = () => {
    setIsSaving(true);
    window.setTimeout(
      () =>
        onRecord({
          movementType,
          nextStock: stockAfter,
          quantity: stockChange,
          reason: reason.trim(),
          sku,
        }),
      650,
    );
  };

  const explanation = !quantityIsValid
    ? "Saisissez une quantité pour prévisualiser l’effet sur le stock."
    : setsStockLevel
      ? `${movementType} : le stock compté remplacera le niveau actuel (${changeLabel} exemplaires).`
      : removesStock
        ? `${movementType} : ${parsedQuantity} exemplaire${parsedQuantity > 1 ? "s" : ""} ${parsedQuantity > 1 ? "seront retirés" : "sera retiré"} du stock.`
        : `${movementType} : ${parsedQuantity} exemplaire${parsedQuantity > 1 ? "s" : ""} ${parsedQuantity > 1 ? "seront ajoutés" : "sera ajouté"} au stock.`;

  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        aria-labelledby="stock-movement-title"
        aria-modal="true"
        className="catalog-modal stock-movement-modal"
        role="dialog"
      >
        <header>
          <div>
            <p>{step === "form" ? "Nouveau mouvement" : "Étape 2 sur 2"}</p>
            <h2 id="stock-movement-title">
              {step === "form"
                ? "Enregistrer un mouvement de stock"
                : "Confirmer le mouvement"}
            </h2>
          </div>
          <button
            aria-label="Fermer"
            className="catalog-icon-button"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </header>
        {step === "form" ? (
          <form onSubmit={submit}>
            <div className="stock-movement-form">
              <label className="stock-movement-field stock-movement-field--wide">
                <span>Produit</span>
                <select
                  onChange={(event) => {
                    setSku(event.target.value);
                    setErrors({});
                  }}
                  value={sku}
                >
                  {inventory.map((product) => (
                    <option key={product.sku} value={product.sku}>
                      {product.title} — {product.sku}
                    </option>
                  ))}
                </select>
                <CaretDown aria-hidden="true" />
              </label>
              <label className="stock-movement-field">
                <span>Type de mouvement</span>
                <select
                  onChange={(event) => {
                    setMovementType(event.target.value);
                    setQuantity("");
                    setErrors({});
                  }}
                  value={movementType}
                >
                  <option>Stock initial</option>
                  <option>Achat</option>
                  <option>Retour client</option>
                  <option>Retour fournisseur</option>
                  <option>Dommage</option>
                  <option>Correction</option>
                </select>
                <CaretDown aria-hidden="true" />
              </label>
              <label className="stock-movement-field">
                <span>{setsStockLevel ? "Stock compté" : "Quantité"}</span>
                <input
                  aria-describedby={
                    errors.quantity ? "movement-quantity-error" : undefined
                  }
                  aria-invalid={Boolean(errors.quantity)}
                  inputMode="numeric"
                  min={setsStockLevel ? "0" : "1"}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                    setErrors((current) => ({ ...current, quantity: "" }));
                  }}
                  placeholder="0"
                  type="number"
                  value={quantity}
                />
                {errors.quantity ? (
                  <ErrorMessage id="movement-quantity-error">
                    {errors.quantity}
                  </ErrorMessage>
                ) : null}
              </label>
              <label className="stock-movement-field stock-movement-field--wide">
                <span>Raison</span>
                <textarea
                  aria-describedby={
                    errors.reason ? "movement-reason-error" : undefined
                  }
                  aria-invalid={Boolean(errors.reason)}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setErrors((current) => ({ ...current, reason: "" }));
                  }}
                  placeholder="Ex. Réception de la commande fournisseur REC-2026-0324"
                  rows="3"
                  value={reason}
                />
                {errors.reason ? (
                  <ErrorMessage id="movement-reason-error">
                    {errors.reason}
                  </ErrorMessage>
                ) : null}
              </label>
            </div>
            <div
              className={`movement-impact-card${createsNegativeStock ? " is-danger" : ""}`}
              aria-live="polite"
            >
              <div className="movement-impact-icon">
                {createsNegativeStock ? (
                  <WarningCircle aria-hidden="true" weight="fill" />
                ) : removesStock ? (
                  <ArrowUp aria-hidden="true" />
                ) : (
                  <ArrowDown aria-hidden="true" />
                )}
              </div>
              <div>
                <span>Effet du mouvement</span>
                <p>{explanation}</p>
              </div>
              <div className="movement-stock-equation">
                <span>
                  <small>Stock actuel</small>
                  <strong>{selectedProduct.stock}</strong>
                </span>
                <b aria-hidden="true">{stockChange >= 0 ? "+" : "−"}</b>
                <span>
                  <small>Variation</small>
                  <strong>{Math.abs(stockChange)}</strong>
                </span>
                <b aria-hidden="true">=</b>
                <span className={createsNegativeStock ? "is-negative" : ""}>
                  <small>Stock résultant</small>
                  <strong>{quantityIsValid ? stockAfter : "—"}</strong>
                </span>
              </div>
            </div>
            {createsNegativeStock ? (
              <div className="movement-negative-warning" role="alert">
                <WarningCircle aria-hidden="true" weight="fill" />
                <div>
                  <strong>Stock négatif impossible</strong>
                  <p>
                    Ce mouvement ferait passer le stock de{" "}
                    {selectedProduct.stock} à {stockAfter}. Réduisez la quantité
                    avant de continuer.
                  </p>
                </div>
              </div>
            ) : null}
            <footer className="stock-movement-actions">
              <button
                className="catalog-secondary-button"
                onClick={onClose}
                type="button"
              >
                Annuler
              </button>
              <button
                className="catalog-primary-button"
                disabled={createsNegativeStock}
                type="submit"
              >
                Vérifier le mouvement
              </button>
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
                  {selectedProduct.title}
                  <small>{selectedProduct.sku}</small>
                </dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{movementType}</dd>
              </div>
              <div>
                <dt>Raison</dt>
                <dd>{reason}</dd>
              </div>
            </dl>
            <div className="movement-confirmation-change">
              <span>
                <small>Stock actuel</small>
                <strong>{selectedProduct.stock}</strong>
              </span>
              <span
                className={stockChange >= 0 ? "is-positive" : "is-negative"}
              >
                <small>Variation</small>
                <strong>{changeLabel}</strong>
              </span>
              <span>
                <small>Stock résultant</small>
                <strong>{stockAfter}</strong>
              </span>
            </div>
            <footer className="stock-movement-actions">
              <button
                className="catalog-secondary-button"
                disabled={isSaving}
                onClick={resetForEditing}
                type="button"
              >
                Modifier
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
                ) : (
                  <>
                    <CheckCircle aria-hidden="true" />
                    Confirmer et enregistrer
                  </>
                )}
              </button>
            </footer>
          </div>
        )}
      </section>
    </div>
  );
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState(() =>
    CATALOG_PRODUCTS.map((product) => ({
      ...product,
      purchaseCost: Math.round(product.price * 0.635 * 100) / 100,
    })),
  );
  const [history, setHistory] = useState(INVENTORY_HISTORY);
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("Tous les stocks");
  const [category, setCategory] = useState("Toutes");
  const [language, setLanguage] = useState("Toutes");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const pageSize = 6;

  const filtered = inventory.filter((product) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    const matchesQuery =
      !normalizedQuery ||
      [product.sku, product.title].some((value) =>
        value.toLocaleLowerCase("fr").includes(normalizedQuery),
      );
    const matchesCategory =
      category === "Toutes" || product.category === category;
    const matchesLanguage =
      language === "Toutes" || product.language === language;
    const matchesStock =
      stockFilter === "Tous les stocks" ||
      (stockFilter === "Stock faible"
        ? product.stock > 0 && product.stock <= product.threshold
        : product.stock === 0);
    return matchesQuery && matchesCategory && matchesLanguage && matchesStock;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleInventory = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

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

  const recordMovement = ({
    movementType,
    nextStock,
    quantity,
    reason,
    sku,
  }) => {
    const product = inventory.find((item) => item.sku === sku);
    setInventory((current) =>
      current.map((item) =>
        item.sku === sku ? { ...item, stock: nextStock } : item,
      ),
    );
    setHistory((current) =>
      [
        {
          id: `MVT-2026-${String(843 + current.length).padStart(4, "0")}`,
          date: "27 août 2026 à 19:32",
          product: product.title,
          sku,
          type: movementType,
          quantity,
          balance: nextStock,
          reference: reason,
        },
        ...current,
      ].slice(0, 6),
    );
    setShowMovementDialog(false);
    setFeedback(`Mouvement enregistré pour ${product.title}.`);
  };

  return (
    <div className="inventory-management">
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
        className="inventory-toolbar"
        aria-label="Recherche et filtres de l’inventaire"
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
          <label className="sr-only" htmlFor="inventory-search">
            Rechercher dans l’inventaire
          </label>
          <input
            id="inventory-search"
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Produit ou SKU"
            type="search"
            value={queryInput}
          />
          <button disabled={isLoading} type="submit">
            Rechercher
          </button>
        </form>
        <div className="inventory-filters">
          <label>
            <span>État du stock</span>
            <select
              aria-label="Filtrer par état du stock"
              onChange={(event) =>
                updateFilter(setStockFilter, event.target.value)
              }
              value={stockFilter}
            >
              <option>Tous les stocks</option>
              <option>Stock faible</option>
              <option>Rupture de stock</option>
            </select>
            <CaretDown aria-hidden="true" />
          </label>
          <label>
            <span>Catégorie</span>
            <select
              aria-label="Filtrer par catégorie"
              onChange={(event) =>
                updateFilter(setCategory, event.target.value)
              }
              value={category}
            >
              <option>Toutes</option>
              <option>Roman</option>
              <option>Jeunesse</option>
              <option>Scolaire</option>
              <option>Essai</option>
              <option>Référence</option>
            </select>
            <CaretDown aria-hidden="true" />
          </label>
          <label>
            <span>Langue</span>
            <select
              aria-label="Filtrer par langue"
              onChange={(event) =>
                updateFilter(setLanguage, event.target.value)
              }
              value={language}
            >
              <option>Toutes</option>
              <option>Français</option>
              <option>Arabe</option>
              <option>Anglais</option>
            </select>
            <CaretDown aria-hidden="true" />
          </label>
        </div>
        <button
          className="catalog-create-button"
          onClick={() => setShowMovementDialog(true)}
          type="button"
        >
          <Plus aria-hidden="true" />
          Enregistrer un mouvement
        </button>
      </section>

      <section
        aria-labelledby="inventory-table-title"
        className="catalog-panel inventory-panel"
      >
        <div className="catalog-panel-header">
          <div>
            <h2 id="inventory-table-title">État de l’inventaire</h2>
            <p aria-live="polite">
              {isLoading
                ? "Chargement de l’inventaire…"
                : `${filtered.length} produit${filtered.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <span>Dernière actualisation : 27 août 2026 à 19:32</span>
        </div>
        <div className="catalog-table-scroll inventory-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">SKU</th>
                <th scope="col">Stock actuel</th>
                <th scope="col">Seuil minimum</th>
                <th scope="col">Valeur du stock</th>
                <th scope="col">État du stock</th>
              </tr>
            </thead>
            <tbody aria-busy={isLoading}>
              {isLoading
                ? Array.from({ length: pageSize }, (_, index) => (
                    <tr className="catalog-skeleton-row" key={index}>
                      {Array.from({ length: 6 }, (__, cell) => (
                        <td key={cell}>
                          <span />
                        </td>
                      ))}
                    </tr>
                  ))
                : null}
              {!isLoading &&
                visibleInventory.map((product) => (
                  <tr key={product.sku}>
                    <td
                      className="catalog-title"
                      lang={product.language === "Arabe" ? "ar" : undefined}
                      dir={product.language === "Arabe" ? "rtl" : undefined}
                    >
                      {product.title}
                    </td>
                    <td className="catalog-sku">{product.sku}</td>
                    <td
                      className={`catalog-number${product.stock <= product.threshold ? " is-stock-risk" : ""}`}
                    >
                      {product.stock} ex.
                    </td>
                    <td className="catalog-number">{product.threshold} ex.</td>
                    <td className="catalog-number inventory-value">
                      {formatMad(product.stock * product.purchaseCost)}
                    </td>
                    <td>
                      <InventoryStatus
                        stock={product.stock}
                        threshold={product.threshold}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!isLoading && visibleInventory.length === 0 ? (
            <div className="catalog-empty">
              <Archive aria-hidden="true" />
              <h3>Aucun stock trouvé</h3>
              <p>
                Modifiez la recherche ou les filtres pour afficher des produits.
              </p>
            </div>
          ) : null}
        </div>
        <footer className="catalog-pagination">
          <p>
            Affichage de {filtered.length ? (page - 1) * pageSize + 1 : 0} à{" "}
            {Math.min(page * pageSize, filtered.length)} sur {filtered.length}
          </p>
          <nav aria-label="Pagination de l’inventaire">
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

      <section
        aria-labelledby="movement-history-title"
        className="catalog-panel recent-movements-panel"
      >
        <div className="catalog-panel-header">
          <div>
            <h2 id="movement-history-title">Mouvements récents</h2>
            <p>Derniers mouvements enregistrés</p>
          </div>
          <span>{history.length} mouvements affichés</span>
        </div>
        <div className="recent-movements-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Produit</th>
                <th scope="col">Type</th>
                <th scope="col">Quantité</th>
                <th scope="col">Stock après</th>
                <th scope="col">Référence</th>
              </tr>
            </thead>
            <tbody>
              {history.map((movement) => (
                <tr key={movement.id}>
                  <td>
                    <time>{movement.date}</time>
                  </td>
                  <td>
                    <strong>{movement.product}</strong>
                    <small>{movement.sku}</small>
                  </td>
                  <td>
                    <span
                      className={`movement-type movement-type--${movement.quantity >= 0 ? "in" : "out"}`}
                    >
                      {movement.quantity >= 0 ? (
                        <ArrowDown aria-hidden="true" />
                      ) : (
                        <ArrowUp aria-hidden="true" />
                      )}
                      {movement.type}
                    </span>
                  </td>
                  <td
                    className={`movement-quantity movement-quantity--${movement.quantity >= 0 ? "in" : "out"}`}
                  >
                    {movement.quantity > 0 ? "+" : ""}
                    {movement.quantity}
                  </td>
                  <td>{movement.balance} ex.</td>
                  <td>{movement.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showMovementDialog ? (
        <StockMovementDialog
          inventory={inventory}
          onClose={() => setShowMovementDialog(false)}
          onRecord={recordMovement}
        />
      ) : null}
    </div>
  );
}


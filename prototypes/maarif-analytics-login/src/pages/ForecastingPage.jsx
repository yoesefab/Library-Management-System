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


const FORECAST_PRODUCTS = [
  {
    sku: "LIV-000538",
    title: "Antigone",
    author: "Jean Anouilh",
    category: "Scolaire · Français",
    method: "Moyenne mobile pondérée (8 semaines)",
    predictedQuantity: 46,
    metricLabel: "MAPE",
    metricValue: "8,4 %",
    generatedAt: "27 août 2026 à 18:30",
    currentStock: 5,
    leadTime: "8 jours",
    safetyStock: 12,
    reorderPoint: 25,
    recommendedQuantity: 40,
    supplier: "Sodis Maroc",
    data: [
      { week: "S23", actual: 8, predicted: 9 },
      { week: "S24", actual: 10, predicted: 9 },
      { week: "S25", actual: 9, predicted: 10 },
      { week: "S26", actual: 12, predicted: 11 },
      { week: "S27", actual: 11, predicted: 12 },
      { week: "S28", actual: 14, predicted: 13 },
      { week: "S29", actual: 13, predicted: 14 },
      { week: "S30", actual: 16, predicted: 15 },
      { week: "S31", actual: 15, predicted: 15 },
      { week: "S32", actual: 18, predicted: 17 },
      { week: "S33", actual: 17, predicted: 18 },
      { week: "S34", actual: 20, predicted: 19 },
      { week: "S35", actual: null, predicted: 12 },
      { week: "S36", actual: null, predicted: 11 },
      { week: "S37", actual: null, predicted: 12 },
      { week: "S38", actual: null, predicted: 11 },
    ],
  },
  {
    sku: "LIV-000184",
    title: "La Boîte à merveilles",
    author: "Ahmed Sefrioui",
    category: "Roman · Français",
    method: "Lissage exponentiel",
    predictedQuantity: 38,
    metricLabel: "MAE",
    metricValue: "2,1 ex.",
    generatedAt: "27 août 2026 à 18:28",
    currentStock: 42,
    leadTime: "8 jours",
    safetyStock: 10,
    reorderPoint: 21,
    recommendedQuantity: 0,
    supplier: "Sodis Maroc",
    data: [
      { week: "S23", actual: 7, predicted: 8 },
      { week: "S24", actual: 9, predicted: 8 },
      { week: "S25", actual: 8, predicted: 9 },
      { week: "S26", actual: 10, predicted: 9 },
      { week: "S27", actual: 9, predicted: 10 },
      { week: "S28", actual: 11, predicted: 10 },
      { week: "S29", actual: 10, predicted: 10 },
      { week: "S30", actual: 12, predicted: 11 },
      { week: "S31", actual: 9, predicted: 10 },
      { week: "S32", actual: 11, predicted: 10 },
      { week: "S33", actual: 10, predicted: 10 },
      { week: "S34", actual: 9, predicted: 10 },
      { week: "S35", actual: null, predicted: 10 },
      { week: "S36", actual: null, predicted: 9 },
      { week: "S37", actual: null, predicted: 10 },
      { week: "S38", actual: null, predicted: 9 },
    ],
  },
  {
    sku: "LIV-000619",
    title: "Les Misérables — Tome I",
    author: "Victor Hugo",
    category: "Roman · Français",
    method: "Moyenne mobile pondérée (8 semaines)",
    predictedQuantity: 24,
    metricLabel: "MAPE",
    metricValue: "10,2 %",
    generatedAt: "27 août 2026 à 18:26",
    currentStock: 0,
    leadTime: "12 jours",
    safetyStock: 9,
    reorderPoint: 19,
    recommendedQuantity: 30,
    supplier: "Distribution Livre Maroc",
    data: [
      { week: "S23", actual: 4, predicted: 5 },
      { week: "S24", actual: 6, predicted: 5 },
      { week: "S25", actual: 5, predicted: 5 },
      { week: "S26", actual: 7, predicted: 6 },
      { week: "S27", actual: 6, predicted: 6 },
      { week: "S28", actual: 8, predicted: 7 },
      { week: "S29", actual: 7, predicted: 7 },
      { week: "S30", actual: 9, predicted: 8 },
      { week: "S31", actual: 8, predicted: 8 },
      { week: "S32", actual: 10, predicted: 9 },
      { week: "S33", actual: 9, predicted: 9 },
      { week: "S34", actual: 11, predicted: 10 },
      { week: "S35", actual: null, predicted: 6 },
      { week: "S36", actual: null, predicted: 6 },
      { week: "S37", actual: null, predicted: 6 },
      { week: "S38", actual: null, predicted: 6 },
    ],
  },
  {
    sku: "LIV-001014",
    title: "موسم الهجرة إلى الشمال",
    author: "الطيب صالح",
    category: "Roman · Arabe",
    method: "Lissage exponentiel",
    predictedQuantity: 20,
    metricLabel: "MAE",
    metricValue: "1,4 ex.",
    generatedAt: "27 août 2026 à 18:24",
    currentStock: 3,
    leadTime: "15 jours",
    safetyStock: 8,
    reorderPoint: 18,
    recommendedQuantity: 24,
    supplier: "Al Ouma Distribution",
    data: [
      { week: "S23", actual: 3, predicted: 4 },
      { week: "S24", actual: 5, predicted: 4 },
      { week: "S25", actual: 4, predicted: 4 },
      { week: "S26", actual: 5, predicted: 5 },
      { week: "S27", actual: 4, predicted: 5 },
      { week: "S28", actual: 6, predicted: 5 },
      { week: "S29", actual: 5, predicted: 5 },
      { week: "S30", actual: 7, predicted: 6 },
      { week: "S31", actual: 6, predicted: 6 },
      { week: "S32", actual: 7, predicted: 6 },
      { week: "S33", actual: 6, predicted: 6 },
      { week: "S34", actual: 7, predicted: 7 },
      { week: "S35", actual: null, predicted: 5 },
      { week: "S36", actual: null, predicted: 5 },
      { week: "S37", actual: null, predicted: 5 },
      { week: "S38", actual: null, predicted: 5 },
    ],
  },
];

function ForecastDemandChart({ product }) {
  return (
    <div
      aria-label={`Demande hebdomadaire historique et prévue pour ${product.title}`}
      className="forecast-chart"
      role="img"
    >
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          data={product.data}
          margin={{ top: 12, right: 12, bottom: 0, left: -20 }}
        >
          <CartesianGrid stroke="#e8ebe9" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="week"
            interval={1}
            tick={{ fill: "#697169", fontSize: 10 }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tick={{ fill: "#697169", fontSize: 10 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              border: "1px solid #d9dedb",
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(18, 36, 29, .08)",
              fontSize: 12,
            }}
            formatter={(value, name) => [
              `${value} exemplaires`,
              name === "actual" ? "Demande réelle" : "Demande prévue",
            ]}
            labelStyle={{ color: "#252936", fontWeight: 700 }}
          />
          <Line
            connectNulls={false}
            dataKey="actual"
            dot={{ fill: "#6048a8", r: 2.5 }}
            isAnimationActive={false}
            name="actual"
            stroke="#6048a8"
            strokeWidth={2.25}
            type="linear"
          />
          <Line
            dataKey="predicted"
            dot={{ fill: "#08734e", r: 2.5 }}
            isAnimationActive={false}
            name="predicted"
            stroke="#08734e"
            strokeDasharray="6 4"
            strokeWidth={2.25}
            type="linear"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ForecastingPage() {
  const [query, setQuery] = useState("");
  const [selectedSku, setSelectedSku] = useState(FORECAST_PRODUCTS[0].sku);
  const [searchOpen, setSearchOpen] = useState(false);
  const selectedProduct =
    FORECAST_PRODUCTS.find((item) => item.sku === selectedSku) ??
    FORECAST_PRODUCTS[0];
  const matchingProducts = FORECAST_PRODUCTS.filter((item) =>
    `${item.title} ${item.author} ${item.sku}`
      .toLocaleLowerCase("fr")
      .includes(query.trim().toLocaleLowerCase("fr")),
  );

  const chooseProduct = (product) => {
    setSelectedSku(product.sku);
    setQuery("");
    setSearchOpen(false);
  };

  return (
    <div className="forecasting-page">
      <section
        aria-label="Sélection du produit"
        className="forecast-search-panel"
      >
        <div className="forecast-search-heading">
          <div>
            <p>Analyse de la demande</p>
            <h2>Prévision par produit</h2>
          </div>
          <span>Données arrêtées au 27 août 2026</span>
        </div>
        <div className="forecast-search-wrap">
          <label htmlFor="forecast-product-search">Rechercher un produit</label>
          <div className="forecast-search-control">
            <MagnifyingGlass aria-hidden="true" />
            <input
              aria-autocomplete="list"
              aria-controls="forecast-product-results"
              aria-expanded={searchOpen}
              autoComplete="off"
              id="forecast-product-search"
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Titre, auteur ou SKU"
              type="search"
              value={query}
            />
          </div>
          {searchOpen && query ? (
            <div
              className="forecast-search-results"
              id="forecast-product-results"
              role="listbox"
            >
              {matchingProducts.length ? (
                matchingProducts.map((product) => (
                  <button
                    aria-selected={product.sku === selectedSku}
                    key={product.sku}
                    onClick={() => chooseProduct(product)}
                    role="option"
                    type="button"
                  >
                    <BookOpen aria-hidden="true" />
                    <span>
                      <strong>{product.title}</strong>
                      <small>
                        {product.author} · {product.sku}
                      </small>
                    </span>
                  </button>
                ))
              ) : (
                <p>Aucun produit trouvé.</p>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section
        aria-labelledby="forecast-product-title"
        className="forecast-product-summary"
      >
        <span className="forecast-product-icon">
          <BookOpen aria-hidden="true" weight="fill" />
        </span>
        <div>
          <p>{selectedProduct.sku}</p>
          <h2 id="forecast-product-title">{selectedProduct.title}</h2>
          <span>
            {selectedProduct.author} · {selectedProduct.category}
          </span>
        </div>
        <span className="catalog-status catalog-status--active">
          Produit actif
        </span>
      </section>

      <section className="forecast-analysis-grid">
        <article className="forecast-panel forecast-chart-panel">
          <header>
            <div>
              <h3>Demande hebdomadaire</h3>
              <p>Historique observé et prévision sur 4 semaines</p>
            </div>
            <div className="forecast-legend">
              <span>
                <i className="is-actual" />
                Réelle
              </span>
              <span>
                <i className="is-predicted" />
                Prévue
              </span>
            </div>
          </header>
          <ForecastDemandChart product={selectedProduct} />
          <p className="forecast-chart-caption">
            Les semaines S35 à S38 représentent la période prévisionnelle.
          </p>
        </article>

        <aside className="forecast-panel forecast-model-panel">
          <header>
            <TrendUp aria-hidden="true" />
            <div>
              <h3>Prévision actuelle</h3>
              <p>Modèle retenu pour ce produit</p>
            </div>
          </header>
          <dl>
            <div>
              <dt>Méthode sélectionnée</dt>
              <dd>{selectedProduct.method}</dd>
            </div>
            <div className="forecast-model-highlight">
              <dt>Quantité prévue</dt>
              <dd>
                {selectedProduct.predictedQuantity}{" "}
                <small>exemplaires / 4 semaines</small>
              </dd>
            </div>
            <div>
              <dt>{selectedProduct.metricLabel}</dt>
              <dd>{selectedProduct.metricValue}</dd>
            </div>
            <div>
              <dt>Date de génération</dt>
              <dd>{selectedProduct.generatedAt}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section
        aria-label="Hypothèses et limites"
        className="forecast-notes-grid"
      >
        <article className="forecast-panel forecast-note">
          <header>
            <CheckCircle aria-hidden="true" />
            <h3>Hypothèses</h3>
          </header>
          <ul>
            <li>
              Les ventes des 12 dernières semaines reflètent la demande
              habituelle.
            </li>
            <li>Les prix et la disponibilité commerciale restent stables.</li>
            <li>Aucune promotion exceptionnelle n’est planifiée.</li>
          </ul>
        </article>
        <article className="forecast-panel forecast-note forecast-note--limitations">
          <header>
            <WarningCircle aria-hidden="true" />
            <h3>Limites</h3>
          </header>
          <ul>
            <li>
              Les ruptures passées peuvent sous-estimer la demande réelle.
            </li>
            <li>
              Les événements scolaires et saisonniers ne sont pas modélisés
              séparément.
            </li>
            <li>
              La prévision doit être revue après toute variation inhabituelle.
            </li>
          </ul>
        </article>
      </section>

      <section
        aria-labelledby="reorder-title"
        className="forecast-panel reorder-panel"
      >
        <header>
          <div>
            <p>Décision de réapprovisionnement</p>
            <h3 id="reorder-title">Recommandation de stock</h3>
          </div>
          <span>Fournisseur : {selectedProduct.supplier}</span>
        </header>
        <div className="reorder-metrics">
          <article>
            <Archive aria-hidden="true" />
            <span>Stock actuel</span>
            <strong>{selectedProduct.currentStock}</strong>
            <small>exemplaires disponibles</small>
          </article>
          <article>
            <Truck aria-hidden="true" />
            <span>Délai fournisseur</span>
            <strong>{selectedProduct.leadTime}</strong>
            <small>délai habituel</small>
          </article>
          <article>
            <Warning aria-hidden="true" />
            <span>Stock de sécurité</span>
            <strong>{selectedProduct.safetyStock}</strong>
            <small>exemplaires</small>
          </article>
          <article>
            <TrendUp aria-hidden="true" />
            <span>Point de commande</span>
            <strong>{selectedProduct.reorderPoint}</strong>
            <small>exemplaires</small>
          </article>
          <article className="reorder-recommendation">
            <ShoppingCart aria-hidden="true" weight="fill" />
            <span>Quantité recommandée</span>
            <strong>{selectedProduct.recommendedQuantity}</strong>
            <small>
              {selectedProduct.recommendedQuantity
                ? "exemplaires à réapprovisionner"
                : "aucun réapprovisionnement requis"}
            </small>
          </article>
        </div>
        <div className="reorder-disclaimer" role="note">
          <WarningCircle aria-hidden="true" weight="fill" />
          <p>
            <strong>Recommandation informative uniquement.</strong> Elle ne crée
            pas automatiquement de commande fournisseur.
          </p>
        </div>
      </section>
    </div>
  );
}


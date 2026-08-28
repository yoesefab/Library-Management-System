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

import {
  DEFAULT_FILTERS,
  FILTER_DEFINITIONS,
} from "../shared/dashboardFilters.jsx";
import { DashboardFilter } from "../shared/DashboardFilter.jsx";

const KPI_DATA = [
  {
    label: "Chiffre d’affaires",
    value: "284 650",
    suffix: "MAD",
    delta: "18,6 %",
    comparison: "vs 01–27 juil. 2026",
    icon: CurrencyDollar,
  },
  {
    label: "Commandes",
    value: "1 248",
    delta: "12,3 %",
    comparison: "vs 01–27 juil. 2026",
    icon: ShoppingCart,
  },
  {
    label: "Exemplaires vendus",
    value: "2 914",
    delta: "14,8 %",
    comparison: "vs 01–27 juil. 2026",
    icon: Books,
  },
  {
    label: "Panier moyen",
    value: "228,08",
    suffix: "MAD",
    delta: "5,1 %",
    comparison: "vs 01–27 juil. 2026",
    icon: ShoppingBagOpen,
  },
  {
    label: "Stock actuel",
    value: "18 642",
    delta: "—",
    comparison: "vs 27 juil. 2026",
    icon: Archive,
    tone: "neutral",
  },
  {
    label: "Produits en stock faible",
    value: "27",
    delta: "8",
    comparison: "vs 27 juil. 2026",
    icon: Warning,
    tone: "warning",
  },
  {
    label: "Produits en rupture",
    value: "6",
    delta: "2",
    comparison: "vs 27 juil. 2026",
    icon: Prohibit,
    tone: "danger",
  },
];

const TREND_DATA = [
  { date: "1 août", revenue: 9, orders: 37 },
  { date: "3 août", revenue: 23, orders: 57 },
  { date: "5 août", revenue: 28, orders: 52 },
  { date: "7 août", revenue: 22, orders: 48 },
  { date: "9 août", revenue: 45, orders: 63 },
  { date: "11 août", revenue: 38, orders: 51 },
  { date: "13 août", revenue: 52, orders: 59 },
  { date: "15 août", revenue: 27, orders: 46 },
  { date: "17 août", revenue: 58, orders: 70 },
  { date: "19 août", revenue: 63, orders: 79 },
  { date: "21 août", revenue: 46, orders: 61 },
  { date: "23 août", revenue: 52, orders: 72 },
  { date: "25 août", revenue: 79, orders: 64 },
  { date: "27 août", revenue: 57, orders: 118 },
];

const CATEGORY_DATA = [
  { name: "Roman", value: 1342, percentage: "46,0 %", color: "#14835b" },
  { name: "Jeunesse", value: 876, percentage: "30,1 %", color: "#2e8bd3" },
  { name: "Scolaire", value: 476, percentage: "16,3 %", color: "#e69a21" },
  { name: "Essai", value: 220, percentage: "7,6 %", color: "#8c73db" },
];

const LANGUAGE_DATA = [
  { name: "Français", value: 1823, percentage: "62,6 %", color: "#08734e" },
  { name: "Arabe", value: 756, percentage: "25,9 %", color: "#2e8bd3" },
  { name: "Anglais", value: 335, percentage: "11,5 %", color: "#e69a21" },
];

const BESTSELLERS = [
  ["La Boîte à merveilles", "Roman", "312"],
  ["Le Pain nu", "Roman", "287"],
  ["L’Étranger", "Roman", "241"],
  ["Antigone", "Scolaire", "198"],
  ["Les Misérables", "Roman", "176"],
];

const SLOW_MOVERS = [
  ["Atlas des roches du Maroc", "Essai", "2", "18"],
  ["Grammaire française avancée", "Scolaire", "1", "14"],
  ["Introduction à la philosophie", "Essai", "1", "12"],
  ["Dictionnaire arabe–français", "Référence", "2", "16"],
  ["Lecture et compréhension CM2", "Scolaire", "1", "10"],
];


function KpiCard({ item }) {
  const Icon = item.icon;
  const isIncrease = item.delta !== "—";
  return (
    <article
      className={`kpi-card${item.tone ? ` kpi-card--${item.tone}` : ""}`}
    >
      <Icon aria-hidden="true" className="kpi-icon" weight="regular" />
      <p className="kpi-label">{item.label}</p>
      <p className="kpi-value">
        {item.value}
        {item.suffix ? <span>{item.suffix}</span> : null}
      </p>
      <p className={`kpi-delta${isIncrease ? " is-increase" : ""}`}>
        <span>
          {isIncrease ? "↑ " : ""}
          {item.delta}
        </span>
        <small>{item.comparison}</small>
      </p>
    </article>
  );
}

function TrendChart({ dataKey, label, max, tickFormatter }) {
  return (
    <div aria-label={label} className="trend-chart" role="img">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          data={TREND_DATA}
          margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid stroke="#e6e9e7" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="date"
            interval={3}
            tick={{ fill: "#5b6170", fontSize: 10 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            domain={[0, max]}
            tick={{ fill: "#5b6170", fontSize: 10 }}
            tickFormatter={tickFormatter}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              border: "1px solid #d8ddd9",
              borderRadius: 8,
              boxShadow: "none",
              fontSize: 12,
            }}
            formatter={(value) => [
              dataKey === "revenue" ? `${value} 000 MAD` : value,
              label,
            ]}
            labelStyle={{ color: "#252936", fontWeight: 700 }}
          />
          <Line
            activeDot={{ r: 4 }}
            dataKey={dataKey}
            dot={{ r: 2.5 }}
            isAnimationActive={false}
            stroke="#08734e"
            strokeWidth={2}
            type="linear"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DistributionPanel({ title, data }) {
  return (
    <section className="distribution-panel">
      <h2>{title}</h2>
      <div className="distribution-content">
        <div aria-label={title} className="donut-chart" role="img">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="value"
                innerRadius="58%"
                isAnimationActive={false}
                outerRadius="92%"
                paddingAngle={1}
                stroke="#ffffff"
                strokeWidth={1}
              >
                {data.map((item) => (
                  <Cell fill={item.color} key={item.name} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="distribution-legend">
          {data.map((item) => (
            <div className="legend-row" key={item.name}>
              <span className="legend-name">
                <i style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span>{item.value.toLocaleString("fr-FR")}</span>
              <strong>{item.percentage}</strong>
            </div>
          ))}
          <div className="legend-row legend-total">
            <span>Total</span>
            <strong>2 914</strong>
            <strong>100 %</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductTable({ columns, onNavigateProducts, rows, title }) {
  return (
    <section className="dashboard-table-panel">
      <h2>{title}</h2>
      <div className="compact-table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="table-link" onClick={onNavigateProducts} type="button">
        Voir tous les produits <span aria-hidden="true">›</span>
      </button>
    </section>
  );
}

function StockRiskTable({ onNavigateProducts }) {
  return (
    <section className="dashboard-table-panel stock-risk-panel">
      <h2>Résumé des stocks à risque</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Statut</th>
            <th scope="col">Produits</th>
            <th scope="col">Exemplaires</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Stock faible (≤ 5)</td>
            <td>27</td>
            <td>89</td>
          </tr>
          <tr>
            <td>Rupture de stock</td>
            <td>6</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      <button className="table-link" onClick={onNavigateProducts} type="button">
        Voir tous les produits <span aria-hidden="true">›</span>
      </button>
    </section>
  );
}

function DashboardStates() {
  const [retrying, setRetrying] = useState(false);

  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => setRetrying(false), 900);
  };

  return (
    <section
      aria-labelledby="dashboard-states-title"
      className="dashboard-states"
    >
      <h2 id="dashboard-states-title">États des données</h2>
      <div className="dashboard-state-grid">
        <article
          aria-busy="true"
          className="dashboard-state-card loading-state-card"
        >
          <h3>Chargement</h3>
          <div aria-hidden="true" className="skeleton-table">
            {[0, 1, 2, 3].map((row) => (
              <span key={row}>
                <i />
                <i />
                <i />
              </span>
            ))}
          </div>
        </article>
        <article className="dashboard-state-card empty-state-card">
          <h3>Aucun résultat pour ces filtres</h3>
          <Archive aria-hidden="true" />
          <p>Aucun résultat pour ces filtres.</p>
          <small>Essayez en modifiant vos critères.</small>
        </article>
        <article className="dashboard-state-card error-state-card" role="alert">
          <h3>Impossible de charger les données</h3>
          <div>
            <Warning aria-hidden="true" />
            <p>
              <strong>Impossible de charger les données.</strong>
              <small>Veuillez réessayer.</small>
            </p>
            <button disabled={retrying} onClick={retry} type="button">
              {retrying ? (
                <CircleNotch aria-hidden="true" className="spinner" />
              ) : (
                <ArrowClockwise aria-hidden="true" />
              )}
              {retrying ? "Chargement…" : "Réessayer"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

export function DashboardContent({ onNavigateProducts }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="management-dashboard">
      <section aria-label="Filtres partagés" className="dashboard-filter-bar">
        {FILTER_DEFINITIONS.map((definition) => (
          <DashboardFilter
            definition={definition}
            key={definition.key}
            onChange={updateFilter}
            value={filters[definition.key]}
          />
        ))}
        <button
          className="reset-filters"
          onClick={() => setFilters(DEFAULT_FILTERS)}
          type="button"
        >
          <ArrowClockwise aria-hidden="true" />
          Réinitialiser
        </button>
      </section>

      <section aria-label="Indicateurs clés" className="kpi-grid">
        {KPI_DATA.map((item) => (
          <KpiCard item={item} key={item.label} />
        ))}
      </section>

      <section aria-label="Tendances" className="trends-grid">
        <article className="trend-panel">
          <h2>Évolution du chiffre d’affaires (MAD)</h2>
          <TrendChart
            dataKey="revenue"
            label="Chiffre d’affaires"
            max={85}
            tickFormatter={(value) => `${value}k`}
          />
        </article>
        <article className="trend-panel">
          <h2>Évolution des commandes</h2>
          <TrendChart
            dataKey="orders"
            label="Commandes"
            max={150}
            tickFormatter={(value) => value}
          />
        </article>
      </section>

      <section
        aria-label="Répartition des ventes"
        className="distribution-grid"
      >
        <DistributionPanel
          data={CATEGORY_DATA}
          title="Ventes par catégorie (exemplaires)"
        />
        <DistributionPanel
          data={LANGUAGE_DATA}
          title="Ventes par langue (exemplaires)"
        />
      </section>

      <section
        aria-label="Performance des produits et stock"
        className="product-insights-grid"
      >
        <ProductTable
          columns={["Produit", "Catégorie", "Ventes"]}
          onNavigateProducts={onNavigateProducts}
          rows={BESTSELLERS}
          title="Meilleures ventes (exemplaires)"
        />
        <ProductTable
          columns={["Produit", "Catégorie", "Ventes (30 j.)", "Stock actuel"]}
          onNavigateProducts={onNavigateProducts}
          rows={SLOW_MOVERS}
          title="Produits à faible rotation"
        />
        <StockRiskTable onNavigateProducts={onNavigateProducts} />
      </section>

      <DashboardStates />
    </div>
  );
}

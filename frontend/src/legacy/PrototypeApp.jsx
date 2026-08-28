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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ErrorMessage({ id, children }) {
  return (
    <p className="field-error" id={id} role="alert">
      <WarningCircle aria-hidden="true" weight="fill" />
      <span>{children}</span>
    </p>
  );
}

function PasswordField({
  error,
  errorId,
  id,
  onChange,
  showPassword,
  togglePassword,
  value,
}) {
  return (
    <div className="field-group">
      <label htmlFor={id}>Mot de passe</label>
      <div
        className={`field-control password-control${error ? " is-invalid" : ""}`}
      >
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="current-password"
          id={id}
          name="password"
          onChange={onChange}
          placeholder="••••••••••••"
          type={showPassword ? "text" : "password"}
          value={value}
        />
        <button
          aria-controls={id}
          aria-pressed={showPassword}
          className="password-toggle"
          onClick={togglePassword}
          type="button"
        >
          {showPassword
            ? "Masquer le mot de passe"
            : "Afficher le mot de passe"}
        </button>
      </div>
      {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
    </div>
  );
}

function PreviewInput({ children, invalid = false, password = false }) {
  return (
    <div
      aria-invalid={invalid || undefined}
      className={`preview-input${invalid ? " is-invalid" : ""}${password ? " has-action" : ""}`}
    >
      <span>{children}</span>
      {password ? (
        <span className="preview-action">Afficher le mot de passe</span>
      ) : null}
    </div>
  );
}

function StatePreview() {
  return (
    <aside
      aria-label="Aperçu des états du formulaire"
      className="state-preview"
    >
      <section className="state-section">
        <h2>Validation — Adresse e-mail invalide</h2>
        <div className="preview-field">
          <span className="preview-label">Adresse e-mail</span>
          <PreviewInput invalid>prenom.nom@maarifculture</PreviewInput>
          <ErrorMessage>Saisissez une adresse e-mail valide.</ErrorMessage>
        </div>
      </section>

      <section className="state-section">
        <h2>Validation — Mot de passe requis</h2>
        <div className="preview-field">
          <span className="preview-label">Adresse e-mail</span>
          <PreviewInput>prenom.nom@maarifculture.ma</PreviewInput>
        </div>
        <div className="preview-field">
          <span className="preview-label">Mot de passe</span>
          <PreviewInput invalid password />
          <ErrorMessage>Le mot de passe est requis.</ErrorMessage>
        </div>
      </section>

      <section className="state-section">
        <h2>Erreur d’authentification</h2>
        <div className="authentication-error" role="alert">
          <WarningCircle aria-hidden="true" weight="fill" />
          <span>Adresse e-mail ou mot de passe incorrect.</span>
        </div>
        <div className="preview-field">
          <span className="preview-label">Adresse e-mail</span>
          <PreviewInput>prenom.nom@maarifculture.ma</PreviewInput>
        </div>
        <div className="preview-field">
          <span className="preview-label">Mot de passe</span>
          <PreviewInput invalid password>
            ••••••••••••
          </PreviewInput>
        </div>
      </section>

      <section className="state-section loading-section">
        <h2>État de chargement</h2>
        <button
          className="submit-button preview-loading"
          disabled
          type="button"
        >
          <CircleNotch aria-hidden="true" className="spinner" />
          <span>Connexion en cours…</span>
        </button>
      </section>
    </aside>
  );
}

function LoginPage() {
  const emailId = useId();
  const emailErrorId = `${emailId}-error`;
  const passwordId = useId();
  const passwordErrorId = `${passwordId}-error`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authenticationError, setAuthenticationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Connexion — Maarif Analytics";
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Saisissez une adresse e-mail valide.";
    }

    if (!password) {
      nextErrors.password = "Le mot de passe est requis.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAuthenticationError(false);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setAuthenticationError(true);
    }, 1200);
  };

  return (
    <main className="login-page">
      <div className="login-shell">
        <section aria-labelledby="login-title" className="login-column">
          <div className="brand" aria-label="Maarif Analytics">
            <BookOpen aria-hidden="true" className="brand-icon" weight="fill" />
            <span className="brand-name">
              <strong>Maarif</strong> Analytics
            </span>
          </div>

          <div className="brand-rule" aria-hidden="true" />

          <div className="form-region">
            <h1 id="login-title">Connectez-vous à votre espace</h1>

            {authenticationError ? (
              <div className="authentication-error live-error" role="alert">
                <WarningCircle aria-hidden="true" weight="fill" />
                <span>Adresse e-mail ou mot de passe incorrect.</span>
              </div>
            ) : null}

            <form noValidate onSubmit={handleSubmit}>
              <div className="field-group">
                <label htmlFor={emailId}>Adresse e-mail</label>
                <div
                  className={`field-control${errors.email ? " is-invalid" : ""}`}
                >
                  <input
                    aria-describedby={errors.email ? emailErrorId : undefined}
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="email"
                    id={emailId}
                    inputMode="email"
                    name="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (errors.email) {
                        setErrors((current) => ({
                          ...current,
                          email: undefined,
                        }));
                      }
                      setAuthenticationError(false);
                    }}
                    placeholder="prenom.nom@maarifculture.ma"
                    type="email"
                    value={email}
                  />
                </div>
                {errors.email ? (
                  <ErrorMessage id={emailErrorId}>{errors.email}</ErrorMessage>
                ) : null}
              </div>

              <PasswordField
                error={errors.password}
                errorId={passwordErrorId}
                id={passwordId}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password) {
                    setErrors((current) => ({
                      ...current,
                      password: undefined,
                    }));
                  }
                  setAuthenticationError(false);
                }}
                showPassword={showPassword}
                togglePassword={() => setShowPassword((current) => !current)}
                value={password}
              />

              <button
                className="submit-button"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <CircleNotch aria-hidden="true" className="spinner" />
                    <span>Connexion en cours…</span>
                  </>
                ) : (
                  <span>Se connecter</span>
                )}
              </button>
            </form>
          </div>
        </section>

        <StatePreview />
      </div>
    </main>
  );
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Tableau de bord", icon: ChartBar },
  { id: "products", label: "Produits", icon: BookOpen },
  { id: "inventory", label: "Inventaire", icon: Archive },
  { id: "orders", label: "Commandes", icon: ShoppingCart },
  { id: "imports", label: "Imports", icon: CloudArrowUp },
  { id: "alerts", label: "Alertes", icon: Bell },
  { id: "forecasting", label: "Prévisions", icon: TrendUp },
  { id: "reports", label: "Rapports", icon: FileText },
  { id: "administration", label: "Administration", icon: GearSix },
];

const DEFAULT_FILTERS = {
  period: "01–27 août 2026",
  category: "Toutes",
  language: "Toutes",
  author: "Tous",
  publisher: "Tous",
};

const FILTER_DEFINITIONS = [
  {
    key: "period",
    label: "Période",
    options: [
      "01–27 août 2026",
      "01–27 juillet 2026",
      "01 janvier–27 août 2026",
    ],
    icon: CalendarBlank,
  },
  {
    key: "category",
    label: "Catégorie",
    options: ["Toutes", "Roman", "Jeunesse", "Scolaire", "Essai"],
  },
  {
    key: "language",
    label: "Langue",
    options: ["Toutes", "Français", "Arabe", "Anglais"],
  },
  {
    key: "author",
    label: "Auteur",
    options: ["Tous", "Tahar Ben Jelloun", "Mohamed Choukri", "Albert Camus"],
  },
  {
    key: "publisher",
    label: "Éditeur",
    options: ["Tous", "Gallimard", "Le Seuil", "La Croisée des chemins"],
  },
];

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

const CATALOG_PRODUCTS = [
  {
    sku: "LIV-000184",
    title: "La Boîte à merveilles",
    author: "Ahmed Sefrioui",
    category: "Roman",
    language: "Français",
    price: 78,
    stock: 42,
    threshold: 8,
    active: true,
  },
  {
    sku: "LIV-000231",
    title: "Le Pain nu",
    author: "Mohamed Choukri",
    category: "Roman",
    language: "Français",
    price: 92,
    stock: 18,
    threshold: 6,
    active: true,
  },
  {
    sku: "LIV-000417",
    title: "L’Étranger",
    author: "Albert Camus",
    category: "Roman",
    language: "Français",
    price: 69,
    stock: 31,
    threshold: 10,
    active: true,
  },
  {
    sku: "LIV-000538",
    title: "Antigone",
    author: "Jean Anouilh",
    category: "Scolaire",
    language: "Français",
    price: 48.5,
    stock: 5,
    threshold: 8,
    active: true,
  },
  {
    sku: "LIV-000619",
    title: "Les Misérables — Tome I",
    author: "Victor Hugo",
    category: "Roman",
    language: "Français",
    price: 115,
    stock: 0,
    threshold: 5,
    active: true,
  },
  {
    sku: "LIV-000704",
    title: "طفولة في مراكش",
    author: "عبد المجيد بن جلون",
    category: "Roman",
    language: "Arabe",
    price: 64,
    stock: 24,
    threshold: 7,
    active: true,
  },
  {
    sku: "LIV-000819",
    title: "Le Maroc raconté aux enfants",
    author: "Leïla Slimani",
    category: "Jeunesse",
    language: "Français",
    price: 129,
    stock: 16,
    threshold: 6,
    active: true,
  },
  {
    sku: "LIV-000926",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Jeunesse",
    language: "Anglais",
    price: 84,
    stock: 9,
    threshold: 5,
    active: true,
  },
  {
    sku: "LIV-001014",
    title: "موسم الهجرة إلى الشمال",
    author: "الطيب صالح",
    category: "Roman",
    language: "Arabe",
    price: 72,
    stock: 3,
    threshold: 6,
    active: true,
  },
  {
    sku: "LIV-001108",
    title: "Atlas des roches du Maroc",
    author: "Samira El Fassi",
    category: "Essai",
    language: "Français",
    price: 245,
    stock: 18,
    threshold: 4,
    active: true,
  },
  {
    sku: "LIV-001237",
    title: "Grammaire française avancée",
    author: "Nadia Berrada",
    category: "Scolaire",
    language: "Français",
    price: 96,
    stock: 14,
    threshold: 5,
    active: true,
  },
  {
    sku: "LIV-001355",
    title: "Introduction à la philosophie",
    author: "Karim Amrani",
    category: "Essai",
    language: "Français",
    price: 105,
    stock: 12,
    threshold: 5,
    active: false,
  },
  {
    sku: "LIV-001468",
    title: "Dictionnaire arabe–français",
    author: "Collectif Maarif",
    category: "Référence",
    language: "Arabe",
    price: 189,
    stock: 16,
    threshold: 4,
    active: true,
  },
  {
    sku: "LIV-001572",
    title: "Lecture et compréhension CM2",
    author: "Salma Idrissi",
    category: "Scolaire",
    language: "Français",
    price: 54,
    stock: 10,
    threshold: 8,
    active: true,
  },
  {
    sku: "LIV-001684",
    title: "Dreams of Trespass",
    author: "Fatema Mernissi",
    category: "Essai",
    language: "Anglais",
    price: 138,
    stock: 7,
    threshold: 5,
    active: true,
  },
  {
    sku: "LIV-001793",
    title: "ذاكرة للنسيان",
    author: "محمود درويش",
    category: "Essai",
    language: "Arabe",
    price: 79,
    stock: 0,
    threshold: 5,
    active: false,
  },
  {
    sku: "LIV-001847",
    title: "Contes du Maroc",
    author: "Halima Hamdane",
    category: "Jeunesse",
    language: "Français",
    price: 75,
    stock: 22,
    threshold: 7,
    active: true,
  },
  {
    sku: "LIV-001934",
    title: "The Moor’s Account",
    author: "Laila Lalami",
    category: "Roman",
    language: "Anglais",
    price: 145,
    stock: 11,
    threshold: 5,
    active: true,
  },
];

const CATALOG_PERMISSIONS = {
  Administrateur: { view: true, edit: true, create: true, disable: true },
  Gestionnaire: { view: true, edit: true, create: true, disable: true },
  "Employé de stock": {
    view: true,
    edit: false,
    create: false,
    disable: false,
  },
};

const formatMad = (value) =>
  `${value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;

function DashboardFilter({ definition, value, onChange }) {
  const Icon = definition.icon;
  return (
    <label className={`dashboard-filter dashboard-filter--${definition.key}`}>
      <span>{definition.label}</span>
      <span className="dashboard-filter-control">
        {Icon ? <Icon aria-hidden="true" /> : null}
        <select
          aria-label={definition.label}
          onChange={(event) => onChange(definition.key, event.target.value)}
          value={value}
        >
          {definition.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <CaretDown aria-hidden="true" className="dashboard-filter-caret" />
      </span>
    </label>
  );
}

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

function DashboardContent({ onNavigateProducts }) {
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

function ProductStatus({ active, stock, threshold }) {
  if (!active)
    return (
      <span className="catalog-status catalog-status--inactive">Désactivé</span>
    );
  if (stock === 0)
    return <span className="catalog-status catalog-status--out">Rupture</span>;
  if (stock <= threshold)
    return (
      <span className="catalog-status catalog-status--low">Stock faible</span>
    );
  return <span className="catalog-status catalog-status--active">Actif</span>;
}

function CatalogDialog({ mode, onClose, product }) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        aria-labelledby="catalog-dialog-title"
        aria-modal="true"
        className="catalog-modal"
        role="dialog"
      >
        <header>
          <div>
            <p>{isCreate ? "Nouveau produit" : product?.sku}</p>
            <h2 id="catalog-dialog-title">
              {isCreate
                ? "Créer un produit"
                : isView
                  ? "Détails du produit"
                  : "Modifier le produit"}
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
        <div className="catalog-form-grid">
          <label>
            <span>SKU</span>
            <input defaultValue={product?.sku ?? "LIV-"} disabled={isView} />
          </label>
          <label className="catalog-form-field--wide">
            <span>Titre</span>
            <input defaultValue={product?.title ?? ""} disabled={isView} />
          </label>
          <label className="catalog-form-field--wide">
            <span>Auteur</span>
            <input defaultValue={product?.author ?? ""} disabled={isView} />
          </label>
          <label>
            <span>Catégorie</span>
            <select
              defaultValue={product?.category ?? "Roman"}
              disabled={isView}
            >
              <option>Roman</option>
              <option>Jeunesse</option>
              <option>Scolaire</option>
              <option>Essai</option>
              <option>Référence</option>
            </select>
          </label>
          <label>
            <span>Langue</span>
            <select
              defaultValue={product?.language ?? "Français"}
              disabled={isView}
            >
              <option>Français</option>
              <option>Arabe</option>
              <option>Anglais</option>
            </select>
          </label>
          <label>
            <span>Prix (MAD)</span>
            <input
              defaultValue={product?.price?.toFixed(2) ?? "0,00"}
              disabled={isView}
              inputMode="decimal"
            />
          </label>
          <label>
            <span>Seuil d’alerte</span>
            <input
              defaultValue={product?.threshold ?? 5}
              disabled={isView}
              inputMode="numeric"
            />
          </label>
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            onClick={onClose}
            type="button"
          >
            {isView ? "Fermer" : "Annuler"}
          </button>
          {!isView ? (
            <button
              className="catalog-primary-button"
              onClick={onClose}
              type="button"
            >
              {isCreate ? "Créer le produit" : "Enregistrer"}
            </button>
          ) : null}
        </footer>
      </section>
    </div>
  );
}

function DisableProductDialog({ onCancel, onConfirm, product }) {
  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onCancel()
      }
    >
      <section
        aria-labelledby="disable-product-title"
        aria-modal="true"
        className="catalog-modal catalog-confirm-modal"
        role="alertdialog"
      >
        <span className="catalog-confirm-icon">
          <Prohibit aria-hidden="true" />
        </span>
        <div>
          <h2 id="disable-product-title">Désactiver ce produit ?</h2>
          <p>
            <strong>{product.title}</strong> ne pourra plus être utilisé dans de
            nouvelles commandes. Son historique sera conservé.
          </p>
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            onClick={onCancel}
            type="button"
          >
            Annuler
          </button>
          <button
            className="catalog-danger-button"
            onClick={onConfirm}
            type="button"
          >
            Désactiver
          </button>
        </footer>
      </section>
    </div>
  );
}

function ProductCatalog({ onCreate, onEdit, onView, role = "Gestionnaire" }) {
  const permissions = CATALOG_PERMISSIONS[role];
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [language, setLanguage] = useState("Toutes");
  const [activeStatus, setActiveStatus] = useState("Tous");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledSkus, setDisabledSkus] = useState([]);
  const [dialog, setDialog] = useState(null);
  const pageSize = 7;

  const products = CATALOG_PRODUCTS.map((product) =>
    disabledSkus.includes(product.sku)
      ? { ...product, active: false }
      : product,
  );
  const filtered = products.filter((product) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    const matchesQuery =
      !normalizedQuery ||
      [product.sku, product.title, product.author].some((value) =>
        value.toLocaleLowerCase("fr").includes(normalizedQuery),
      );
    const matchesCategory =
      category === "Toutes" || product.category === category;
    const matchesLanguage =
      language === "Toutes" || product.language === language;
    const matchesStatus =
      activeStatus === "Tous" ||
      (activeStatus === "Actifs" ? product.active : !product.active);
    return matchesQuery && matchesCategory && matchesLanguage && matchesStatus;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleProducts = filtered.slice(
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

  const submitSearch = (event) => {
    event.preventDefault();
    runServerRequest(() => {
      setQuery(queryInput);
      setPage(1);
    });
  };

  const updateFilter = (setter, value) => {
    runServerRequest(() => {
      setter(value);
      setPage(1);
    });
  };

  return (
    <div className="product-catalog">
      <section
        className="catalog-toolbar"
        aria-label="Recherche et filtres du catalogue"
      >
        <form className="catalog-search" onSubmit={submitSearch} role="search">
          <MagnifyingGlass aria-hidden="true" />
          <label className="sr-only" htmlFor="catalog-search">
            Rechercher un produit
          </label>
          <input
            id="catalog-search"
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Rechercher par SKU, titre ou auteur"
            type="search"
            value={queryInput}
          />
          <button disabled={isLoading} type="submit">
            Rechercher
          </button>
        </form>
        <div className="catalog-filters">
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
          <label>
            <span>Statut</span>
            <select
              aria-label="Filtrer par statut actif"
              onChange={(event) =>
                updateFilter(setActiveStatus, event.target.value)
              }
              value={activeStatus}
            >
              <option>Tous</option>
              <option>Actifs</option>
              <option>Désactivés</option>
            </select>
            <CaretDown aria-hidden="true" />
          </label>
        </div>
        {permissions.create ? (
          <button
            className="catalog-create-button"
            onClick={onCreate}
            type="button"
          >
            <Plus aria-hidden="true" />
            Créer un produit
          </button>
        ) : null}
      </section>

      <section aria-labelledby="catalog-table-title" className="catalog-panel">
        <div className="catalog-panel-header">
          <div>
            <h2 id="catalog-table-title">Catalogue produits</h2>
            <p aria-live="polite">
              {isLoading
                ? "Chargement des produits…"
                : `${filtered.length} produit${filtered.length > 1 ? "s" : ""} trouvé${filtered.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <span>Dernière actualisation : 27 août 2026 à 18:32</span>
        </div>

        <div className="catalog-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">SKU</th>
                <th scope="col">Titre</th>
                <th scope="col">Auteur</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Langue</th>
                <th scope="col">Prix</th>
                <th scope="col">Stock actuel</th>
                <th scope="col">Seuil</th>
                <th scope="col">Statut</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody aria-busy={isLoading}>
              {isLoading
                ? Array.from({ length: 7 }, (_, index) => (
                    <tr className="catalog-skeleton-row" key={index}>
                      {Array.from({ length: 10 }, (__, cell) => (
                        <td key={cell}>
                          <span />
                        </td>
                      ))}
                    </tr>
                  ))
                : null}
              {!isLoading &&
                visibleProducts.map((product) => (
                  <tr key={product.sku}>
                    <td className="catalog-sku">{product.sku}</td>
                    <td
                      className="catalog-title"
                      lang={product.language === "Arabe" ? "ar" : undefined}
                      dir={product.language === "Arabe" ? "rtl" : undefined}
                    >
                      {product.title}
                    </td>
                    <td>{product.author}</td>
                    <td>{product.category}</td>
                    <td>{product.language}</td>
                    <td className="catalog-number">
                      {formatMad(product.price)}
                    </td>
                    <td
                      className={`catalog-number${product.stock <= product.threshold ? " is-stock-risk" : ""}`}
                    >
                      {product.stock}
                    </td>
                    <td className="catalog-number">{product.threshold}</td>
                    <td>
                      <ProductStatus
                        active={product.active}
                        stock={product.stock}
                        threshold={product.threshold}
                      />
                    </td>
                    <td>
                      <div className="catalog-row-actions">
                        {permissions.view ? (
                          <button
                            aria-label={`Voir ${product.title}`}
                            className="catalog-icon-button"
                            onClick={() => onView(product)}
                            title="Voir"
                            type="button"
                          >
                            <Eye aria-hidden="true" />
                          </button>
                        ) : null}
                        {permissions.edit && product.active ? (
                          <button
                            aria-label={`Modifier ${product.title}`}
                            className="catalog-icon-button"
                            onClick={() => onEdit(product)}
                            title="Modifier"
                            type="button"
                          >
                            <PencilSimple aria-hidden="true" />
                          </button>
                        ) : null}
                        {permissions.disable && product.active ? (
                          <button
                            aria-label={`Désactiver ${product.title}`}
                            className="catalog-icon-button catalog-icon-button--danger"
                            onClick={() =>
                              setDialog({ mode: "disable", product })
                            }
                            title="Désactiver"
                            type="button"
                          >
                            <Prohibit aria-hidden="true" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!isLoading && visibleProducts.length === 0 ? (
            <div className="catalog-empty">
              <Books aria-hidden="true" />
              <h3>Aucun produit trouvé</h3>
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
          <nav aria-label="Pagination du catalogue">
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

      {dialog?.mode === "disable" ? (
        <DisableProductDialog
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            setDisabledSkus((current) => [...current, dialog.product.sku]);
            setDialog(null);
          }}
          product={dialog.product}
        />
      ) : null}
    </div>
  );
}

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

function InventoryManagement() {
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

const ORDERS = [
  {
    reference: "CMD-2026-1842",
    isoDate: "2026-08-27",
    date: "27 août 2026 à 16:38",
    status: "Livrée",
    source: "Boutique Maarif",
    city: "Casablanca",
    itemCount: 3,
    total: 418.0,
  },
  {
    reference: "CMD-2026-1841",
    isoDate: "2026-08-27",
    date: "27 août 2026 à 15:52",
    status: "En préparation",
    source: "Site web",
    city: "Rabat",
    itemCount: 5,
    total: 672.5,
  },
  {
    reference: "CMD-2026-1840",
    isoDate: "2026-08-27",
    date: "27 août 2026 à 14:16",
    status: "Expédiée",
    source: "Téléphone",
    city: "Marrakech",
    itemCount: 2,
    total: 286.0,
  },
  {
    reference: "CMD-2026-1839",
    isoDate: "2026-08-27",
    date: "27 août 2026 à 11:44",
    status: "Livrée",
    source: "Boutique Maarif",
    city: "Casablanca",
    itemCount: 1,
    total: 78.0,
  },
  {
    reference: "CMD-2026-1838",
    isoDate: "2026-08-26",
    date: "26 août 2026 à 18:21",
    status: "En préparation",
    source: "Site web",
    city: "Tanger",
    itemCount: 4,
    total: 519.9,
  },
  {
    reference: "CMD-2026-1837",
    isoDate: "2026-08-26",
    date: "26 août 2026 à 16:05",
    status: "Annulée",
    source: "Site web",
    city: "Fès",
    itemCount: 2,
    total: 194.0,
  },
  {
    reference: "CMD-2026-1836",
    isoDate: "2026-08-26",
    date: "26 août 2026 à 10:32",
    status: "Livrée",
    source: "Boutique Maarif",
    city: "Casablanca",
    itemCount: 6,
    total: 845.75,
  },
  {
    reference: "CMD-2026-1835",
    isoDate: "2026-08-25",
    date: "25 août 2026 à 17:48",
    status: "Expédiée",
    source: "Téléphone",
    city: "Agadir",
    itemCount: 3,
    total: 362.5,
  },
  {
    reference: "CMD-2026-1834",
    isoDate: "2026-08-25",
    date: "25 août 2026 à 11:08",
    status: "Livrée",
    source: "Boutique Maarif",
    city: "Mohammédia",
    itemCount: 2,
    total: 207.0,
  },
  {
    reference: "CMD-2026-1833",
    isoDate: "2026-08-23",
    date: "23 août 2026 à 13:27",
    status: "Livrée",
    source: "Site web",
    city: "Rabat",
    itemCount: 7,
    total: 968.0,
  },
  {
    reference: "CMD-2026-1832",
    isoDate: "2026-08-22",
    date: "22 août 2026 à 19:04",
    status: "En préparation",
    source: "Téléphone",
    city: "Casablanca",
    itemCount: 2,
    total: 245.0,
  },
  {
    reference: "CMD-2026-1831",
    isoDate: "2026-08-20",
    date: "20 août 2026 à 09:42",
    status: "Livrée",
    source: "Boutique Maarif",
    city: "Tétouan",
    itemCount: 4,
    total: 536.5,
  },
  {
    reference: "CMD-2026-1778",
    isoDate: "2026-08-12",
    date: "12 août 2026 à 15:36",
    status: "Livrée",
    source: "Site web",
    city: "Marrakech",
    itemCount: 3,
    total: 429.0,
  },
  {
    reference: "CMD-2026-1689",
    isoDate: "2026-07-29",
    date: "29 juillet 2026 à 17:18",
    status: "Livrée",
    source: "Boutique Maarif",
    city: "Casablanca",
    itemCount: 5,
    total: 714.0,
  },
  {
    reference: "CMD-2026-1654",
    isoDate: "2026-07-18",
    date: "18 juillet 2026 à 10:07",
    status: "Annulée",
    source: "Téléphone",
    city: "Fès",
    itemCount: 1,
    total: 92.0,
  },
];

function OrderStatus({ status }) {
  const tone =
    {
      Livrée: "delivered",
      Expédiée: "shipped",
      "En préparation": "processing",
      Annulée: "cancelled",
      Brouillon: "draft",
    }[status] ?? "draft";
  return (
    <span className={`catalog-status order-status order-status--${tone}`}>
      {status}
    </span>
  );
}

const ORDER_DETAILS = {
  "CMD-2026-1841": {
    lines: [
      {
        product: "Le Pain nu",
        sku: "LIV-000231",
        quantity: 2,
        unitPrice: 58.0,
        discount: 0,
        lineTotal: 116.0,
      },
      {
        product: "Antigone",
        sku: "LIV-000538",
        quantity: 1,
        unitPrice: 92.0,
        discount: 5,
        lineTotal: 87.4,
      },
      {
        product: "طفولة في مراكش",
        sku: "LIV-000704",
        quantity: 1,
        unitPrice: 94.0,
        discount: 0,
        lineTotal: 94.0,
      },
      {
        product: "Les Misérables — Tome I",
        sku: "LIV-000619",
        quantity: 1,
        unitPrice: 375.1,
        discount: 0,
        lineTotal: 375.1,
      },
    ],
    movements: [
      {
        id: "MVT-2026-0865",
        date: "27 août 2026 à 16:02",
        product: "Le Pain nu",
        sku: "LIV-000231",
        type: "Sortie réservée",
        quantity: -2,
        balance: 18,
      },
      {
        id: "MVT-2026-0864",
        date: "27 août 2026 à 16:02",
        product: "Antigone",
        sku: "LIV-000538",
        type: "Sortie réservée",
        quantity: -1,
        balance: 5,
      },
      {
        id: "MVT-2026-0863",
        date: "27 août 2026 à 16:01",
        product: "طفولة في مراكش",
        sku: "LIV-000704",
        type: "Sortie réservée",
        quantity: -1,
        balance: 24,
      },
      {
        id: "MVT-2026-0862",
        date: "27 août 2026 à 16:01",
        product: "Les Misérables — Tome I",
        sku: "LIV-000619",
        type: "Sortie réservée",
        quantity: -1,
        balance: 0,
      },
    ],
  },
  "CMD-2026-1842": {
    lines: [
      {
        product: "La Boîte à merveilles",
        sku: "LIV-000184",
        quantity: 1,
        unitPrice: 78.0,
        discount: 0,
        lineTotal: 78.0,
      },
      {
        product: "L’Étranger",
        sku: "LIV-000417",
        quantity: 1,
        unitPrice: 140.0,
        discount: 10,
        lineTotal: 126.0,
      },
      {
        product: "Grand dictionnaire français",
        sku: "LIV-000912",
        quantity: 1,
        unitPrice: 214.0,
        discount: 0,
        lineTotal: 214.0,
      },
    ],
    movements: [
      {
        id: "MVT-2026-0861",
        date: "27 août 2026 à 16:42",
        product: "La Boîte à merveilles",
        sku: "LIV-000184",
        type: "Sortie vente",
        quantity: -1,
        balance: 42,
      },
      {
        id: "MVT-2026-0860",
        date: "27 août 2026 à 16:42",
        product: "L’Étranger",
        sku: "LIV-000417",
        type: "Sortie vente",
        quantity: -1,
        balance: 31,
      },
      {
        id: "MVT-2026-0859",
        date: "27 août 2026 à 16:41",
        product: "Grand dictionnaire français",
        sku: "LIV-000912",
        type: "Sortie vente",
        quantity: -1,
        balance: 11,
      },
    ],
  },
};

function detailsForOrder(order) {
  if (ORDER_DETAILS[order.reference]) return ORDER_DETAILS[order.reference];
  return {
    lines: [
      {
        product: "Articles de librairie",
        sku: order.reference,
        quantity: order.itemCount,
        unitPrice: order.itemCount ? order.total / order.itemCount : 0,
        discount: 0,
        lineTotal: order.total,
      },
    ],
    movements: order.itemCount
      ? [
          {
            id: `MVT-${order.reference}`,
            date: order.date,
            product: "Articles de librairie",
            sku: order.reference,
            type: "Sortie commande",
            quantity: -order.itemCount,
            balance: 12,
          },
        ]
      : [],
  };
}

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

function OrderDetailsPage({ onBack, order, role = "Gestionnaire" }) {
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

function OrdersManagement({ onView }) {
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

const SALES_IMPORT_STEPS = [
  "Téléverser",
  "Valider",
  "Aperçu",
  "Confirmer",
  "Résultats",
];
const SALES_CSV_COLUMNS = [
  ["order_reference", "Référence unique de la commande"],
  ["sale_date", "Date et heure, fuseau Africa/Casablanca"],
  ["source", "Boutique Maarif, Site web ou Téléphone"],
  ["customer_city", "Ville du client"],
  ["sku", "SKU actif du catalogue"],
  ["quantity", "Nombre entier strictement positif"],
  ["unit_price_mad", "Prix unitaire en MAD"],
  ["discount_percent", "Remise de 0 à 100"],
];
const SALES_IMPORT_PREVIEW = [
  {
    line: 2,
    reference: "CMD-WEB-2026-4187",
    date: "27 août 2026 à 18:42",
    sku: "LIV-000231",
    quantity: 2,
    price: 58,
    city: "Rabat",
    status: "Valide",
  },
  {
    line: 3,
    reference: "CMD-WEB-2026-4188",
    date: "27 août 2026 à 18:47",
    sku: "LIV-000538",
    quantity: 1,
    price: 92,
    city: "Casablanca",
    status: "Valide",
  },
  {
    line: 42,
    reference: "CMD-BTQ-2026-4212",
    date: "31 août 2026 à 25:10",
    sku: "LIV-000704",
    quantity: 1,
    price: 94,
    city: "Casablanca",
    status: "Date invalide",
  },
  {
    line: 87,
    reference: "CMD-WEB-2026-4187",
    date: "27 août 2026 à 19:12",
    sku: "LIV-000619",
    quantity: 1,
    price: 375.1,
    city: "Tanger",
    status: "Référence dupliquée",
  },
  {
    line: 126,
    reference: "CMD-TEL-2026-4251",
    date: "27 août 2026 à 19:38",
    sku: "LIV-009999",
    quantity: 1,
    price: 78,
    city: "Fès",
    status: "SKU inconnu",
  },
  {
    line: 203,
    reference: "CMD-BTQ-2026-4297",
    date: "27 août 2026 à 20:06",
    sku: "LIV-000184",
    quantity: 0,
    price: 78,
    city: "Casablanca",
    status: "Quantité invalide",
  },
];
const SALES_IMPORT_ERRORS = [
  [42, "sale_date", "Date ou heure invalide : 31/08/2026 25:10."],
  [
    87,
    "order_reference",
    "Référence CMD-WEB-2026-4187 déjà présente dans le fichier.",
  ],
  [126, "sku", "SKU LIV-009999 introuvable ou inactif."],
  [203, "quantity", "La quantité doit être supérieure à zéro."],
  [244, "unit_price_mad", "Le prix « 78,9O » n’est pas un montant valide."],
];

function SalesImportStepper({ step }) {
  return (
    <nav
      aria-label="Étapes de l’import des ventes"
      className="sales-import-stepper"
    >
      <ol>
        {SALES_IMPORT_STEPS.map((label, index) => {
          const number = index + 1;
          const completed = number < step;
          return (
            <li
              aria-current={number === step ? "step" : undefined}
              className={`${number === step ? "is-current" : ""}${completed ? " is-complete" : ""}`}
              key={label}
            >
              <span>
                {completed ? (
                  <CheckCircle aria-hidden="true" weight="fill" />
                ) : (
                  number
                )}
              </span>
              <strong>{label}</strong>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SalesImportPage({ onOpenHistory }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step !== 4 || !isImporting) return undefined;
    setProgress(18);
    const timers = [
      window.setTimeout(() => setProgress(46), 280),
      window.setTimeout(() => setProgress(74), 650),
      window.setTimeout(() => setProgress(100), 1040),
      window.setTimeout(() => setStep(5), 1400),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isImporting, step]);

  const acceptFile = (nextFile) => {
    if (!nextFile) return;
    if (!nextFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setFileError("Sélectionnez un fichier CSV dont l’extension est .csv.");
      return;
    }
    setFile(nextFile);
    setFileError("");
  };

  const validateFile = () => {
    if (!file) {
      setFileError("Ajoutez un fichier CSV avant de lancer la validation.");
      return;
    }
    setIsValidating(true);
    window.setTimeout(() => {
      setIsValidating(false);
      setStep(2);
    }, 720);
  };

  const resetImport = () => {
    setStep(1);
    setFile(null);
    setFileError("");
    setProgress(0);
    setIsImporting(false);
  };

  const errorReport = encodeURIComponent(
    [
      "line,column,error",
      ...SALES_IMPORT_ERRORS.map(
        ([line, column, message]) => `${line},${column},\"${message}\"`,
      ),
    ].join("\n"),
  );

  return (
    <div className="sales-import-page">
      <header className="sales-import-heading">
        <div>
          <p>Ventes · Fichier CSV</p>
          <h2>Importer les ventes</h2>
          <span>
            Ajoutez les ventes historiques en vérifiant les données avant leur
            enregistrement.
          </span>
        </div>
        <div className="sales-import-heading-actions">
          <button
            className="catalog-secondary-button"
            onClick={onOpenHistory}
            type="button"
          >
            <ArrowClockwise aria-hidden="true" />
            Voir l’historique
          </button>
          <div>
            <strong>Fuseau métier</strong>
            <span>Africa/Casablanca</span>
          </div>
        </div>
      </header>

      <SalesImportStepper step={step} />

      {step === 1 ? (
        <section aria-labelledby="upload-title" className="sales-import-grid">
          <article className="sales-import-panel upload-panel">
            <header>
              <CloudArrowUp aria-hidden="true" />
              <div>
                <h3 id="upload-title">Téléverser le fichier</h3>
                <p>Un fichier CSV à la fois, 10 Mo maximum.</p>
              </div>
            </header>
            <label
              className={`sales-dropzone${isDragging ? " is-dragging" : ""}${fileError ? " is-invalid" : ""}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                acceptFile(event.dataTransfer.files[0]);
              }}
            >
              <CloudArrowUp aria-hidden="true" weight="duotone" />
              <strong>Glissez-déposez votre fichier CSV ici</strong>
              <span>ou sélectionnez-le depuis votre ordinateur</span>
              <span className="sales-dropzone-button">Choisir un fichier</span>
              <input
                accept=".csv,text/csv"
                aria-describedby={fileError ? "sales-file-error" : undefined}
                aria-invalid={Boolean(fileError)}
                onChange={(event) => acceptFile(event.target.files[0])}
                type="file"
              />
            </label>
            {fileError ? (
              <ErrorMessage id="sales-file-error">{fileError}</ErrorMessage>
            ) : null}
            {file ? (
              <div className="sales-selected-file">
                <FileCsv aria-hidden="true" weight="fill" />
                <div>
                  <strong>{file.name}</strong>
                  <span>38,6 Ko · sélectionné le 27 août 2026 à 20:46</span>
                </div>
                <button
                  aria-label="Retirer le fichier"
                  onClick={() => setFile(null)}
                  type="button"
                >
                  <X aria-hidden="true" />
                </button>
              </div>
            ) : null}
            <footer className="sales-import-actions">
              <span>
                {file
                  ? "Fichier prêt à être contrôlé."
                  : "Aucun fichier sélectionné."}
              </span>
              <button
                className="catalog-primary-button"
                disabled={isValidating}
                onClick={validateFile}
                type="button"
              >
                {isValidating ? (
                  <CircleNotch aria-hidden="true" className="spinner" />
                ) : (
                  <ArrowRight aria-hidden="true" />
                )}
                {isValidating ? "Validation…" : "Valider le fichier"}
              </button>
            </footer>
          </article>

          <article className="sales-import-panel expected-columns-panel">
            <header>
              <FileText aria-hidden="true" />
              <div>
                <h3>Colonnes attendues</h3>
                <p>La première ligne doit contenir exactement ces en-têtes.</p>
              </div>
            </header>
            <dl>
              {SALES_CSV_COLUMNS.map(([column, description]) => (
                <div key={column}>
                  <dt>{column}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
            <p>
              <WarningCircle aria-hidden="true" />
              Utilisez le point comme séparateur décimal et UTF-8 pour les
              titres ou villes en arabe.
            </p>
          </article>
        </section>
      ) : null}

      {step === 2 ? (
        <section
          aria-labelledby="validation-title"
          className="sales-import-panel sales-validation-panel"
        >
          <header>
            <CheckCircle aria-hidden="true" weight="fill" />
            <div>
              <h3 id="validation-title">Validation terminée</h3>
              <p>
                {file?.name ?? "ventes_27_aout_2026.csv"} · contrôlé le 27 août
                2026 à 20:47
              </p>
            </div>
          </header>
          <div
            className="sales-validation-summary"
            aria-label="Résumé de validation"
          >
            <article>
              <span>Lignes analysées</span>
              <strong>247</strong>
              <small>hors en-tête</small>
            </article>
            <article className="is-success">
              <span>Lignes valides</span>
              <strong>242</strong>
              <small>97,9 % du fichier</small>
            </article>
            <article className="is-error">
              <span>Erreurs</span>
              <strong>5</strong>
              <small>lignes exclues</small>
            </article>
            <article className="is-warning">
              <span>Avertissements</span>
              <strong>2</strong>
              <small>à vérifier</small>
            </article>
          </div>
          <div className="sales-duplicate-warning" role="alert">
            <Warning aria-hidden="true" weight="fill" />
            <div>
              <strong>Ce fichier semble déjà avoir été importé</strong>
              <p>
                « {file?.name ?? "ventes_27_aout_2026.csv"} » a été traité le 25
                août 2026 à 18:04 par Salma Bennani. Vérifiez l’aperçu avant de
                continuer.
              </p>
            </div>
          </div>
          <div className="sales-validation-notes">
            <div>
              <CheckCircle aria-hidden="true" />
              <span>8 colonnes reconnues et correctement associées.</span>
            </div>
            <div>
              <CheckCircle aria-hidden="true" />
              <span>Encodage UTF-8 et séparateur « , » détectés.</span>
            </div>
            <div>
              <WarningCircle aria-hidden="true" />
              <span>Les 5 lignes en erreur ne seront pas importées.</span>
            </div>
          </div>
          <footer className="sales-import-actions">
            <button
              className="catalog-secondary-button"
              onClick={() => setStep(1)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" />
              Remplacer le fichier
            </button>
            <button
              className="catalog-primary-button"
              onClick={() => setStep(3)}
              type="button"
            >
              Afficher l’aperçu
              <ArrowRight aria-hidden="true" />
            </button>
          </footer>
        </section>
      ) : null}

      {step === 3 ? (
        <section
          aria-labelledby="preview-title"
          className="sales-import-panel sales-preview-panel"
        >
          <header>
            <FileText aria-hidden="true" />
            <div>
              <h3 id="preview-title">Aperçu des ventes</h3>
              <p>
                6 lignes représentatives sur 247 · les lignes invalides sont
                signalées.
              </p>
            </div>
            <span>242 prêtes à importer</span>
          </header>
          <div className="sales-preview-table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Ligne</th>
                  <th scope="col">Référence</th>
                  <th scope="col">Date</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Qté</th>
                  <th scope="col">Prix unitaire</th>
                  <th scope="col">Ville</th>
                  <th scope="col">Validation</th>
                </tr>
              </thead>
              <tbody>
                {SALES_IMPORT_PREVIEW.map((row) => {
                  const invalid = row.status !== "Valide";
                  return (
                    <tr className={invalid ? "is-invalid" : ""} key={row.line}>
                      <td>{row.line}</td>
                      <td>
                        <strong>{row.reference}</strong>
                      </td>
                      <td>
                        <time>{row.date}</time>
                      </td>
                      <td>{row.sku}</td>
                      <td>{row.quantity}</td>
                      <td>{formatMad(row.price)}</td>
                      <td>{row.city}</td>
                      <td>
                        <span
                          className={`sales-row-status${invalid ? " is-error" : ""}`}
                        >
                          {invalid ? (
                            <WarningCircle aria-hidden="true" weight="fill" />
                          ) : (
                            <CheckCircle aria-hidden="true" weight="fill" />
                          )}
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="sales-row-errors" aria-labelledby="row-errors-title">
            <div>
              <WarningCircle aria-hidden="true" weight="fill" />
              <div>
                <h4 id="row-errors-title">
                  5 erreurs à corriger dans le fichier source
                </h4>
                <p>Ces lignes seront exclues de l’import actuel.</p>
              </div>
            </div>
            <ol>
              {SALES_IMPORT_ERRORS.map(([line, column, message]) => (
                <li key={line}>
                  <strong>
                    Ligne {line} · {column}
                  </strong>
                  <span>{message}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="sales-duplicate-warning sales-duplicate-warning--compact">
            <Warning aria-hidden="true" />
            <div>
              <strong>Avertissement de doublon actif</strong>
              <p>
                Le nom et l’empreinte du fichier correspondent à un import
                antérieur.
              </p>
            </div>
          </div>
          <footer className="sales-import-actions">
            <button
              className="catalog-secondary-button"
              onClick={() => setStep(2)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" />
              Retour à la validation
            </button>
            <button
              className="catalog-primary-button"
              onClick={() => setStep(4)}
              type="button"
            >
              Continuer avec 242 lignes
              <ArrowRight aria-hidden="true" />
            </button>
          </footer>
        </section>
      ) : null}

      {step === 4 && !isImporting ? (
        <section
          aria-labelledby="confirm-title"
          className="sales-import-panel sales-confirm-panel"
        >
          <header>
            <CheckCircle aria-hidden="true" />
            <div>
              <h3 id="confirm-title">Confirmer l’import</h3>
              <p>Vérifiez le périmètre final avant d’enregistrer les ventes.</p>
            </div>
          </header>
          <div className="sales-confirm-summary">
            <dl>
              <div>
                <dt>Fichier</dt>
                <dd>{file?.name ?? "ventes_27_aout_2026.csv"}</dd>
              </div>
              <div>
                <dt>Lignes qui seront importées</dt>
                <dd>242</dd>
              </div>
              <div>
                <dt>Lignes exclues</dt>
                <dd>5</dd>
              </div>
              <div>
                <dt>Effet métier</dt>
                <dd>Création des commandes et mouvements de stock</dd>
              </div>
            </dl>
            <div>
              <Warning aria-hidden="true" weight="fill" />
              <strong>Doublon potentiel confirmé</strong>
              <p>
                Vous continuez malgré la correspondance avec l’import du 25 août
                2026 à 18:04. Les références déjà existantes resteront rejetées.
              </p>
            </div>
          </div>
          <div className="sales-confirm-callout">
            <WarningCircle aria-hidden="true" />
            <p>
              Après confirmation, 242 lignes valides seront enregistrées. Cette
              opération peut prendre quelques secondes.
            </p>
          </div>
          <footer className="sales-import-actions">
            <button
              className="catalog-secondary-button"
              onClick={() => setStep(3)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" />
              Retour à l’aperçu
            </button>
            <button
              className="catalog-primary-button"
              onClick={() => setIsImporting(true)}
              type="button"
            >
              <CheckCircle aria-hidden="true" />
              Confirmer l’import de 242 lignes
            </button>
          </footer>
        </section>
      ) : null}

      {step === 4 && isImporting ? (
        <section
          aria-labelledby="progress-title"
          className="sales-import-panel sales-progress-panel"
          aria-live="polite"
        >
          <CircleNotch aria-hidden="true" className="spinner" />
          <p>Confirmation enregistrée</p>
          <h3 id="progress-title">Importation des ventes en cours…</h3>
          <span>
            Création des commandes et enregistrement des mouvements de stock
            associés.
          </span>
          <div
            aria-label={`${progress} % importé`}
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow={progress}
            className="sales-progress-track"
            role="progressbar"
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <strong>{progress} %</strong>
          <small>Ne fermez pas cette page pendant l’import.</small>
        </section>
      ) : null}

      {step === 5 ? (
        <section
          aria-labelledby="results-title"
          className="sales-import-panel sales-results-panel"
        >
          <header>
            <CheckCircle aria-hidden="true" weight="fill" />
            <div>
              <h3 id="results-title">Import terminé</h3>
              <p>ventes_27_aout_2026.csv · terminé le 27 août 2026 à 20:48</p>
            </div>
          </header>
          <div className="sales-results-lead" role="status">
            <CheckCircle aria-hidden="true" weight="fill" />
            <div>
              <strong>242 lignes ont été importées avec succès.</strong>
              <p>
                Les commandes et mouvements de stock sont maintenant disponibles
                dans Maarif Analytics.
              </p>
            </div>
          </div>
          <div
            className="sales-result-stats"
            aria-label="Statistiques finales de l’import"
          >
            <article>
              <span>Lignes importées</span>
              <strong>242</strong>
            </article>
            <article className="is-error">
              <span>Lignes rejetées</span>
              <strong>5</strong>
            </article>
            <article>
              <span>Commandes créées</span>
              <strong>68</strong>
            </article>
            <article>
              <span>Exemplaires vendus</span>
              <strong>418</strong>
            </article>
            <article>
              <span>Chiffre d’affaires</span>
              <strong>52 940,50 MAD</strong>
            </article>
          </div>
          <div className="sales-error-report">
            <WarningCircle aria-hidden="true" />
            <div>
              <strong>5 lignes nécessitent une correction</strong>
              <p>
                Téléchargez le rapport, corrigez le fichier source, puis lancez
                un nouvel import.
              </p>
            </div>
            <a
              className="catalog-secondary-button"
              download="rapport_erreurs_ventes_27_aout_2026.csv"
              href={`data:text/csv;charset=utf-8,${errorReport}`}
            >
              <DownloadSimple aria-hidden="true" />
              Télécharger le rapport d’erreurs
            </a>
          </div>
          <footer className="sales-import-actions">
            <span>Import IMP-2026-0084</span>
            <button
              className="catalog-primary-button"
              onClick={resetImport}
              type="button"
            >
              <CloudArrowUp aria-hidden="true" />
              Importer un autre fichier
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
}

const IMPORT_HISTORY = [
  {
    id: "IMP-2026-0084",
    fileName: "ventes_27_aout_2026.csv",
    checksum: "7f2e18c134b9d7551c5317aa03b0c841",
    status: "Terminé avec erreurs",
    totalRows: 247,
    successfulRows: 242,
    failedRows: 5,
    user: "Nadia El Mansouri",
    startTime: "27 août 2026 à 20:47",
    completionTime: "27 août 2026 à 20:48",
  },
  {
    id: "IMP-2026-0083",
    fileName: "ventes_26_aout_2026.csv",
    checksum: "1ac9dd874b91d82962a72fa03256e429",
    status: "Terminé",
    totalRows: 198,
    successfulRows: 198,
    failedRows: 0,
    user: "Salma Bennani",
    startTime: "26 août 2026 à 18:12",
    completionTime: "26 août 2026 à 18:13",
  },
  {
    id: "IMP-2026-0082",
    fileName: "ventes_25_aout_2026.csv",
    checksum: "8a4d992b88d823f70d2c37b3380f278d",
    status: "Échec",
    totalRows: 321,
    successfulRows: 0,
    failedRows: 321,
    user: "Salma Bennani",
    startTime: "25 août 2026 à 18:04",
    completionTime: "25 août 2026 à 18:05",
  },
  {
    id: "IMP-2026-0081",
    fileName: "rattrapage_ventes_24_aout.csv",
    checksum: "f349acce244ea52e6aba5166d293f9e2",
    status: "Terminé avec erreurs",
    totalRows: 88,
    successfulRows: 86,
    failedRows: 2,
    user: "Yassine Alaoui",
    startTime: "25 août 2026 à 09:14",
    completionTime: "25 août 2026 à 09:15",
  },
  {
    id: "IMP-2026-0080",
    fileName: "ventes_24_aout_2026.csv",
    checksum: "9c408e353dc601a50ad89db9f6f09ac7",
    status: "Terminé",
    totalRows: 276,
    successfulRows: 276,
    failedRows: 0,
    user: "Nadia El Mansouri",
    startTime: "24 août 2026 à 18:21",
    completionTime: "24 août 2026 à 18:22",
  },
  {
    id: "IMP-2026-0079",
    fileName: "ventes_boutique_23_aout.csv",
    checksum: "3d8654c327a07113642449ab96de28e1",
    status: "Terminé",
    totalRows: 143,
    successfulRows: 143,
    failedRows: 0,
    user: "Imane Zahraoui",
    startTime: "23 août 2026 à 20:11",
    completionTime: "23 août 2026 à 20:12",
  },
  {
    id: "IMP-2026-0078",
    fileName: "ventes_web_23_aout.csv",
    checksum: "05f51fc0ec8a2385084bf7475d2cd22d",
    status: "Terminé avec erreurs",
    totalRows: 179,
    successfulRows: 176,
    failedRows: 3,
    user: "Imane Zahraoui",
    startTime: "23 août 2026 à 19:36",
    completionTime: "23 août 2026 à 19:37",
  },
  {
    id: "IMP-2026-0077",
    fileName: "ventes_22_aout_2026.csv",
    checksum: "828584850803fbda7084893812833b12",
    status: "Terminé",
    totalRows: 214,
    successfulRows: 214,
    failedRows: 0,
    user: "Salma Bennani",
    startTime: "22 août 2026 à 18:03",
    completionTime: "22 août 2026 à 18:04",
  },
  {
    id: "IMP-2026-0076",
    fileName: "ventes_21_aout_2026.csv",
    checksum: "f48254d98633b7383008ac817f935221",
    status: "Annulé",
    totalRows: 205,
    successfulRows: 81,
    failedRows: 0,
    user: "Yassine Alaoui",
    startTime: "21 août 2026 à 18:16",
    completionTime: "21 août 2026 à 18:17",
  },
  {
    id: "IMP-2026-0075",
    fileName: "ventes_20_aout_2026.csv",
    checksum: "b20bc03dd203dc3979e4996454f65d19",
    status: "Terminé",
    totalRows: 233,
    successfulRows: 233,
    failedRows: 0,
    user: "Nadia El Mansouri",
    startTime: "20 août 2026 à 18:06",
    completionTime: "20 août 2026 à 18:07",
  },
  {
    id: "IMP-2026-0074",
    fileName: "ventes_19_aout_2026.csv",
    checksum: "2632031416ed3a58378664ce90b23c29",
    status: "Terminé avec erreurs",
    totalRows: 221,
    successfulRows: 217,
    failedRows: 4,
    user: "Salma Bennani",
    startTime: "19 août 2026 à 18:09",
    completionTime: "19 août 2026 à 18:10",
  },
];

function ImportHistoryStatus({ status }) {
  const tone =
    status === "Terminé"
      ? "success"
      : status === "Terminé avec erreurs"
        ? "warning"
        : status === "Échec"
          ? "error"
          : "neutral";
  return (
    <span className={`import-history-status import-history-status--${tone}`}>
      {status === "Terminé" ? (
        <CheckCircle aria-hidden="true" weight="fill" />
      ) : status === "Annulé" ? (
        <Prohibit aria-hidden="true" />
      ) : (
        <WarningCircle aria-hidden="true" weight="fill" />
      )}
      {status}
    </span>
  );
}

function errorsForImport(item) {
  if (item.id === "IMP-2026-0084") return SALES_IMPORT_ERRORS;
  if (item.failedRows === 0) return [];
  if (item.status === "Échec")
    return [
      [
        1,
        "en-têtes",
        "Les colonnes attendues ne correspondent pas au modèle des ventes.",
      ],
      [2, "sale_date", "Format de date non reconnu."],
      [3, "sku", "SKU manquant."],
      [4, "quantity", "Quantité non numérique."],
      [5, "order_reference", "Référence de commande vide."],
    ];
  return SALES_IMPORT_ERRORS.slice(
    0,
    Math.min(item.failedRows, SALES_IMPORT_ERRORS.length),
  );
}

function importErrorReport(item) {
  const rows = errorsForImport(item);
  return encodeURIComponent(
    [
      "line,column,error",
      ...rows.map(
        ([line, column, message]) => `${line},${column},\"${message}\"`,
      ),
    ].join("\n"),
  );
}

function ImportHistoryDialog({ item, onClose }) {
  const errors = errorsForImport(item);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="catalog-modal-backdrop" role="presentation">
      <section
        aria-labelledby="import-history-dialog-title"
        aria-modal="true"
        className="catalog-modal import-history-dialog"
        role="dialog"
      >
        <header>
          <div className="import-history-dialog-title">
            <FileCsv aria-hidden="true" weight="fill" />
            <div>
              <span>{item.id}</span>
              <h2 id="import-history-dialog-title">{item.fileName}</h2>
            </div>
          </div>
          <button
            aria-label="Fermer le détail de l’import"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="import-history-dialog-body">
          <div className="import-history-dialog-lead">
            <ImportHistoryStatus status={item.status} />
            <span>
              {item.successfulRows} lignes réussies sur {item.totalRows}
            </span>
          </div>
          <dl className="import-history-details">
            <div>
              <dt>Empreinte du fichier</dt>
              <dd>
                <code>{item.checksum}</code>
              </dd>
            </div>
            <div>
              <dt>Utilisateur</dt>
              <dd>{item.user}</dd>
            </div>
            <div>
              <dt>Début</dt>
              <dd>{item.startTime}</dd>
            </div>
            <div>
              <dt>Fin</dt>
              <dd>{item.completionTime}</dd>
            </div>
            <div>
              <dt>Lignes totales</dt>
              <dd>{item.totalRows}</dd>
            </div>
            <div>
              <dt>Lignes en échec</dt>
              <dd>{item.failedRows}</dd>
            </div>
          </dl>
          <section
            aria-labelledby="import-error-list-title"
            className="import-history-error-section"
          >
            <header>
              <WarningCircle aria-hidden="true" weight="fill" />
              <div>
                <h3 id="import-error-list-title">Erreurs de l’import</h3>
                <p>
                  {item.failedRows
                    ? `${errors.length} erreur${errors.length > 1 ? "s" : ""} affichée${errors.length > 1 ? "s" : ""} sur ${item.failedRows}`
                    : "Aucune erreur enregistrée"}
                </p>
              </div>
            </header>
            {errors.length ? (
              <div className="import-history-error-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Ligne</th>
                      <th scope="col">Colonne</th>
                      <th scope="col">Erreur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map(([line, column, message]) => (
                      <tr key={`${line}-${column}`}>
                        <td>{line}</td>
                        <td>
                          <code>{column}</code>
                        </td>
                        <td>{message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="import-history-no-errors">
                <CheckCircle aria-hidden="true" weight="fill" />
                <p>Ce fichier ne contient aucune ligne rejetée.</p>
              </div>
            )}
          </section>
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            onClick={onClose}
            type="button"
          >
            Fermer
          </button>
          {item.failedRows ? (
            <a
              className="catalog-primary-button"
              download={`rapport_erreurs_${item.id.toLowerCase()}.csv`}
              href={`data:text/csv;charset=utf-8,${importErrorReport(item)}`}
            >
              <DownloadSimple aria-hidden="true" />
              Télécharger le rapport d’erreurs
            </a>
          ) : null}
        </footer>
      </section>
    </div>
  );
}

function ImportHistoryPage() {
  const [page, setPage] = useState(1);
  const [selectedImport, setSelectedImport] = useState(null);
  const pageSize = 6;
  const pageCount = Math.ceil(IMPORT_HISTORY.length / pageSize);
  const visibleImports = IMPORT_HISTORY.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <div className="import-history-page">
      <header className="import-history-heading">
        <div>
          <p>Ventes · Fichiers CSV</p>
          <h2>Historique des imports</h2>
          <span>
            Consultez les traitements, les volumes et les rejets de chaque
            fichier.
          </span>
        </div>
      </header>
      <section
        aria-labelledby="import-history-title"
        className="catalog-panel import-history-panel"
      >
        <div className="catalog-panel-header">
          <div>
            <h2 id="import-history-title">Imports récents</h2>
            <p>{IMPORT_HISTORY.length} imports</p>
          </div>
          <span>Dernière actualisation : 27 août 2026 à 20:48</span>
        </div>
        <div className="catalog-table-scroll import-history-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Fichier</th>
                <th scope="col">Empreinte</th>
                <th scope="col">Statut</th>
                <th scope="col">Total</th>
                <th scope="col">Réussies</th>
                <th scope="col">Échecs</th>
                <th scope="col">Utilisateur</th>
                <th scope="col">Début</th>
                <th scope="col">Fin</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleImports.map((item) => (
                <tr key={item.id}>
                  <td className="import-history-file">
                    <strong>{item.fileName}</strong>
                    <span>{item.id}</span>
                  </td>
                  <td>
                    <code title={`Empreinte : ${item.checksum}`}>
                      {item.checksum.slice(0, 8)}…{item.checksum.slice(-4)}
                    </code>
                  </td>
                  <td>
                    <ImportHistoryStatus status={item.status} />
                  </td>
                  <td className="catalog-number">{item.totalRows}</td>
                  <td className="catalog-number import-history-success">
                    {item.successfulRows}
                  </td>
                  <td
                    className={`catalog-number${item.failedRows ? " import-history-failed" : ""}`}
                  >
                    {item.failedRows}
                  </td>
                  <td>{item.user}</td>
                  <td>
                    <time>{item.startTime}</time>
                  </td>
                  <td>
                    <time>{item.completionTime}</time>
                  </td>
                  <td>
                    <div className="catalog-row-actions">
                      <button
                        aria-label={`Ouvrir l’import ${item.id}`}
                        className="catalog-icon-button"
                        onClick={() => setSelectedImport(item)}
                        title="Ouvrir"
                        type="button"
                      >
                        <Eye aria-hidden="true" />
                      </button>
                      {item.failedRows ? (
                        <a
                          aria-label={`Télécharger le rapport d’erreurs de l’import ${item.id}`}
                          className="catalog-icon-button"
                          download={`rapport_erreurs_${item.id.toLowerCase()}.csv`}
                          href={`data:text/csv;charset=utf-8,${importErrorReport(item)}`}
                          title="Télécharger le rapport d’erreurs"
                        >
                          <DownloadSimple aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="catalog-pagination">
          <p>
            Affichage de {(page - 1) * pageSize + 1} à{" "}
            {Math.min(page * pageSize, IMPORT_HISTORY.length)} sur{" "}
            {IMPORT_HISTORY.length}
          </p>
          <nav aria-label="Pagination de l’historique des imports">
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
      {selectedImport ? (
        <ImportHistoryDialog
          item={selectedImport}
          onClose={() => setSelectedImport(null)}
        />
      ) : null}
    </div>
  );
}

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

function StockAlertsPage() {
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

function ForecastingPage() {
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

const REPORT_OPTIONS = [
  {
    id: "sales",
    title: "Rapport des ventes",
    description: "Commandes, quantités, remises et chiffre d’affaires.",
    detail: "1 248 commandes · 2 914 exemplaires",
    icon: ChartLineUp,
  },
  {
    id: "inventory",
    title: "État de l’inventaire",
    description: "Stock actuel, valorisation et couverture par produit.",
    detail: "1 486 produits actifs",
    icon: Archive,
  },
  {
    id: "low-stock",
    title: "Produits en stock faible",
    description: "Produits sous leur seuil minimum ou en rupture.",
    detail: "33 produits concernés",
    icon: WarningCircle,
  },
  {
    id: "reorder",
    title: "Réapprovisionnements",
    description: "Quantités recommandées selon stock et prévisions.",
    detail: "27 recommandations actives",
    icon: Truck,
  },
  {
    id: "management",
    title: "Rapport mensuel de gestion",
    description: "Synthèse des ventes, marges, stocks et alertes du mois.",
    detail: "Août 2026 · Synthèse direction",
    icon: FileText,
  },
];

function ReportOption({ option, selected, onSelect }) {
  const Icon = option.icon;
  return (
    <label className={`report-option${selected ? " is-selected" : ""}`}>
      <input
        checked={selected}
        name="report-type"
        onChange={() => onSelect(option.id)}
        type="radio"
        value={option.id}
      />
      <span className="report-option-icon">
        <Icon aria-hidden="true" weight={selected ? "fill" : "regular"} />
      </span>
      <span className="report-option-content">
        <strong>{option.title}</strong>
        <small>{option.description}</small>
        <em>{option.detail}</em>
      </span>
      <span aria-hidden="true" className="report-option-check">
        {selected ? <CheckCircle weight="fill" /> : null}
      </span>
    </label>
  );
}

function ReportsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedReportId, setSelectedReportId] = useState("sales");
  const [exportState, setExportState] = useState(null);
  const [monthlyPdfFailed, setMonthlyPdfFailed] = useState(false);
  const selectedReport =
    REPORT_OPTIONS.find((option) => option.id === selectedReportId) ??
    REPORT_OPTIONS[0];
  const SelectedReportIcon = selectedReport.icon;
  const isGenerating = exportState?.status === "progress";

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setExportState(null);
  };

  const selectReport = (id) => {
    setSelectedReportId(id);
    setExportState(null);
  };

  const handleExport = (format) => {
    setExportState({ status: "progress", format, progress: 18 });
    window.setTimeout(
      () =>
        setExportState((current) =>
          current?.status === "progress"
            ? { ...current, progress: 54 }
            : current,
        ),
      260,
    );
    window.setTimeout(
      () =>
        setExportState((current) =>
          current?.status === "progress"
            ? { ...current, progress: 82 }
            : current,
        ),
      560,
    );
    window.setTimeout(() => {
      if (
        selectedReportId === "management" &&
        format === "PDF" &&
        !monthlyPdfFailed
      ) {
        setMonthlyPdfFailed(true);
        setExportState({
          status: "error",
          format,
          message:
            "Le document PDF n’a pas pu être généré. Le service d’export est momentanément indisponible.",
        });
        return;
      }
      const timestamp = "27-08-2026_22-34";
      const extension = format.toLowerCase();
      setExportState({
        status: "success",
        format,
        fileName: `maarif_${selectedReportId}_${timestamp}.${extension}`,
      });
    }, 980);
  };

  const reportContents =
    selectedReportId === "sales"
      ? [
          "Référence et date de commande",
          "Produit, quantité et remise",
          "Source, ville et total en MAD",
        ]
      : selectedReportId === "inventory"
        ? [
            "SKU et informations produit",
            "Stock actuel et valeur d’inventaire",
            "Seuil minimum et statut de stock",
          ]
        : selectedReportId === "low-stock"
          ? [
              "Produit et niveau de stock",
              "Seuil minimum et écart",
              "Sévérité et date de l’alerte",
            ]
          : selectedReportId === "reorder"
            ? [
                "Stock, délai et stock de sécurité",
                "Point de commande",
                "Quantité recommandée",
              ]
            : [
                "Synthèse des ventes et marges",
                "Situation des stocks et alertes",
                "Recommandations de gestion",
              ];

  return (
    <div className="reports-page">
      <section
        aria-label="Filtres des rapports"
        className="report-filter-panel"
      >
        <div className="report-filter-heading">
          <div>
            <p>Données du rapport</p>
            <h2>Définir le périmètre</h2>
          </div>
          <span>Fuseau horaire : Africa/Casablanca</span>
        </div>
        <div className="report-filter-grid">
          {FILTER_DEFINITIONS.map((definition) => (
            <DashboardFilter
              definition={definition}
              key={definition.key}
              onChange={updateFilter}
              value={filters[definition.key]}
            />
          ))}
          <button
            className="reset-filters report-reset-filters"
            onClick={() => {
              setFilters(DEFAULT_FILTERS);
              setExportState(null);
            }}
            type="button"
          >
            <ArrowClockwise aria-hidden="true" />
            Réinitialiser
          </button>
        </div>
      </section>

      <section
        aria-labelledby="report-options-title"
        className="report-options-panel"
      >
        <header>
          <div>
            <p>Étape 1</p>
            <h2 id="report-options-title">Choisir un rapport</h2>
          </div>
          <span>Un seul rapport peut être exporté à la fois.</span>
        </header>
        <div
          className="report-options-grid"
          role="radiogroup"
          aria-labelledby="report-options-title"
        >
          {REPORT_OPTIONS.map((option) => (
            <ReportOption
              key={option.id}
              onSelect={selectReport}
              option={option}
              selected={selectedReportId === option.id}
            />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="report-export-title"
        className="report-export-panel"
      >
        <div className="report-export-main">
          <header>
            <div>
              <p>Étape 2</p>
              <h2 id="report-export-title">Préparer l’export</h2>
            </div>
            <span className="report-selected-label">
              <CheckCircle aria-hidden="true" weight="fill" />
              {selectedReport.title}
            </span>
          </header>

          {exportState?.status === "progress" ? (
            <div
              aria-busy="true"
              aria-live="polite"
              className="report-export-feedback report-export-progress"
            >
              <CircleNotch aria-hidden="true" className="spinner" />
              <div>
                <strong>Génération du rapport {exportState.format}…</strong>
                <span>Préparation et mise en forme des données.</span>
                <div
                  aria-label={`Progression : ${exportState.progress} %`}
                  aria-valuemax="100"
                  aria-valuemin="0"
                  aria-valuenow={exportState.progress}
                  className="report-progress-track"
                  role="progressbar"
                >
                  <i style={{ width: `${exportState.progress}%` }} />
                </div>
                <small>{exportState.progress} %</small>
              </div>
            </div>
          ) : null}
          {exportState?.status === "success" ? (
            <div
              aria-live="polite"
              className="report-export-feedback report-export-success"
              role="status"
            >
              <CheckCircle aria-hidden="true" weight="fill" />
              <div>
                <strong>Rapport généré avec succès.</strong>
                <span>{exportState.fileName}</span>
              </div>
              <button
                aria-label="Fermer le message de réussite"
                onClick={() => setExportState(null)}
                type="button"
              >
                <X aria-hidden="true" />
              </button>
            </div>
          ) : null}
          {exportState?.status === "error" ? (
            <div
              aria-live="assertive"
              className="report-export-feedback report-export-error"
              role="alert"
            >
              <WarningCircle aria-hidden="true" weight="fill" />
              <div>
                <strong>Échec de l’export {exportState.format}</strong>
                <span>{exportState.message}</span>
              </div>
              <button
                onClick={() => handleExport(exportState.format)}
                type="button"
              >
                <ArrowClockwise aria-hidden="true" />
                Réessayer
              </button>
            </div>
          ) : null}

          <div className="report-export-summary">
            <article>
              <span className="report-summary-icon">
                <SelectedReportIcon aria-hidden="true" />
              </span>
              <div>
                <p>Rapport sélectionné</p>
                <h3>{selectedReport.title}</h3>
                <span>{selectedReport.description}</span>
              </div>
            </article>
            <dl>
              <div>
                <dt>Période</dt>
                <dd>{filters.period}</dd>
              </div>
              <div>
                <dt>Catégorie</dt>
                <dd>{filters.category}</dd>
              </div>
              <div>
                <dt>Langue</dt>
                <dd>{filters.language}</dd>
              </div>
              <div>
                <dt>Auteur</dt>
                <dd>{filters.author}</dd>
              </div>
              <div>
                <dt>Éditeur</dt>
                <dd>{filters.publisher}</dd>
              </div>
            </dl>
          </div>

          <div className="report-content-list">
            <h3>Contenu inclus</h3>
            <ul>
              {reportContents.map((item) => (
                <li key={item}>
                  <CheckCircle aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="report-export-actions">
          <header>
            <DownloadSimple aria-hidden="true" />
            <div>
              <h3>Format d’export</h3>
              <p>Le fichier respecte les filtres appliqués.</p>
            </div>
          </header>
          <button
            className="report-format-button report-format-button--csv"
            disabled={isGenerating}
            onClick={() => handleExport("CSV")}
            type="button"
          >
            <FileCsv aria-hidden="true" weight="fill" />
            <span>
              <strong>Exporter en CSV</strong>
              <small>Données structurées · UTF-8</small>
            </span>
            <DownloadSimple aria-hidden="true" />
          </button>
          <button
            className="report-format-button report-format-button--pdf"
            disabled={isGenerating}
            onClick={() => handleExport("PDF")}
            type="button"
          >
            <FileText aria-hidden="true" weight="fill" />
            <span>
              <strong>Exporter en PDF</strong>
              <small>Document prêt à partager</small>
            </span>
            <DownloadSimple aria-hidden="true" />
          </button>
          <p className="report-export-note">
            <WarningCircle aria-hidden="true" />
            Les exports utilisent uniquement des données synthétiques dans ce
            prototype.
          </p>
        </aside>
      </section>
    </div>
  );
}

const ADMIN_USERS = [
  {
    id: "USR-001",
    fullName: "Nadia El Mansouri",
    email: "nadia.elmansouri@maarifculture.ma",
    role: "Administrateur",
    active: true,
    createdAt: "12 février 2024 à 09:15",
  },
  {
    id: "USR-002",
    fullName: "Youssef Alaoui",
    email: "youssef.alaoui@maarifculture.ma",
    role: "Gestionnaire",
    active: true,
    createdAt: "03 avril 2024 à 11:42",
  },
  {
    id: "USR-003",
    fullName: "Salma Berrada",
    email: "salma.berrada@maarifculture.ma",
    role: "Employé de stock",
    active: true,
    createdAt: "21 mai 2024 à 08:30",
  },
  {
    id: "USR-004",
    fullName: "Omar Idrissi",
    email: "omar.idrissi@maarifculture.ma",
    role: "Employé de stock",
    active: false,
    createdAt: "14 juin 2024 à 15:18",
  },
  {
    id: "USR-005",
    fullName: "Imane Benjelloun",
    email: "imane.benjelloun@maarifculture.ma",
    role: "Gestionnaire",
    active: true,
    createdAt: "09 septembre 2024 à 10:06",
  },
  {
    id: "USR-006",
    fullName: "Amine Chraïbi",
    email: "amine.chraibi@maarifculture.ma",
    role: "Employé de stock",
    active: true,
    createdAt: "18 novembre 2024 à 14:37",
  },
  {
    id: "USR-007",
    fullName: "Sara El Fassi",
    email: "sara.elfassi@maarifculture.ma",
    role: "Gestionnaire",
    active: false,
    createdAt: "06 janvier 2025 à 16:25",
  },
  {
    id: "USR-008",
    fullName: "Mehdi Tazi",
    email: "mehdi.tazi@maarifculture.ma",
    role: "Employé de stock",
    active: true,
    createdAt: "27 février 2025 à 09:54",
  },
  {
    id: "USR-009",
    fullName: "Khadija Aït Lahcen",
    email: "khadija.aitlahcen@maarifculture.ma",
    role: "Employé de stock",
    active: true,
    createdAt: "15 avril 2025 à 13:12",
  },
  {
    id: "USR-010",
    fullName: "Anas Lahlou",
    email: "anas.lahlou@maarifculture.ma",
    role: "Gestionnaire",
    active: true,
    createdAt: "02 juin 2025 à 10:48",
  },
  {
    id: "USR-011",
    fullName: "Meryem Skalli",
    email: "meryem.skalli@maarifculture.ma",
    role: "Administrateur",
    active: true,
    createdAt: "19 septembre 2025 à 08:40",
  },
  {
    id: "USR-012",
    fullName: "Hicham Amrani",
    email: "hicham.amrani@maarifculture.ma",
    role: "Employé de stock",
    active: false,
    createdAt: "11 mars 2026 à 17:03",
  },
];

function AdminRoleBadge({ role }) {
  const tone =
    role === "Administrateur"
      ? "admin"
      : role === "Gestionnaire"
        ? "manager"
        : "stock";
  return (
    <span className={`admin-role-badge admin-role-badge--${tone}`}>
      <Shield
        aria-hidden="true"
        weight={role === "Administrateur" ? "fill" : "regular"}
      />
      {role}
    </span>
  );
}

function AdminStatusBadge({ active }) {
  return (
    <span
      className={`admin-status-badge admin-status-badge--${active ? "active" : "inactive"}`}
    >
      {active ? (
        <CheckCircle aria-hidden="true" weight="fill" />
      ) : (
        <Prohibit aria-hidden="true" />
      )}
      {active ? "Actif" : "Inactif"}
    </span>
  );
}

function AdminConfirmDialog({ action, onCancel, onConfirm }) {
  const [isSaving, setIsSaving] = useState(false);
  const [nextRole, setNextRole] = useState(
    action.user.role === "Administrateur" ? "Gestionnaire" : "Administrateur",
  );
  const isRole = action.type === "role";
  const isPassword = action.type === "password";
  const isDeactivate = action.type === "status" && action.user.active;

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSaving) onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSaving, onCancel]);

  const title = isRole
    ? "Confirmer le changement de rôle"
    : isPassword
      ? "Réinitialiser le mot de passe ?"
      : isDeactivate
        ? "Désactiver ce compte ?"
        : "Réactiver ce compte ?";
  const confirmLabel = isRole
    ? "Changer le rôle"
    : isPassword
      ? "Réinitialiser"
      : isDeactivate
        ? "Désactiver"
        : "Réactiver";

  const submit = () => {
    setIsSaving(true);
    window.setTimeout(() => onConfirm(isRole ? nextRole : undefined), 620);
  };

  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isSaving && onCancel()
      }
    >
      <section
        aria-labelledby="admin-confirm-title"
        aria-modal="true"
        className="catalog-modal admin-confirm-modal"
        role="alertdialog"
      >
        <span
          className={`admin-confirm-icon${isDeactivate || isPassword ? " is-sensitive" : ""}`}
        >
          {isPassword ? (
            <Key aria-hidden="true" />
          ) : isRole ? (
            <Shield aria-hidden="true" />
          ) : isDeactivate ? (
            <Prohibit aria-hidden="true" />
          ) : (
            <CheckCircle aria-hidden="true" />
          )}
        </span>
        <div className="admin-confirm-copy">
          <p>
            {action.user.fullName} · {action.user.email}
          </p>
          <h2 id="admin-confirm-title">{title}</h2>
          {isRole ? (
            <>
              <p>
                Ce changement modifie immédiatement les autorisations de
                l’utilisateur.
              </p>
              <label>
                <span>Nouveau rôle</span>
                <select
                  aria-label="Nouveau rôle"
                  onChange={(event) => setNextRole(event.target.value)}
                  value={nextRole}
                >
                  <option>Administrateur</option>
                  <option>Gestionnaire</option>
                  <option>Employé de stock</option>
                </select>
                <CaretDown aria-hidden="true" />
              </label>
            </>
          ) : isPassword ? (
            <p>
              Le mot de passe actuel sera invalidé. L’utilisateur devra utiliser
              les nouvelles informations de connexion transmises par
              l’administrateur.
            </p>
          ) : (
            <p>
              {isDeactivate
                ? "L’utilisateur ne pourra plus se connecter tant que son compte restera inactif."
                : "L’utilisateur retrouvera immédiatement l’accès correspondant à son rôle actuel."}
            </p>
          )}
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
            className={`catalog-primary-button${isDeactivate || isPassword ? " admin-danger-button" : ""}`}
            disabled={isSaving}
            onClick={submit}
            type="button"
          >
            {isSaving ? (
              <>
                <CircleNotch aria-hidden="true" className="spinner" />
                Enregistrement…
              </>
            ) : (
              <>
                {isPassword ? (
                  <Key aria-hidden="true" />
                ) : isRole ? (
                  <Shield aria-hidden="true" />
                ) : isDeactivate ? (
                  <Prohibit aria-hidden="true" />
                ) : (
                  <CheckCircle aria-hidden="true" />
                )}
                {confirmLabel}
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}

function CreateAdminUserDialog({ onCancel, onCreate }) {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    role: "Employé de stock",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSaving) onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSaving, onCancel]);

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.fullName.trim())
      nextErrors.fullName = "Le nom complet est requis.";
    if (!EMAIL_PATTERN.test(values.email.trim()))
      nextErrors.email = "Saisissez une adresse e-mail valide.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setIsSaving(true);
    window.setTimeout(() => onCreate(values), 620);
  };

  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isSaving && onCancel()
      }
    >
      <section
        aria-labelledby="create-user-title"
        aria-modal="true"
        className="catalog-modal admin-create-modal"
        role="dialog"
      >
        <header>
          <div>
            <p>Administration</p>
            <h2 id="create-user-title">Créer un utilisateur</h2>
            <span>Le compte sera actif dès sa création.</span>
          </div>
          <button
            aria-label="Fermer"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <form noValidate onSubmit={submit}>
          <label>
            <span>Nom complet</span>
            <input
              aria-describedby={
                errors.fullName ? "admin-full-name-error" : undefined
              }
              aria-invalid={Boolean(errors.fullName)}
              autoFocus
              onChange={(event) => update("fullName", event.target.value)}
              placeholder="Prénom et nom"
              value={values.fullName}
            />
            {errors.fullName ? (
              <ErrorMessage id="admin-full-name-error">
                {errors.fullName}
              </ErrorMessage>
            ) : null}
          </label>
          <label>
            <span>Adresse e-mail professionnelle</span>
            <input
              aria-describedby={errors.email ? "admin-email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              onChange={(event) => update("email", event.target.value)}
              placeholder="prenom.nom@maarifculture.ma"
              type="email"
              value={values.email}
            />
            {errors.email ? (
              <ErrorMessage id="admin-email-error">{errors.email}</ErrorMessage>
            ) : null}
          </label>
          <label>
            <span>Rôle</span>
            <span className="admin-create-select">
              <select
                aria-label="Rôle du nouvel utilisateur"
                onChange={(event) => update("role", event.target.value)}
                value={values.role}
              >
                <option>Administrateur</option>
                <option>Gestionnaire</option>
                <option>Employé de stock</option>
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <div className="admin-create-notice">
            <Shield aria-hidden="true" />
            <p>
              <strong>Accès accordé selon le rôle choisi.</strong> Les
              autorisations pourront être modifiées ultérieurement.
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
              type="submit"
            >
              {isSaving ? (
                <>
                  <CircleNotch aria-hidden="true" className="spinner" />
                  Création…
                </>
              ) : (
                <>
                  <UserPlus aria-hidden="true" />
                  Créer l’utilisateur
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function UserManagementPage() {
  const [users, setUsers] = useState(ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Tous les rôles");
  const [status, setStatus] = useState("Tous les statuts");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [feedback, setFeedback] = useState("");
  const pageSize = 6;

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.fullName} ${user.email}`
      .toLocaleLowerCase("fr")
      .includes(search.trim().toLocaleLowerCase("fr"));
    const matchesRole = role === "Tous les rôles" || user.role === role;
    const matchesStatus =
      status === "Tous les statuts" ||
      (status === "Actifs" ? user.active : !user.active);
    return matchesSearch && matchesRole && matchesStatus;
  });
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const changeFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setRole("Tous les rôles");
    setStatus("Tous les statuts");
    setPage(1);
  };

  const confirmAction = (nextRole) => {
    const { type, user } = dialog;
    if (type === "role") {
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, role: nextRole } : item,
        ),
      );
      setFeedback(`Rôle de ${user.fullName} modifié : ${nextRole}.`);
    } else if (type === "status") {
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, active: !item.active } : item,
        ),
      );
      setFeedback(
        `Compte de ${user.fullName} ${user.active ? "désactivé" : "réactivé"} avec succès.`,
      );
    } else {
      setFeedback(`Mot de passe de ${user.fullName} réinitialisé avec succès.`);
    }
    setDialog(null);
  };

  const createUser = (values) => {
    const newUser = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      ...values,
      active: true,
      createdAt: "27 août 2026 à 22:45",
    };
    setUsers((current) => [newUser, ...current]);
    setShowCreate(false);
    setPage(1);
    setFeedback(`Utilisateur ${values.fullName} créé avec succès.`);
  };

  return (
    <div className="user-management-page">
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
      <header className="admin-page-heading">
        <div>
          <p>Administration · Accès</p>
          <h2>Gestion des utilisateurs</h2>
          <span>
            Gérez les comptes et les autorisations de Maarif Analytics.
          </span>
        </div>
        <button
          className="catalog-primary-button"
          onClick={() => setShowCreate(true)}
          type="button"
        >
          <UserPlus aria-hidden="true" />
          Créer un utilisateur
        </button>
      </header>

      <section
        aria-label="Filtres des utilisateurs"
        className="admin-user-toolbar"
      >
        <label className="admin-user-search">
          <span>Rechercher</span>
          <span>
            <MagnifyingGlass aria-hidden="true" />
            <input
              aria-label="Rechercher un utilisateur"
              onChange={(event) => changeFilter(setSearch, event.target.value)}
              placeholder="Nom complet ou adresse e-mail"
              type="search"
              value={search}
            />
          </span>
        </label>
        <label className="admin-user-filter">
          <span>Rôle</span>
          <span>
            <select
              aria-label="Filtrer par rôle"
              onChange={(event) => changeFilter(setRole, event.target.value)}
              value={role}
            >
              <option>Tous les rôles</option>
              <option>Administrateur</option>
              <option>Gestionnaire</option>
              <option>Employé de stock</option>
            </select>
            <CaretDown aria-hidden="true" />
          </span>
        </label>
        <label className="admin-user-filter">
          <span>Statut</span>
          <span>
            <select
              aria-label="Filtrer par statut"
              onChange={(event) => changeFilter(setStatus, event.target.value)}
              value={status}
            >
              <option>Tous les statuts</option>
              <option>Actifs</option>
              <option>Inactifs</option>
            </select>
            <CaretDown aria-hidden="true" />
          </span>
        </label>
        <button
          className="catalog-secondary-button admin-user-reset"
          onClick={resetFilters}
          type="button"
        >
          <ArrowClockwise aria-hidden="true" />
          Réinitialiser
        </button>
      </section>

      <section
        aria-labelledby="admin-users-title"
        className="catalog-panel admin-users-panel"
      >
        <div className="catalog-panel-header">
          <div>
            <h2 id="admin-users-title">Utilisateurs</h2>
            <p aria-live="polite">
              {filteredUsers.length} utilisateur
              {filteredUsers.length > 1 ? "s" : ""}
            </p>
          </div>
          <span>Dernière actualisation : 27 août 2026 à 22:45</span>
        </div>
        <div className="catalog-table-scroll admin-users-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Nom complet</th>
                <th scope="col">Adresse e-mail</th>
                <th scope="col">Rôle</th>
                <th scope="col">Statut</th>
                <th scope="col">Créé le</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="admin-user-identity">
                      <span>
                        <User aria-hidden="true" />
                      </span>
                      <div>
                        <strong>{user.fullName}</strong>
                        <small>{user.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    <AdminRoleBadge role={user.role} />
                  </td>
                  <td>
                    <AdminStatusBadge active={user.active} />
                  </td>
                  <td>
                    <time>{user.createdAt}</time>
                  </td>
                  <td>
                    <div className="admin-user-actions">
                      <button
                        aria-label={`Changer le rôle de ${user.fullName}`}
                        onClick={() => setDialog({ type: "role", user })}
                        title="Changer le rôle"
                        type="button"
                      >
                        <Shield aria-hidden="true" />
                      </button>
                      <button
                        aria-label={`${user.active ? "Désactiver" : "Réactiver"} le compte de ${user.fullName}`}
                        className={user.active ? "is-sensitive" : ""}
                        onClick={() => setDialog({ type: "status", user })}
                        title={
                          user.active
                            ? "Désactiver le compte"
                            : "Réactiver le compte"
                        }
                        type="button"
                      >
                        {user.active ? (
                          <Prohibit aria-hidden="true" />
                        ) : (
                          <CheckCircle aria-hidden="true" />
                        )}
                      </button>
                      <button
                        aria-label={`Réinitialiser le mot de passe de ${user.fullName}`}
                        onClick={() => setDialog({ type: "password", user })}
                        title="Réinitialiser le mot de passe"
                        type="button"
                      >
                        <Key aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleUsers.length ? (
            <div className="catalog-empty">
              <Users aria-hidden="true" />
              <h3>Aucun utilisateur trouvé</h3>
              <p>
                Modifiez la recherche ou les filtres pour afficher d’autres
                comptes.
              </p>
            </div>
          ) : null}
        </div>
        <footer className="catalog-pagination">
          <p>
            {filteredUsers.length
              ? `Affichage de ${(page - 1) * pageSize + 1} à ${Math.min(page * pageSize, filteredUsers.length)} sur ${filteredUsers.length}`
              : "Aucun utilisateur à afficher"}
          </p>
          <nav aria-label="Pagination des utilisateurs">
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
        <AdminConfirmDialog
          action={dialog}
          onCancel={() => setDialog(null)}
          onConfirm={confirmAction}
        />
      ) : null}
      {showCreate ? (
        <CreateAdminUserDialog
          onCancel={() => setShowCreate(false)}
          onCreate={createUser}
        />
      ) : null}
    </div>
  );
}

const AUDIT_EVENTS = [
  {
    id: "AUD-2026-014286",
    date: "27 août 2026 à 22:41",
    user: "Nadia El Mansouri",
    action: "Modification",
    entityType: "Paramètre système",
    entity: "Limite d’import",
    summary: "Limite de lignes mise à jour",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014285",
    date: "27 août 2026 à 18:06",
    user: "Salma Berrada",
    action: "Création",
    entityType: "Mouvement de stock",
    entity: "MVT-2026-0384",
    summary: "Correction de stock enregistrée",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014284",
    date: "27 août 2026 à 16:42",
    user: "Youssef Alaoui",
    action: "Modification",
    entityType: "Commande",
    entity: "CMD-2026-1842",
    summary: "Statut de commande mis à jour",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014283",
    date: "27 août 2026 à 15:18",
    user: "Imane Benjelloun",
    action: "Export",
    entityType: "Rapport",
    entity: "Ventes · août 2026",
    summary: "Rapport CSV généré",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014282",
    date: "27 août 2026 à 13:24",
    user: "Nadia El Mansouri",
    action: "Modification",
    entityType: "Utilisateur",
    entity: "USR-008",
    summary: "Rôle du compte modifié",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014281",
    date: "27 août 2026 à 11:05",
    user: "Amine Chraïbi",
    action: "Création",
    entityType: "Mouvement de stock",
    entity: "MVT-2026-0383",
    summary: "Réception fournisseur enregistrée",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014280",
    date: "26 août 2026 à 17:56",
    user: "Youssef Alaoui",
    action: "Modification",
    entityType: "Produit",
    entity: "LIV-000184",
    summary: "Seuil minimum mis à jour",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014279",
    date: "26 août 2026 à 16:20",
    user: "Nadia El Mansouri",
    action: "Connexion",
    entityType: "Session",
    entity: "Administration",
    summary: "Connexion administrateur réussie",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014278",
    date: "26 août 2026 à 14:37",
    user: "Salma Berrada",
    action: "Modification",
    entityType: "Alerte",
    entity: "ALT-2026-0718",
    summary: "Alerte de stock résolue",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014277",
    date: "26 août 2026 à 10:12",
    user: "Imane Benjelloun",
    action: "Import",
    entityType: "Fichier de ventes",
    entity: "ventes_2026-08-26.csv",
    summary: "Import validé et confirmé",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014276",
    date: "25 août 2026 à 18:08",
    user: "Amine Chraïbi",
    action: "Création",
    entityType: "Mouvement de stock",
    entity: "MVT-2026-0379",
    summary: "Produit endommagé enregistré",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014275",
    date: "25 août 2026 à 09:46",
    user: "Nadia El Mansouri",
    action: "Modification",
    entityType: "Paramètre système",
    entity: "Historique prévisionnel",
    summary: "Historique minimum mis à jour",
    result: "Réussi",
  },
];

const DEFAULT_SYSTEM_SETTINGS = {
  timezone: "Africa/Casablanca",
  forecastHistoryWeeks: "12",
  minimumStock: "5",
  safetyStock: "7",
  importMaxSizeMb: "10",
  importMaxRows: "5000",
};

function SystemSettingsSection() {
  const [settings, setSettings] = useState(DEFAULT_SYSTEM_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_SYSTEM_SETTINGS);
  const [saveState, setSaveState] = useState("idle");
  const [errors, setErrors] = useState({});
  const isDirty = Object.keys(settings).some(
    (key) => settings[key] !== savedSettings[key],
  );

  const update = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const save = (event) => {
    event.preventDefault();
    const limits = {
      forecastHistoryWeeks: [
        4,
        104,
        "L’historique doit être compris entre 4 et 104 semaines.",
      ],
      minimumStock: [
        0,
        999,
        "Le stock minimum doit être compris entre 0 et 999.",
      ],
      safetyStock: [
        0,
        999,
        "Le stock de sécurité doit être compris entre 0 et 999.",
      ],
      importMaxSizeMb: [
        1,
        50,
        "La taille maximale doit être comprise entre 1 et 50 Mo.",
      ],
      importMaxRows: [
        100,
        25000,
        "La limite doit être comprise entre 100 et 25 000 lignes.",
      ],
    };
    const nextErrors = Object.fromEntries(
      Object.entries(limits).flatMap(([key, [min, max, message]]) => {
        const value = Number(settings[key]);
        return Number.isFinite(value) && value >= min && value <= max
          ? []
          : [[key, message]];
      }),
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaveState("saving");
    window.setTimeout(() => {
      setSavedSettings(settings);
      setSaveState("success");
    }, 720);
  };

  return (
    <form className="system-settings-form" noValidate onSubmit={save}>
      {saveState === "success" ? (
        <div
          className="product-feedback product-feedback--success"
          role="status"
        >
          <CheckCircle aria-hidden="true" weight="fill" />
          <span>Paramètres système enregistrés avec succès.</span>
          <button
            aria-label="Fermer le message"
            onClick={() => setSaveState("idle")}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <section
        aria-labelledby="timezone-settings-title"
        className="system-setting-card"
      >
        <header>
          <span>
            <GearSix aria-hidden="true" />
          </span>
          <div>
            <h3 id="timezone-settings-title">Fuseau horaire métier</h3>
            <p>
              Utilisé pour les dates affichées et les regroupements quotidiens.
            </p>
          </div>
        </header>
        <label className="system-setting-control">
          <span>Fuseau horaire</span>
          <span className="system-select-wrap">
            <select
              aria-label="Fuseau horaire métier"
              onChange={(event) => update("timezone", event.target.value)}
              value={settings.timezone}
            >
              <option>Africa/Casablanca</option>
            </select>
            <CaretDown aria-hidden="true" />
          </span>
          <small>Les instants restent stockés en UTC.</small>
        </label>
      </section>

      <section
        aria-labelledby="forecast-settings-title"
        className="system-setting-card"
      >
        <header>
          <span>
            <ChartLineUp aria-hidden="true" />
          </span>
          <div>
            <h3 id="forecast-settings-title">Historique des prévisions</h3>
            <p>
              Définit la quantité minimale de données requise avant de générer
              une prévision.
            </p>
          </div>
        </header>
        <label className="system-setting-control">
          <span>Historique hebdomadaire minimum</span>
          <span className="system-number-wrap">
            <input
              aria-describedby={
                errors.forecastHistoryWeeks
                  ? "forecast-history-error"
                  : "forecast-history-help"
              }
              aria-invalid={Boolean(errors.forecastHistoryWeeks)}
              inputMode="numeric"
              min="4"
              onChange={(event) =>
                update("forecastHistoryWeeks", event.target.value)
              }
              type="number"
              value={settings.forecastHistoryWeeks}
            />
            <em>semaines</em>
          </span>
          {errors.forecastHistoryWeeks ? (
            <ErrorMessage id="forecast-history-error">
              {errors.forecastHistoryWeeks}
            </ErrorMessage>
          ) : (
            <small id="forecast-history-help">
              Valeur recommandée : 12 semaines.
            </small>
          )}
        </label>
      </section>

      <section
        aria-labelledby="stock-settings-title"
        className="system-setting-card system-setting-card--wide"
      >
        <header>
          <span>
            <Archive aria-hidden="true" />
          </span>
          <div>
            <h3 id="stock-settings-title">Valeurs par défaut du stock</h3>
            <p>
              Proposées lors de la création d’un produit et modifiables produit
              par produit.
            </p>
          </div>
        </header>
        <div className="system-setting-grid">
          <label className="system-setting-control">
            <span>Seuil de stock minimum</span>
            <span className="system-number-wrap">
              <input
                aria-describedby={
                  errors.minimumStock ? "minimum-stock-error" : undefined
                }
                aria-invalid={Boolean(errors.minimumStock)}
                inputMode="numeric"
                min="0"
                onChange={(event) => update("minimumStock", event.target.value)}
                type="number"
                value={settings.minimumStock}
              />
              <em>unités</em>
            </span>
            {errors.minimumStock ? (
              <ErrorMessage id="minimum-stock-error">
                {errors.minimumStock}
              </ErrorMessage>
            ) : null}
          </label>
          <label className="system-setting-control">
            <span>Stock de sécurité</span>
            <span className="system-number-wrap">
              <input
                aria-describedby={
                  errors.safetyStock ? "safety-stock-error" : undefined
                }
                aria-invalid={Boolean(errors.safetyStock)}
                inputMode="numeric"
                min="0"
                onChange={(event) => update("safetyStock", event.target.value)}
                type="number"
                value={settings.safetyStock}
              />
              <em>unités</em>
            </span>
            {errors.safetyStock ? (
              <ErrorMessage id="safety-stock-error">
                {errors.safetyStock}
              </ErrorMessage>
            ) : null}
          </label>
        </div>
      </section>

      <section
        aria-labelledby="import-settings-title"
        className="system-setting-card system-setting-card--wide"
      >
        <header>
          <span>
            <CloudArrowUp aria-hidden="true" />
          </span>
          <div>
            <h3 id="import-settings-title">Limites des fichiers d’import</h3>
            <p>Appliquées aux fichiers CSV de ventes avant validation.</p>
          </div>
        </header>
        <div className="system-setting-grid">
          <label className="system-setting-control">
            <span>Taille maximale du fichier</span>
            <span className="system-number-wrap">
              <input
                aria-describedby={
                  errors.importMaxSizeMb ? "import-size-error" : undefined
                }
                aria-invalid={Boolean(errors.importMaxSizeMb)}
                inputMode="numeric"
                min="1"
                onChange={(event) =>
                  update("importMaxSizeMb", event.target.value)
                }
                type="number"
                value={settings.importMaxSizeMb}
              />
              <em>Mo</em>
            </span>
            {errors.importMaxSizeMb ? (
              <ErrorMessage id="import-size-error">
                {errors.importMaxSizeMb}
              </ErrorMessage>
            ) : null}
          </label>
          <label className="system-setting-control">
            <span>Nombre maximal de lignes</span>
            <span className="system-number-wrap">
              <input
                aria-describedby={
                  errors.importMaxRows ? "import-rows-error" : undefined
                }
                aria-invalid={Boolean(errors.importMaxRows)}
                inputMode="numeric"
                min="100"
                onChange={(event) =>
                  update("importMaxRows", event.target.value)
                }
                type="number"
                value={settings.importMaxRows}
              />
              <em>lignes</em>
            </span>
            {errors.importMaxRows ? (
              <ErrorMessage id="import-rows-error">
                {errors.importMaxRows}
              </ErrorMessage>
            ) : null}
          </label>
        </div>
      </section>

      <footer className="system-settings-actions">
        <p aria-live="polite">
          {isDirty ? "Modifications non enregistrées" : "Paramètres à jour"}
        </p>
        <button
          className="catalog-primary-button"
          disabled={!isDirty || saveState === "saving"}
          type="submit"
        >
          {saveState === "saving" ? (
            <CircleNotch aria-hidden="true" className="spinner" />
          ) : (
            <FloppyDisk aria-hidden="true" />
          )}
          {saveState === "saving"
            ? "Enregistrement…"
            : "Enregistrer les paramètres"}
        </button>
      </footer>
    </form>
  );
}

function AuditLogSection() {
  const [user, setUser] = useState("Tous les utilisateurs");
  const [action, setAction] = useState("Toutes les actions");
  const [entityType, setEntityType] = useState("Tous les types");
  const [date, setDate] = useState("7 derniers jours");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const filteredEvents = AUDIT_EVENTS.filter(
    (event) =>
      (user === "Tous les utilisateurs" || event.user === user) &&
      (action === "Toutes les actions" || event.action === action) &&
      (entityType === "Tous les types" || event.entityType === entityType),
  );
  const pageCount = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const visibleEvents = filteredEvents.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const changeFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const reset = () => {
    setUser("Tous les utilisateurs");
    setAction("Toutes les actions");
    setEntityType("Tous les types");
    setDate("7 derniers jours");
    setPage(1);
  };

  return (
    <div className="audit-log-section">
      <section
        aria-label="Filtres du journal d’audit"
        className="audit-filter-panel"
      >
        <div className="audit-filter-grid">
          <label>
            <span>Utilisateur</span>
            <span>
              <select
                aria-label="Filtrer par utilisateur"
                onChange={(event) => changeFilter(setUser, event.target.value)}
                value={user}
              >
                <option>Tous les utilisateurs</option>
                {[...new Set(AUDIT_EVENTS.map((event) => event.user))].map(
                  (name) => (
                    <option key={name}>{name}</option>
                  ),
                )}
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <label>
            <span>Action</span>
            <span>
              <select
                aria-label="Filtrer par action"
                onChange={(event) =>
                  changeFilter(setAction, event.target.value)
                }
                value={action}
              >
                <option>Toutes les actions</option>
                {[...new Set(AUDIT_EVENTS.map((event) => event.action))].map(
                  (name) => (
                    <option key={name}>{name}</option>
                  ),
                )}
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <label>
            <span>Type d’entité</span>
            <span>
              <select
                aria-label="Filtrer par type d’entité"
                onChange={(event) =>
                  changeFilter(setEntityType, event.target.value)
                }
                value={entityType}
              >
                <option>Tous les types</option>
                {[
                  ...new Set(AUDIT_EVENTS.map((event) => event.entityType)),
                ].map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <label>
            <span>Date</span>
            <span>
              <CalendarBlank aria-hidden="true" className="is-leading" />
              <select
                aria-label="Filtrer par date"
                onChange={(event) => changeFilter(setDate, event.target.value)}
                value={date}
              >
                <option>24 dernières heures</option>
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <button
            className="catalog-secondary-button audit-reset"
            onClick={reset}
            type="button"
          >
            <ArrowClockwise aria-hidden="true" />
            Réinitialiser
          </button>
        </div>
      </section>

      <section
        aria-labelledby="audit-table-title"
        className="catalog-panel audit-log-panel"
      >
        <div className="catalog-panel-header">
          <div>
            <h2 id="audit-table-title">Activité récente</h2>
            <p aria-live="polite">
              {filteredEvents.length} événement
              {filteredEvents.length > 1 ? "s" : ""}
            </p>
          </div>
          <span>Données non sensibles · Africa/Casablanca</span>
        </div>
        <div className="catalog-table-scroll audit-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Utilisateur</th>
                <th scope="col">Action</th>
                <th scope="col">Type d’entité</th>
                <th scope="col">Entité</th>
                <th scope="col">Activité</th>
                <th scope="col">Résultat</th>
              </tr>
            </thead>
            <tbody>
              {visibleEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <time>{event.date}</time>
                    <small>{event.id}</small>
                  </td>
                  <td>
                    <strong>{event.user}</strong>
                  </td>
                  <td>
                    <span className="audit-action-badge">{event.action}</span>
                  </td>
                  <td>{event.entityType}</td>
                  <td>
                    <strong>{event.entity}</strong>
                  </td>
                  <td>{event.summary}</td>
                  <td>
                    <span className="audit-result">
                      <CheckCircle aria-hidden="true" weight="fill" />
                      {event.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleEvents.length ? (
            <div className="catalog-empty">
              <FileText aria-hidden="true" />
              <h3>Aucune activité trouvée</h3>
              <p>Modifiez les filtres pour élargir la recherche.</p>
            </div>
          ) : null}
        </div>
        <footer className="catalog-pagination">
          <p>
            {filteredEvents.length
              ? `Affichage de ${(page - 1) * pageSize + 1} à ${Math.min(page * pageSize, filteredEvents.length)} sur ${filteredEvents.length}`
              : "Aucun événement à afficher"}
          </p>
          <nav aria-label="Pagination du journal d’audit">
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
    </div>
  );
}

function AdministrationPage() {
  const [section, setSection] = useState("settings");
  return (
    <div className="administration-page">
      <header className="admin-page-heading">
        <div>
          <p>Administration · Système</p>
          <h2>Configuration et traçabilité</h2>
          <span>
            Gérez les règles communes et consultez l’activité administrative.
          </span>
        </div>
      </header>
      <nav
        aria-label="Sections de l’administration"
        className="administration-tabs"
        role="tablist"
      >
        <button
          aria-controls="administration-settings-panel"
          aria-selected={section === "settings"}
          className={section === "settings" ? "is-active" : ""}
          id="administration-settings-tab"
          onClick={() => setSection("settings")}
          role="tab"
          type="button"
        >
          <GearSix aria-hidden="true" />
          <span>
            <strong>Paramètres système</strong>
            <small>Prévisions, stock et imports</small>
          </span>
        </button>
        <button
          aria-controls="administration-audit-panel"
          aria-selected={section === "audit"}
          className={section === "audit" ? "is-active" : ""}
          id="administration-audit-tab"
          onClick={() => setSection("audit")}
          role="tab"
          type="button"
        >
          <FileText aria-hidden="true" />
          <span>
            <strong>Journal d’audit</strong>
            <small>Activité administrative non sensible</small>
          </span>
        </button>
      </nav>
      <section
        aria-labelledby={`administration-${section}-tab`}
        id={`administration-${section}-panel`}
        role="tabpanel"
      >
        {section === "settings" ? (
          <SystemSettingsSection />
        ) : (
          <AuditLogSection />
        )}
      </section>
    </div>
  );
}

const RECENT_SALES = [
  ["25–27 août 2026", "38", "2 964,00 MAD"],
  ["18–24 août 2026", "74", "5 772,00 MAD"],
  ["11–17 août 2026", "81", "6 318,00 MAD"],
  ["04–10 août 2026", "69", "5 382,00 MAD"],
  ["01–03 août 2026", "50", "3 900,00 MAD"],
];

const INVENTORY_MOVEMENTS = [
  {
    date: "27 août 2026 à 16:42",
    label: "Vente — CMD-2026-1842",
    quantity: "−2",
    balance: "42",
    tone: "out",
  },
  {
    date: "27 août 2026 à 11:08",
    label: "Vente — CMD-2026-1834",
    quantity: "−1",
    balance: "44",
    tone: "out",
  },
  {
    date: "26 août 2026 à 15:20",
    label: "Réception fournisseur — REC-2026-0318",
    quantity: "+24",
    balance: "45",
    tone: "in",
  },
  {
    date: "26 août 2026 à 09:14",
    label: "Vente — CMD-2026-1807",
    quantity: "−3",
    balance: "21",
    tone: "out",
  },
  {
    date: "25 août 2026 à 18:06",
    label: "Ajustement après inventaire",
    quantity: "+1",
    balance: "24",
    tone: "in",
  },
];

function ProductDetails({
  onBack,
  onDisable,
  onEdit,
  product,
  role = "Gestionnaire",
}) {
  const permissions = CATALOG_PERMISSIONS[role];
  const [active, setActive] = useState(product.active);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const disableProduct = () => {
    setActive(false);
    setShowDisableDialog(false);
    setFeedback("Produit désactivé avec succès.");
    onDisable?.(product.sku);
  };

  return (
    <div className="product-details">
      <header className="product-detail-heading">
        <div>
          <button className="product-back-link" onClick={onBack} type="button">
            <ArrowLeft aria-hidden="true" />
            Retour au catalogue
          </button>
          <div className="product-detail-title-row">
            <div>
              <p>{product.sku} · ISBN 978-9920-35-184-6</p>
              <h2>{product.title}</h2>
              <span>Ahmed Sefrioui · Librairie des Écoles</span>
            </div>
            <ProductStatus
              active={active}
              stock={product.stock}
              threshold={product.threshold}
            />
          </div>
        </div>
        <div className="product-detail-actions">
          {permissions.edit && active ? (
            <button
              className="catalog-secondary-button"
              onClick={() => onEdit(product)}
              type="button"
            >
              <PencilSimple aria-hidden="true" />
              Modifier
            </button>
          ) : null}
          {permissions.disable && active ? (
            <button
              className="product-disable-button"
              onClick={() => setShowDisableDialog(true)}
              type="button"
            >
              <Prohibit aria-hidden="true" />
              Désactiver
            </button>
          ) : null}
        </div>
      </header>

      {feedback ? (
        <div
          className="product-feedback product-feedback--success"
          role="status"
        >
          <CheckCircle aria-hidden="true" weight="fill" />
          <span>{feedback}</span>
        </div>
      ) : null}

      <section
        aria-label="Indicateurs du produit"
        className="product-detail-kpis"
      >
        <article>
          <CurrencyDollar aria-hidden="true" />
          <span>Prix de vente</span>
          <strong>78,00 MAD</strong>
          <small>Marge brute : 28,50 MAD</small>
        </article>
        <article>
          <ShoppingCart aria-hidden="true" />
          <span>Coût d’achat</span>
          <strong>49,50 MAD</strong>
          <small>Marge : 36,5 %</small>
        </article>
        <article
          className={product.stock <= product.threshold ? "is-alert" : ""}
        >
          <Archive aria-hidden="true" />
          <span>Stock actuel</span>
          <strong>{product.stock} exemplaires</strong>
          <small>Mis à jour le 27 août 2026 à 16:42</small>
        </article>
        <article>
          <Warning aria-hidden="true" />
          <span>Seuil minimum</span>
          <strong>{product.threshold} exemplaires</strong>
          <small>{product.stock - product.threshold} au-dessus du seuil</small>
        </article>
      </section>

      <section className="product-detail-info-grid">
        <article className="product-detail-panel bibliographic-panel">
          <header>
            <BookOpen aria-hidden="true" />
            <div>
              <h3>Informations bibliographiques</h3>
              <p>Données de référence du catalogue</p>
            </div>
          </header>
          <dl>
            <div>
              <dt>Titre</dt>
              <dd>{product.title}</dd>
            </div>
            <div>
              <dt>Auteur</dt>
              <dd>Ahmed Sefrioui</dd>
            </div>
            <div>
              <dt>ISBN</dt>
              <dd>978-9920-35-184-6</dd>
            </div>
            <div>
              <dt>Éditeur</dt>
              <dd>Librairie des Écoles</dd>
            </div>
            <div>
              <dt>Catégorie</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>Langue</dt>
              <dd>{product.language}</dd>
            </div>
            <div className="detail-description">
              <dt>Description</dt>
              <dd>
                Roman marocain emblématique consacré à l’enfance, à la famille
                et à la vie quotidienne dans la médina de Fès.
              </dd>
            </div>
          </dl>
        </article>

        <article className="product-detail-panel supplier-panel">
          <header>
            <Truck aria-hidden="true" />
            <div>
              <h3>Fournisseur</h3>
              <p>Approvisionnement principal</p>
            </div>
          </header>
          <dl>
            <div>
              <dt>Fournisseur</dt>
              <dd>Sodis Maroc</dd>
            </div>
            <div>
              <dt>Délai habituel</dt>
              <dd>8 jours calendaires</dd>
            </div>
            <div>
              <dt>Dernière réception</dt>
              <dd>26 août 2026 à 15:20</dd>
            </div>
            <div>
              <dt>Quantité reçue</dt>
              <dd>24 exemplaires</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="product-detail-operations-grid">
        <article className="product-detail-panel recent-sales-panel">
          <header>
            <ChartLineUp aria-hidden="true" />
            <div>
              <h3>Ventes récentes</h3>
              <p>312 exemplaires sur les 30 derniers jours</p>
            </div>
          </header>
          <div className="product-detail-table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Période</th>
                  <th scope="col">Exemplaires</th>
                  <th scope="col">Chiffre d’affaires</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SALES.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="product-detail-panel inventory-timeline-panel">
          <header>
            <Archive aria-hidden="true" />
            <div>
              <h3>Mouvements de stock</h3>
              <p>Derniers mouvements enregistrés</p>
            </div>
          </header>
          <ol>
            {INVENTORY_MOVEMENTS.map((movement) => {
              const Icon = movement.tone === "in" ? ArrowDown : ArrowUp;
              return (
                <li key={movement.date}>
                  <span
                    className={`movement-icon movement-icon--${movement.tone}`}
                  >
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <strong>{movement.label}</strong>
                    <time>{movement.date}</time>
                  </div>
                  <span
                    className={`movement-quantity movement-quantity--${movement.tone}`}
                  >
                    {movement.quantity}
                  </span>
                  <small>Solde {movement.balance}</small>
                </li>
              );
            })}
          </ol>
        </article>
      </section>

      <section className="product-detail-forecast-grid">
        <article className="product-detail-panel forecast-panel">
          <header>
            <TrendUp aria-hidden="true" />
            <div>
              <h3>Prévision actuelle</h3>
              <p>Calculée le 27 août 2026 à 18:00</p>
            </div>
          </header>
          <div className="forecast-values">
            <div>
              <span>Demande prévue</span>
              <strong>96</strong>
              <small>exemplaires · 4 semaines</small>
            </div>
            <div>
              <span>Couverture actuelle</span>
              <strong>13</strong>
              <small>jours de stock</small>
            </div>
            <div>
              <span>Risque de rupture</span>
              <strong className="forecast-risk">Élevé</strong>
              <small>dans 14 jours</small>
            </div>
          </div>
        </article>

        <article className="product-detail-panel reorder-panel">
          <header>
            <Cube aria-hidden="true" />
            <div>
              <h3>Recommandation de réapprovisionnement</h3>
              <p>Basée sur la prévision et le délai fournisseur</p>
            </div>
          </header>
          <div className="reorder-recommendation">
            <strong>Commander 90 exemplaires</strong>
            <p>
              Passer la commande avant le <b>31 août 2026</b> pour maintenir 21
              jours de couverture après réception.
            </p>
            <dl>
              <div>
                <dt>Arrivée estimée</dt>
                <dd>08 septembre 2026</dd>
              </div>
              <div>
                <dt>Coût estimé</dt>
                <dd>4 455,00 MAD</dd>
              </div>
            </dl>
          </div>
        </article>
      </section>

      {showDisableDialog ? (
        <DisableProductDialog
          onCancel={() => setShowDisableDialog(false)}
          onConfirm={disableProduct}
          product={product}
        />
      ) : null}
    </div>
  );
}

const PRODUCT_FORM_DEFAULTS = {
  sku: "",
  isbn: "",
  title: "",
  description: "",
  authors: "",
  publisher: "Gallimard",
  category: "Roman",
  language: "Français",
  sellingPrice: "",
  purchaseCost: "",
  minimumStock: "5",
  supplier: "Sodis Maroc",
  supplierLeadTime: "7",
  active: true,
};

function productFormValues(product) {
  if (!product) return PRODUCT_FORM_DEFAULTS;
  return {
    sku: product.sku,
    isbn: "978-9920-35-184-6",
    title: product.title,
    description:
      "Roman marocain emblématique consacré à l’enfance, à la famille et à la vie quotidienne dans la médina de Fès.",
    authors: product.author,
    publisher: "Librairie des Écoles",
    category: product.category,
    language: product.language,
    sellingPrice: product.price.toFixed(2).replace(".", ","),
    purchaseCost: "49,50",
    minimumStock: String(product.threshold),
    supplier: "Sodis Maroc",
    supplierLeadTime: "8",
    active: product.active,
  };
}

function ProductFormField({
  children,
  error,
  help,
  id,
  label,
  required = false,
}) {
  return (
    <label className="product-form-field" htmlFor={id}>
      <span>
        {label}
        {required ? <strong aria-hidden="true"> *</strong> : null}
      </span>
      {children}
      {help && !error ? <small>{help}</small> : null}
      {error ? (
        <span className="product-form-error" id={`${id}-error`} role="alert">
          <WarningCircle aria-hidden="true" weight="fill" />
          {error}
        </span>
      ) : null}
    </label>
  );
}

function UnsavedChangesDialog({ onDiscard, onKeepEditing }) {
  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onKeepEditing()
      }
    >
      <section
        aria-labelledby="unsaved-title"
        aria-modal="true"
        className="catalog-modal catalog-confirm-modal unsaved-confirm-modal"
        role="alertdialog"
      >
        <span className="catalog-confirm-icon catalog-confirm-icon--warning">
          <Warning aria-hidden="true" />
        </span>
        <div>
          <h2 id="unsaved-title">Modifications non enregistrées</h2>
          <p>
            Si vous quittez cette page maintenant, les informations saisies
            seront perdues.
          </p>
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            onClick={onKeepEditing}
            type="button"
          >
            Continuer la modification
          </button>
          <button
            className="catalog-danger-button"
            onClick={onDiscard}
            type="button"
          >
            Quitter sans enregistrer
          </button>
        </footer>
      </section>
    </div>
  );
}

function ProductEditor({ mode, onCancel, product }) {
  const [values, setValues] = useState(() => productFormValues(product));
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const isEdit = mode === "edit";

  useEffect(() => {
    const warnBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  const updateValue = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setFeedback(null);
    setIsDirty(true);
  };

  const validate = () => {
    const nextErrors = {};
    const sellingPrice = Number(values.sellingPrice.replace(",", "."));
    const purchaseCost = Number(values.purchaseCost.replace(",", "."));
    if (!values.sku.trim()) nextErrors.sku = "Le SKU est requis.";
    else if (!/^[A-Z]{3}-\d{6}$/.test(values.sku.trim()))
      nextErrors.sku = "Utilisez le format LIV-000000.";
    if (
      values.isbn &&
      !/^(?:\d[ -]?){9}[\dXx]$|^(?:\d[ -]?){13}$/.test(values.isbn.trim())
    )
      nextErrors.isbn = "Saisissez un ISBN-10 ou ISBN-13 valide.";
    if (!values.title.trim()) nextErrors.title = "Le titre est requis.";
    if (!values.authors.trim())
      nextErrors.authors = "Ajoutez au moins un auteur.";
    if (!Number.isFinite(sellingPrice) || sellingPrice <= 0)
      nextErrors.sellingPrice = "Saisissez un prix de vente supérieur à 0 MAD.";
    if (
      !values.purchaseCost.trim() ||
      !Number.isFinite(purchaseCost) ||
      purchaseCost < 0
    )
      nextErrors.purchaseCost = "Saisissez un coût d’achat valide.";
    else if (Number.isFinite(sellingPrice) && purchaseCost > sellingPrice)
      nextErrors.purchaseCost =
        "Le coût d’achat ne peut pas dépasser le prix de vente.";
    if (!/^\d+$/.test(values.minimumStock) || Number(values.minimumStock) < 0)
      nextErrors.minimumStock = "Saisissez un stock minimum positif ou nul.";
    if (
      !/^\d+$/.test(values.supplierLeadTime) ||
      Number(values.supplierLeadTime) < 1
    )
      nextErrors.supplierLeadTime = "Le délai doit être d’au moins un jour.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveProduct = (event) => {
    event.preventDefault();
    setFeedback(null);
    if (!validate()) {
      setFeedback({
        tone: "error",
        message: "Corrigez les champs signalés avant d’enregistrer.",
      });
      return;
    }
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      if (
        !isEdit &&
        CATALOG_PRODUCTS.some((item) => item.sku === values.sku.trim())
      ) {
        setErrors((current) => ({
          ...current,
          sku: "Ce SKU est déjà utilisé par un autre produit.",
        }));
        setFeedback({
          tone: "error",
          message:
            "Impossible de créer le produit. Vérifiez le SKU puis réessayez.",
        });
        return;
      }
      setIsDirty(false);
      setFeedback({
        tone: "success",
        message: isEdit
          ? "Produit mis à jour avec succès."
          : "Produit créé avec succès.",
      });
    }, 850);
  };

  const requestCancel = () =>
    isDirty ? setShowUnsavedWarning(true) : onCancel();
  const fieldProps = (key) => ({
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
    "aria-invalid": Boolean(errors[key]),
    id: key,
    onChange: (event) =>
      updateValue(
        key,
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
      ),
    value: values[key],
  });

  return (
    <div className="product-editor">
      <header className="product-editor-heading">
        <div>
          <button
            className="product-back-link"
            onClick={requestCancel}
            type="button"
          >
            <ArrowLeft aria-hidden="true" />
            Retour au catalogue
          </button>
          <h2>{isEdit ? "Modifier le produit" : "Créer un produit"}</h2>
          <p>
            {isEdit
              ? `Mettez à jour les informations de ${product.title}.`
              : "Ajoutez une nouvelle référence au catalogue Maarif Culture."}
          </p>
        </div>
        <span className="product-required-note">
          <strong>*</strong> Champs obligatoires
        </span>
      </header>

      {feedback ? (
        <div
          aria-live="polite"
          className={`product-feedback product-feedback--${feedback.tone}`}
          role={feedback.tone === "error" ? "alert" : "status"}
        >
          {feedback.tone === "success" ? (
            <CheckCircle aria-hidden="true" weight="fill" />
          ) : (
            <WarningCircle aria-hidden="true" weight="fill" />
          )}
          <span>{feedback.message}</span>
        </div>
      ) : null}

      <form className="product-editor-form" noValidate onSubmit={saveProduct}>
        <section className="product-form-section">
          <header>
            <h3>Informations générales</h3>
            <p>Identifiants et contenu bibliographique du produit.</p>
          </header>
          <div className="product-form-grid">
            <ProductFormField error={errors.sku} id="sku" label="SKU" required>
              <input {...fieldProps("sku")} placeholder="LIV-000000" />
            </ProductFormField>
            <ProductFormField
              error={errors.isbn}
              help="ISBN-10 ou ISBN-13, tirets acceptés."
              id="isbn"
              label="ISBN"
            >
              <input
                {...fieldProps("isbn")}
                inputMode="numeric"
                placeholder="978-9920-00-000-0"
              />
            </ProductFormField>
            <ProductFormField
              error={errors.title}
              id="title"
              label="Titre"
              required
            >
              <input {...fieldProps("title")} placeholder="Titre du livre" />
            </ProductFormField>
            <ProductFormField
              error={errors.authors}
              help="Séparez plusieurs auteurs par une virgule."
              id="authors"
              label="Auteurs"
              required
            >
              <input {...fieldProps("authors")} placeholder="Prénom Nom" />
            </ProductFormField>
            <ProductFormField id="description" label="Description">
              <textarea
                {...fieldProps("description")}
                placeholder="Résumé ou description commerciale du livre"
                rows="4"
              />
            </ProductFormField>
          </div>
        </section>

        <section className="product-form-section">
          <header>
            <h3>Classification</h3>
            <p>Référentiels utilisés pour la recherche et les rapports.</p>
          </header>
          <div className="product-form-grid product-form-grid--three">
            <ProductFormField id="publisher" label="Éditeur" required>
              <select {...fieldProps("publisher")}>
                <option>Gallimard</option>
                <option>Librairie des Écoles</option>
                <option>Le Seuil</option>
                <option>La Croisée des chemins</option>
              </select>
            </ProductFormField>
            <ProductFormField id="category" label="Catégorie" required>
              <select {...fieldProps("category")}>
                <option>Roman</option>
                <option>Jeunesse</option>
                <option>Scolaire</option>
                <option>Essai</option>
                <option>Référence</option>
              </select>
            </ProductFormField>
            <ProductFormField id="language" label="Langue" required>
              <select {...fieldProps("language")}>
                <option>Français</option>
                <option>Arabe</option>
                <option>Anglais</option>
              </select>
            </ProductFormField>
            <label className="product-active-field" htmlFor="active">
              <input
                checked={values.active}
                id="active"
                onChange={(event) =>
                  updateValue("active", event.target.checked)
                }
                type="checkbox"
              />
              <span>
                <strong>Produit actif</strong>
                <small>Disponible pour les nouvelles commandes.</small>
              </span>
            </label>
          </div>
        </section>

        <section className="product-form-section">
          <header>
            <h3>Tarification et stock</h3>
            <p>Montants en dirhams marocains et seuil d’alerte.</p>
          </header>
          <div className="product-form-grid product-form-grid--three">
            <ProductFormField
              error={errors.sellingPrice}
              id="sellingPrice"
              label="Prix de vente (MAD)"
              required
            >
              <input
                {...fieldProps("sellingPrice")}
                inputMode="decimal"
                placeholder="0,00"
              />
            </ProductFormField>
            <ProductFormField
              error={errors.purchaseCost}
              id="purchaseCost"
              label="Coût d’achat (MAD)"
              required
            >
              <input
                {...fieldProps("purchaseCost")}
                inputMode="decimal"
                placeholder="0,00"
              />
            </ProductFormField>
            <ProductFormField
              error={errors.minimumStock}
              help="Déclenche une alerte lorsque le stock atteint ce niveau."
              id="minimumStock"
              label="Stock minimum"
              required
            >
              <input {...fieldProps("minimumStock")} inputMode="numeric" />
            </ProductFormField>
          </div>
        </section>

        <section className="product-form-section">
          <header>
            <h3>Approvisionnement</h3>
            <p>Fournisseur principal et délai habituel.</p>
          </header>
          <div className="product-form-grid">
            <ProductFormField id="supplier" label="Fournisseur" required>
              <select {...fieldProps("supplier")}>
                <option>Sodis Maroc</option>
                <option>Distribution Livre Maroc</option>
                <option>Al Madariss Distribution</option>
              </select>
            </ProductFormField>
            <ProductFormField
              error={errors.supplierLeadTime}
              help="Nombre de jours calendaires."
              id="supplierLeadTime"
              label="Délai fournisseur (jours)"
              required
            >
              <input {...fieldProps("supplierLeadTime")} inputMode="numeric" />
            </ProductFormField>
          </div>
        </section>

        <footer className="product-editor-actions">
          <button
            className="catalog-secondary-button"
            onClick={requestCancel}
            type="button"
          >
            Annuler
          </button>
          <button
            className="catalog-primary-button"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? (
              <CircleNotch aria-hidden="true" className="spinner" />
            ) : (
              <FloppyDisk aria-hidden="true" />
            )}
            {isSaving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </footer>
      </form>

      {showUnsavedWarning ? (
        <UnsavedChangesDialog
          onDiscard={onCancel}
          onKeepEditing={() => setShowUnsavedWarning(false)}
        />
      ) : null}
    </div>
  );
}

function SystemStatePage({ onNavigate, type }) {
  const unauthorized = type === "unauthorized";
  const Icon = unauthorized ? Prohibit : MagnifyingGlass;

  return (
    <section
      aria-labelledby={`${type}-title`}
      className={`system-state-page system-state-page--${type}`}
    >
      <div aria-hidden="true" className="system-state-icon">
        <Icon weight="regular" />
      </div>
      <p className="system-state-code">Erreur {unauthorized ? "403" : "404"}</p>
      <h2 id={`${type}-title`}>
        {unauthorized ? "Accès non autorisé" : "Page introuvable"}
      </h2>
      <p className="system-state-description">
        {unauthorized
          ? "Votre compte ne dispose pas des autorisations nécessaires pour consulter cette page."
          : "La page demandée n’existe pas ou son adresse a peut-être changé."}
      </p>
      <button
        className="catalog-primary-button system-state-action"
        onClick={onNavigate}
        type="button"
      >
        <ArrowLeft aria-hidden="true" />
        {unauthorized
          ? "Retourner au catalogue"
          : "Retourner au tableau de bord"}
      </button>
    </section>
  );
}

const KNOWN_APP_ROUTES = [
  /^\/app\/?$/,
  /^\/app\/(dashboard|inventory|alerts|forecasting|reports|administration)\/?$/,
  /^\/app\/products(?:\/new|\/[^/]+(?:\/edit)?)?\/?$/,
  /^\/app\/orders(?:\/[^/]+)?\/?$/,
  /^\/app\/imports(?:\/history)?\/?$/,
];

function resolveAuthenticatedPage(pathname) {
  if (pathname === "/app/unauthorized") return "Accès non autorisé";
  if (
    pathname === "/app/not-found" ||
    !KNOWN_APP_ROUTES.some((pattern) => pattern.test(pathname))
  )
    return "Page introuvable";
  if (pathname.startsWith("/app/products")) return "Produits";
  if (pathname.startsWith("/app/orders")) return "Commandes";
  if (pathname.startsWith("/app/imports")) return "Imports";
  return (
    NAV_ITEMS.find((item) => pathname.endsWith(`/${item.id}`))?.label ??
    "Tableau de bord"
  );
}

function AuthenticatedLayout({ onLogout }) {
  const pageFromPath = () => resolveAuthenticatedPage(window.location.pathname);
  const [activePage, setActivePage] = useState(pageFromPath);
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    document.title = `${activePage} — Maarif Analytics`;
  }, [activePage]);

  useEffect(() => {
    const syncPageWithHistory = () => {
      setActivePage(pageFromPath());
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener("popstate", syncPageWithHistory);
    return () => window.removeEventListener("popstate", syncPageWithHistory);
  }, []);

  const selectPage = (label) => {
    setActivePage(label);
    setSidebarExpanded(false);
    const item = NAV_ITEMS.find((candidate) => candidate.label === label);
    const nextRoute =
      item?.id === "dashboard" ? "/app" : `/app/${item?.id ?? ""}`;
    window.history.pushState({}, "", nextRoute);
    setCurrentRoute(nextRoute);
  };

  const navigateWithinProducts = (route) => {
    window.history.pushState({}, "", route);
    setCurrentRoute(route);
    setActivePage("Produits");
  };

  const navigateWithinOrders = (route) => {
    window.history.pushState({}, "", route);
    setCurrentRoute(route);
    setActivePage("Commandes");
  };

  const navigateWithinImports = (route) => {
    window.history.pushState({}, "", route);
    setCurrentRoute(route);
    setActivePage("Imports");
  };

  const isCreateProduct = currentRoute === "/app/products/new";
  const editSku = currentRoute.match(/^\/app\/products\/([^/]+)\/edit$/)?.[1];
  const detailSku = !isCreateProduct
    ? currentRoute.match(/^\/app\/products\/([^/]+)$/)?.[1]
    : null;
  const editedProduct =
    CATALOG_PRODUCTS.find((item) => item.sku === editSku) ??
    CATALOG_PRODUCTS[0];
  const detailedProduct =
    CATALOG_PRODUCTS.find((item) => item.sku === detailSku) ??
    CATALOG_PRODUCTS[0];
  const detailOrderReference = currentRoute.match(
    /^\/app\/orders\/([^/]+)$/,
  )?.[1];
  const detailedOrder =
    ORDERS.find((item) => item.reference === detailOrderReference) ?? ORDERS[1];
  const isImportHistory = currentRoute === "/app/imports/history";
  const isUnauthorized = currentRoute === "/app/unauthorized";
  const isNotFound = activePage === "Page introuvable";
  const topTitle = isUnauthorized
    ? "Accès non autorisé"
    : isNotFound
      ? "Page introuvable"
      : isCreateProduct
        ? "Créer un produit"
        : editSku
          ? "Modifier un produit"
          : detailSku
            ? "Détails du produit"
            : detailOrderReference
              ? "Détails de la commande"
              : isImportHistory
                ? "Historique des imports"
                : activePage === "Alertes"
                  ? "Alertes de stock"
                  : activePage;

  return (
    <main
      className={`authenticated-shell${sidebarExpanded ? " is-sidebar-expanded" : ""}`}
    >
      <aside aria-label="Navigation principale" className="app-sidebar">
        <div className="app-sidebar-header">
          <button
            aria-expanded={sidebarExpanded}
            aria-label={
              sidebarExpanded
                ? "Réduire la navigation"
                : "Développer la navigation"
            }
            className="sidebar-toggle"
            onClick={() => setSidebarExpanded((current) => !current)}
            type="button"
          >
            <List aria-hidden="true" />
          </button>
          <a
            aria-label="Maarif Analytics — Tableau de bord"
            className="app-brand"
            href="#dashboard"
            onClick={(event) => {
              event.preventDefault();
              selectPage("Tableau de bord");
            }}
          >
            <BookOpen
              aria-hidden="true"
              className="app-brand-icon"
              weight="fill"
            />
            <span className="app-brand-name">
              <strong>Maarif</strong> Analytics
            </span>
          </a>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.label;
            return (
              <a
                aria-current={active ? "page" : undefined}
                className={`sidebar-link${active ? " is-active" : ""}`}
                href={`#${item.id}`}
                key={item.id}
                onClick={(event) => {
                  event.preventDefault();
                  selectPage(item.label);
                }}
                title={item.label}
              >
                <Icon aria-hidden="true" weight={active ? "fill" : "regular"} />
                <span className="sidebar-link-label">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <div className="app-workspace">
        <header className="top-navigation">
          <h1>{topTitle}</h1>
          <div className="top-navigation-actions">
            <button
              aria-label="3 alertes — Ouvrir les alertes"
              className="alert-indicator"
              onClick={() => selectPage("Alertes")}
              type="button"
            >
              <Bell aria-hidden="true" />
              <span aria-hidden="true" className="alert-count">
                3
              </span>
            </button>

            <div aria-label="Utilisateur actuel" className="current-user">
              <span className="current-user-name">Nadia El Mansouri</span>
              <span className="current-user-role">
                {activePage === "Administration"
                  ? "Administratrice"
                  : "Gestionnaire"}
              </span>
            </div>

            <button className="logout-action" onClick={onLogout} type="button">
              <SignOut aria-hidden="true" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </header>

        <div
          className={`app-content${activePage === "Tableau de bord" ? " app-content--dashboard" : ""}${activePage === "Produits" || activePage === "Inventaire" || activePage === "Commandes" || activePage === "Imports" || activePage === "Alertes" || activePage === "Prévisions" || activePage === "Rapports" || activePage === "Administration" ? " app-content--catalog" : ""}${isUnauthorized || isNotFound ? " app-content--system-state" : ""}`}
        >
          {isUnauthorized ? (
            <SystemStatePage
              onNavigate={() => selectPage("Produits")}
              type="unauthorized"
            />
          ) : isNotFound ? (
            <SystemStatePage
              onNavigate={() => selectPage("Tableau de bord")}
              type="not-found"
            />
          ) : activePage === "Tableau de bord" ? (
            <DashboardContent
              onNavigateProducts={() => selectPage("Produits")}
            />
          ) : activePage === "Produits" && (isCreateProduct || editSku) ? (
            <ProductEditor
              mode={isCreateProduct ? "create" : "edit"}
              onCancel={() => navigateWithinProducts("/app/products")}
              product={isCreateProduct ? null : editedProduct}
            />
          ) : activePage === "Produits" && detailSku ? (
            <ProductDetails
              onBack={() => navigateWithinProducts("/app/products")}
              onEdit={(product) =>
                navigateWithinProducts(`/app/products/${product.sku}/edit`)
              }
              product={detailedProduct}
            />
          ) : activePage === "Produits" ? (
            <ProductCatalog
              onCreate={() => navigateWithinProducts("/app/products/new")}
              onEdit={(product) =>
                navigateWithinProducts(`/app/products/${product.sku}/edit`)
              }
              onView={(product) =>
                navigateWithinProducts(`/app/products/${product.sku}`)
              }
            />
          ) : activePage === "Inventaire" ? (
            <InventoryManagement />
          ) : activePage === "Commandes" && detailOrderReference ? (
            <OrderDetailsPage
              onBack={() => navigateWithinOrders("/app/orders")}
              order={detailedOrder}
            />
          ) : activePage === "Commandes" ? (
            <OrdersManagement
              onView={(order) =>
                navigateWithinOrders(`/app/orders/${order.reference}`)
              }
            />
          ) : activePage === "Imports" && isImportHistory ? (
            <ImportHistoryPage />
          ) : activePage === "Imports" ? (
            <SalesImportPage
              onOpenHistory={() =>
                navigateWithinImports("/app/imports/history")
              }
            />
          ) : activePage === "Alertes" ? (
            <StockAlertsPage />
          ) : activePage === "Prévisions" ? (
            <ForecastingPage />
          ) : activePage === "Rapports" ? (
            <ReportsPage />
          ) : activePage === "Administration" ? (
            <AdministrationPage />
          ) : (
            <section aria-label={activePage} className="section-stage" />
          )}
        </div>
      </div>
    </main>
  );
}

export function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  return path.startsWith("/app") ? (
    <AuthenticatedLayout onLogout={() => navigate("/")} />
  ) : (
    <LoginPage />
  );
}

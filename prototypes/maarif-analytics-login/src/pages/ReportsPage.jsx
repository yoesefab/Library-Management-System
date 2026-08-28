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

export function ReportsPage() {
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

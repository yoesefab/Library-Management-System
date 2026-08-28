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
import { formatMad } from "../shared/catalogData.js";
import { SALES_IMPORT_ERRORS } from "../shared/salesImportData.js";

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

export function SalesImportPage({ onOpenHistory }) {
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

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

import { SALES_IMPORT_ERRORS } from "../shared/salesImportData.js";

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

export function ImportHistoryPage() {
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

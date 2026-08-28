import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, CloudArrowUp, Eye } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { importsApi } from "../../api/imports-api";
import { InlineFeedback, PageState } from "../../components/feedback/PageState";
import { Pagination } from "../../components/tables/Pagination";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import type { ImportPreview } from "../../types/api";
import { formatDateTime, statusLabel } from "../../utils/format";

export function ImportsPage() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(0);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const imports = useQuery({
    queryKey: ["imports", page],
    queryFn: ({ signal }) => importsApi.list(page, signal),
  });
  const upload = useMutation({
    mutationFn: importsApi.preview,
    onSuccess: (data) => {
      setPreview(data);
      void queryClient.invalidateQueries({ queryKey: ["imports"] });
    },
  });
  const confirm = useMutation({
    mutationFn: (id: number) => importsApi.confirm(id),
    onSuccess: (data) => {
      setPreview(data);
      void queryClient.invalidateQueries({ queryKey: ["imports"] });
    },
  });
  const fileChanged = (file?: File) => {
    if (!file) return;
    if (!file.name.toLocaleLowerCase().endsWith(".csv")) return;
    upload.mutate(file);
  };
  return (
    <section className="sales-import-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Données de vente</p>
          <h2>Imports CSV</h2>
          <p>
            Prévisualisez et validez les ventes synthétiques avant toute
            écriture.
          </p>
        </div>
      </div>
      <Card className="import-workflow-panel">
        <div className="sales-import-stepper" aria-label="Étapes d’import">
          {["Téléverser", "Valider", "Aperçu", "Confirmer", "Résultats"].map(
            (label, index) => (
              <span
                className={
                  preview
                    ? index <=
                      (preview.status === "COMPLETED" ||
                      preview.status === "PARTIALLY_COMPLETED"
                        ? 4
                        : 2)
                      ? "is-complete"
                      : ""
                    : index === 0
                      ? "is-current"
                      : ""
                }
                key={label}
              >
                <i>{index + 1}</i>
                {label}
              </span>
            ),
          )}
        </div>
        <div
          className="import-upload-zone"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            fileChanged(event.dataTransfer.files[0]);
          }}
        >
          <CloudArrowUp aria-hidden="true" />
          <h3>Déposez un fichier CSV de ventes</h3>
          <p>Taille maximale 10 Mo. Aucune donnée de production.</p>
          <Button
            className="primary-button"
            disabled={upload.isPending}
            type="button"
          >
            {upload.isPending ? "Validation…" : "Choisir un fichier"}
          </Button>
          <input
            accept=".csv,text/csv"
            className="sr-only"
            ref={inputRef}
            type="file"
            onChange={(event) => fileChanged(event.target.files?.[0])}
          />
        </div>
        {upload.isError ? (
          <InlineFeedback tone="error">{upload.error.message}</InlineFeedback>
        ) : null}
        {preview ? (
          <Card className="import-preview-panel">
            <div className="catalog-panel-header">
              <div>
                <h3>{preview.fileName}</h3>
                <p>
                  {preview.totalRows} lignes analysées — {preview.failedRows}{" "}
                  erreur(s)
                </p>
              </div>
              <Badge className="status-badge">
                {statusLabel(preview.status)}
              </Badge>
            </div>
            {preview.errors.length ? (
              <div className="catalog-table-scroll">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ligne</TableHead>
                      <TableHead>Champ</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Valeur rejetée</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.errors.slice(0, 20).map((error) => (
                      <TableRow key={`${error.rowNumber}-${error.field}`}>
                        <TableCell>{error.rowNumber}</TableCell>
                        <TableCell>{error.field}</TableCell>
                        <TableCell>{error.code}</TableCell>
                        <TableCell>{error.message}</TableCell>
                        <TableCell>{error.rejectedValue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <InlineFeedback>
                <CheckCircle aria-hidden="true" />
                Le fichier est valide et prêt à être confirmé.
              </InlineFeedback>
            )}
            <div className="import-actions">
              <Link className="secondary-button" to={`/imports/${preview.id}`}>
                Voir le détail
              </Link>
              <Button
                className="primary-button"
                disabled={
                  preview.failedRows > 0 ||
                  preview.status === "COMPLETED" ||
                  confirm.isPending
                }
                onClick={() => confirm.mutate(preview.id)}
                type="button"
              >
                {confirm.isPending ? "Import en cours…" : "Confirmer l’import"}
              </Button>
            </div>
            {confirm.isError ? (
              <InlineFeedback tone="error">
                {confirm.error.message}
              </InlineFeedback>
            ) : null}
          </Card>
        ) : null}
      </Card>
      <Card className="catalog-panel">
        <div className="catalog-panel-header">
          <div>
            <h3>Historique des imports</h3>
            <p>Traitements enregistrés par le backend</p>
          </div>
        </div>
        {imports.isPending ? (
          <PageState
            loading
            title="Chargement de l’historique"
            message="Récupération des imports…"
          />
        ) : imports.isError ? (
          <PageState
            title="Historique indisponible"
            message={imports.error.message}
          />
        ) : imports.data.content.length ? (
          <>
            <div className="catalog-table-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fichier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Lignes</TableHead>
                    <TableHead>Erreurs</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imports.data.content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <strong>{item.fileName}</strong>
                        <small>{item.checksum.slice(0, 12)}…</small>
                      </TableCell>
                      <TableCell>{formatDateTime(item.startedAt)}</TableCell>
                      <TableCell>{statusLabel(item.status)}</TableCell>
                      <TableCell>{item.totalRows}</TableCell>
                      <TableCell>{item.failedRows}</TableCell>
                      <TableCell>
                        <Link
                          aria-label={`Voir ${item.fileName}`}
                          to={`/imports/${item.id}`}
                        >
                          <Eye aria-hidden="true" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Pagination
              page={imports.data.page}
              totalPages={imports.data.totalPages}
              totalElements={imports.data.totalElements}
              onChange={setPage}
            />
          </>
        ) : (
          <PageState
            title="Aucun import"
            message="Téléversez un fichier CSV pour commencer."
          />
        )}
      </Card>
    </section>
  );
}

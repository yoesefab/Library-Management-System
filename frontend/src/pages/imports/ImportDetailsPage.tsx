import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, DownloadSimple } from "@phosphor-icons/react";
import { Link, useParams } from "react-router-dom";
import { importsApi } from "../../api/imports-api";
import { InlineFeedback, PageState } from "../../components/feedback/PageState";
import {
  downloadResponse,
  formatDateTime,
  statusLabel,
} from "../../utils/format";
export function ImportDetailsPage() {
  const id = Number(useParams().id);
  const queryClient = useQueryClient();
  const detail = useQuery({
    queryKey: ["import", id],
    queryFn: ({ signal }) => importsApi.get(id, signal),
  });
  const confirm = useMutation({
    mutationFn: () => importsApi.confirm(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["imports"] });
      await detail.refetch();
    },
  });
  const download = useMutation({
    mutationFn: () => importsApi.errors(id),
    onSuccess: (response) =>
      downloadResponse(response, `import-errors-${id}.csv`),
  });
  if (detail.isPending)
    return (
      <PageState
        loading
        title="Chargement de l’import"
        message="Récupération des résultats…"
      />
    );
  if (detail.isError)
    return (
      <PageState title="Import introuvable" message={detail.error.message} />
    );
  const item = detail.data;
  return (
    <section className="import-history-page">
      <Link className="back-link" to="/imports">
        <ArrowLeft aria-hidden="true" />
        Retour aux imports
      </Link>
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">{statusLabel(item.status)}</p>
          <h2>{item.fileName}</h2>
          <p>Démarré le {formatDateTime(item.startedAt)}</p>
        </div>
        <div>
          <button
            className="secondary-button"
            disabled={!item.failedRows || download.isPending}
            onClick={() => download.mutate()}
            type="button"
          >
            <DownloadSimple aria-hidden="true" />
            Rapport d’erreurs
          </button>
          <button
            className="primary-button"
            disabled={
              item.failedRows > 0 ||
              item.status === "COMPLETED" ||
              confirm.isPending
            }
            onClick={() => confirm.mutate()}
            type="button"
          >
            Confirmer
          </button>
        </div>
      </div>
      <section className="product-kpi-grid">
        <article>
          <span>Total</span>
          <strong>{item.totalRows}</strong>
        </article>
        <article>
          <span>Valides</span>
          <strong>{item.successfulRows}</strong>
        </article>
        <article>
          <span>Erreurs</span>
          <strong>{item.failedRows}</strong>
        </article>
        <article>
          <span>Checksum</span>
          <strong title={item.checksum}>{item.checksum.slice(0, 10)}…</strong>
        </article>
      </section>
      {item.errors.length ? (
        <div className="catalog-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Ligne</th>
                <th>Champ</th>
                <th>Code</th>
                <th>Message</th>
                <th>Valeur</th>
              </tr>
            </thead>
            <tbody>
              {item.errors.map((error) => (
                <tr key={`${error.rowNumber}-${error.field}`}>
                  <td>{error.rowNumber}</td>
                  <td>{error.field}</td>
                  <td>{error.code}</td>
                  <td>{error.message}</td>
                  <td>{error.rejectedValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <InlineFeedback>Aucune erreur de validation.</InlineFeedback>
      )}
      {confirm.isError || download.isError ? (
        <InlineFeedback tone="error">
          {(confirm.error ?? download.error)?.message}
        </InlineFeedback>
      ) : null}
    </section>
  );
}

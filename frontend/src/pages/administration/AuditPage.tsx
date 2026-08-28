import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { administrationApi } from "../../api/administration-api";
import { PageState } from "../../components/feedback/PageState";
import { AdminTabs } from "../../components/navigation/AdminTabs";
import { Pagination } from "../../components/tables/Pagination";
import { formatDateTime } from "../../utils/format";
export function AuditPage() {
  const [page, setPage] = useState(0);
  const audit = useQuery({
    queryKey: ["audit", page],
    queryFn: ({ signal }) => administrationApi.audit(page, signal),
  });
  return (
    <section className="administration-page">
      <AdminTabs />
      <div className="catalog-heading">
        <div>
          <h2>Journal d’audit</h2>
          <p>Événements non sensibles enregistrés par le backend.</p>
        </div>
      </div>
      {audit.isPending ? (
        <PageState
          loading
          title="Chargement du journal"
          message="Récupération des événements…"
        />
      ) : audit.isError ? (
        <PageState title="Journal indisponible" message={audit.error.message} />
      ) : audit.data.content.length ? (
        <>
          <div className="catalog-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Action</th>
                  <th>Entité</th>
                  <th>Identifiant</th>
                </tr>
              </thead>
              <tbody>
                {audit.data.content.map((event) => (
                  <tr key={event.id}>
                    <td>{formatDateTime(event.occurredAt)}</td>
                    <td>{event.userEmail}</td>
                    <td>{event.action}</td>
                    <td>{event.entityType}</td>
                    <td>{event.entityId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={audit.data.page}
            totalPages={audit.data.totalPages}
            totalElements={audit.data.totalElements}
            onChange={setPage}
          />
        </>
      ) : (
        <PageState
          title="Aucun événement"
          message="Le journal d’audit est vide."
        />
      )}
    </section>
  );
}

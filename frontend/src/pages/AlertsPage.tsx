import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowClockwise, CheckCircle, Warning } from "@phosphor-icons/react";
import { useState } from "react";
import { useAuth } from "../app/auth-context";
import { alertsApi } from "../api/alerts-api";
import { ConfirmDialog } from "../components/feedback/ConfirmDialog";
import { InlineFeedback, PageState } from "../components/feedback/PageState";
import { Pagination } from "../components/tables/Pagination";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import type { AlertStatus, AlertType, StockAlert } from "../types/api";
import { formatDateTime, statusLabel } from "../utils/format";

export function AlertsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AlertStatus | "">("");
  const [type, setType] = useState<AlertType | "">("");
  const [page, setPage] = useState(0);
  const [action, setAction] = useState<{
    alert: StockAlert;
    kind: "acknowledge" | "resolve";
  } | null>(null);
  const alerts = useQuery({
    queryKey: ["alerts", status, type, page],
    queryFn: ({ signal }) =>
      alertsApi.list(status || undefined, type || undefined, page, signal),
    placeholderData: (previous) => previous,
  });
  const refresh = useMutation({
    mutationFn: alertsApi.refresh,
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });
  const update = useMutation({
    mutationFn: ({ alert, kind }: NonNullable<typeof action>) =>
      kind === "acknowledge"
        ? alertsApi.acknowledge(alert.id)
        : alertsApi.resolve(alert.id),
    onSuccess: async () => {
      setAction(null);
      await queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
  return (
    <section className="stock-alerts-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Surveillance</p>
          <h2>Alertes de stock</h2>
          <p>Les explications et priorités sont calculées par le backend.</p>
        </div>
        {user?.role !== "STOCK_EMPLOYEE" ? (
          <Button
            className="secondary-button"
            disabled={refresh.isPending}
            onClick={() => refresh.mutate()}
            type="button"
          >
            <ArrowClockwise aria-hidden="true" />
            {refresh.isPending ? "Actualisation…" : "Actualiser les alertes"}
          </Button>
        ) : null}
      </div>
      {refresh.isSuccess ? (
        <InlineFeedback>
          {refresh.data.created} nouvelle(s) alerte(s) créée(s).
        </InlineFeedback>
      ) : null}
      {refresh.isError ? (
        <InlineFeedback tone="error">{refresh.error.message}</InlineFeedback>
      ) : null}
      <div className="catalog-toolbar">
        <div>
          <Label htmlFor="alert-status">Statut</Label>
          <Select
            value={status || "all"}
            onValueChange={(value) => {
              setStatus(value === "all" ? "" : (value as AlertStatus));
              setPage(0);
            }}
          >
            <SelectTrigger className="catalog-select-trigger" id="alert-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="OPEN">Ouvertes</SelectItem>
              <SelectItem value="ACKNOWLEDGED">Prises en compte</SelectItem>
              <SelectItem value="RESOLVED">Résolues</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="alert-type">Type</Label>
          <Select
            value={type || "all"}
            onValueChange={(value) => {
              setType(value === "all" ? "" : (value as AlertType));
              setPage(0);
            }}
          >
            <SelectTrigger className="catalog-select-trigger" id="alert-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {(
                [
                  "LOW_STOCK",
                  "OUT_OF_STOCK",
                  "APPROACHING_STOCKOUT",
                  "SLOW_MOVING",
                  "DEAD_STOCK",
                ] as AlertType[]
              ).map((value) => (
                <SelectItem key={value} value={value}>
                  {statusLabel(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {alerts.isPending ? (
        <PageState
          loading
          title="Chargement des alertes"
          message="Analyse des stocks en cours…"
        />
      ) : alerts.isError ? (
        <PageState
          title="Alertes indisponibles"
          message={alerts.error.message}
        />
      ) : alerts.data.content.length ? (
        <>
          <div className="alerts-list">
            {alerts.data.content.map((alert) => (
              <Card
                className={`stock-alert-card stock-alert-card--${alert.severity.toLocaleLowerCase()}`}
                key={alert.id}
              >
                <div className="stock-alert-icon">
                  <Warning aria-hidden="true" weight="fill" />
                </div>
                <div className="stock-alert-content">
                  <div>
                    <Badge className="status-badge">
                      {statusLabel(alert.severity)}
                    </Badge>
                    <Badge className="status-badge">
                      {statusLabel(alert.type)}
                    </Badge>
                  </div>
                  <h3>{alert.productTitle}</h3>
                  <p>{alert.explanation}</p>
                  <small>
                    {alert.sku} · {formatDateTime(alert.createdAt)}
                  </small>
                </div>
                <div className="stock-alert-actions">
                  <span>{statusLabel(alert.status)}</span>
                  {alert.status === "OPEN" ? (
                    <Button
                      className="secondary-button"
                      onClick={() => setAction({ alert, kind: "acknowledge" })}
                      type="button"
                    >
                      Prendre en compte
                    </Button>
                  ) : null}
                  {alert.status !== "RESOLVED" ? (
                    <Button
                      className="primary-button"
                      onClick={() => setAction({ alert, kind: "resolve" })}
                      type="button"
                    >
                      <CheckCircle aria-hidden="true" />
                      Résoudre
                    </Button>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
          <Pagination
            page={alerts.data.page}
            totalPages={alerts.data.totalPages}
            totalElements={alerts.data.totalElements}
            onChange={setPage}
          />
        </>
      ) : (
        <PageState
          title="Aucune alerte"
          message="Aucune alerte ne correspond aux filtres sélectionnés."
        />
      )}
      {action ? (
        <ConfirmDialog
          title={
            action.kind === "acknowledge"
              ? "Prendre en compte l’alerte"
              : "Résoudre l’alerte"
          }
          confirmLabel="Confirmer"
          pending={update.isPending}
          onCancel={() => setAction(null)}
          onConfirm={() => update.mutate(action)}
        >
          <p>{action.alert.productTitle}</p>
          <p>
            {action.kind === "acknowledge"
              ? "L’alerte restera ouverte mais sera marquée comme traitée."
              : "Confirmez que la situation de stock a été examinée."}
          </p>
          {update.isError ? <p role="alert">{update.error.message}</p> : null}
        </ConfirmDialog>
      ) : null}
    </section>
  );
}

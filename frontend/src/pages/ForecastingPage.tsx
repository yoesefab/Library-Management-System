import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChartLineUp, Lightbulb } from "@phosphor-icons/react";
import { useState } from "react";
import { forecastingApi } from "../api/forecasting-api";
import { productsApi } from "../api/products-api";
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
import type { Forecast, RecommendationStatus } from "../types/api";
import { formatDateTime, formatQuantity, statusLabel } from "../utils/format";

export function ForecastingPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<RecommendationStatus | "">("");
  const [productId, setProductId] = useState(0);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const products = useQuery({
    queryKey: ["products", "forecast-select"],
    queryFn: ({ signal }) =>
      productsApi.list({ active: true, size: 100 }, signal),
  });
  const recommendations = useQuery({
    queryKey: ["recommendations", status, page],
    queryFn: ({ signal }) =>
      forecastingApi.recommendations(status || undefined, page, signal),
  });
  const generate = useMutation({
    mutationFn: (id: number) => forecastingApi.generate(id),
    onSuccess: setForecast,
  });
  const recommend = useMutation({
    mutationFn: (id: number) => forecastingApi.recommend(id),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
  });
  const update = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: RecommendationStatus;
    }) => forecastingApi.setStatus(id, status),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
  });
  const selectedId = productId || products.data?.content[0]?.id || 0;
  return (
    <section className="forecasting-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Prévision explicable</p>
          <h2>Prévisions et réapprovisionnement</h2>
          <p>
            Le backend calcule la demande, le modèle retenu et les
            recommandations; aucune commande n’est automatique.
          </p>
        </div>
      </div>
      <Card className="forecast-selection-panel">
        <div>
          <Label htmlFor="forecast-product">Produit</Label>
          <Select
            value={selectedId ? String(selectedId) : undefined}
            onValueChange={(value) => setProductId(Number(value))}
          >
            <SelectTrigger id="forecast-product">
              <SelectValue placeholder="Sélectionnez un produit" />
            </SelectTrigger>
            <SelectContent>
              {products.data?.content.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.title} — {item.sku}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="secondary-button"
          disabled={!selectedId || generate.isPending}
          onClick={() => generate.mutate(selectedId)}
          type="button"
        >
          <ChartLineUp aria-hidden="true" />
          {generate.isPending ? "Calcul…" : "Générer la prévision"}
        </Button>
        <Button
          className="primary-button"
          disabled={!selectedId || recommend.isPending}
          onClick={() => recommend.mutate(selectedId)}
          type="button"
        >
          <Lightbulb aria-hidden="true" />
          {recommend.isPending ? "Calcul…" : "Créer la recommandation"}
        </Button>
      </Card>
      {generate.isError || recommend.isError ? (
        <InlineFeedback tone="error">
          {(generate.error ?? recommend.error)?.message}
        </InlineFeedback>
      ) : null}
      {forecast ? (
        <Card className="forecast-details-panel">
          <div className="catalog-panel-header">
            <div>
              <h3>{forecast.title}</h3>
              <p>
                {forecast.periodStart} — {forecast.periodEnd}
              </p>
            </div>
            <Badge className="status-badge">
              {statusLabel(forecast.method)}
            </Badge>
          </div>
          <section className="product-kpi-grid">
            <article>
              <span>Demande prévue</span>
              <strong>{formatQuantity(forecast.predictedDemand)}</strong>
            </article>
            <article>
              <span>Mesure de qualité</span>
              <strong>{forecast.accuracyMetric}</strong>
            </article>
            <article>
              <span>Précision</span>
              <strong>{forecast.accuracyValue}</strong>
            </article>
            <article>
              <span>Générée le</span>
              <strong>{formatDateTime(forecast.generatedAt)}</strong>
            </article>
          </section>
          <div className="forecast-explanation">
            <h4>Explication du modèle</h4>
            <p>{forecast.explanation}</p>
            <small>{forecast.parameters}</small>
          </div>
          <InlineFeedback tone="info">
            Le backend ne fournit pas encore les points historiques/prédits
            nécessaires à la courbe approuvée; aucune série n’est simulée.
          </InlineFeedback>
        </Card>
      ) : null}
      <div className="catalog-toolbar">
        <div>
          <Label htmlFor="recommendation-status">
            Statut des recommandations
          </Label>
          <Select
            value={status || "all"}
            onValueChange={(value) =>
              setStatus(value === "all" ? "" : (value as RecommendationStatus))
            }
          >
            <SelectTrigger
              className="catalog-select-trigger"
              id="recommendation-status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {(
                [
                  "PROPOSED",
                  "ACKNOWLEDGED",
                  "DISMISSED",
                  "ORDERED",
                ] as RecommendationStatus[]
              ).map((value) => (
                <SelectItem key={value} value={value}>
                  {statusLabel(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {recommendations.isPending ? (
        <PageState
          loading
          title="Chargement des recommandations"
          message="Récupération des calculs…"
        />
      ) : recommendations.isError ? (
        <PageState
          title="Recommandations indisponibles"
          message={recommendations.error.message}
        />
      ) : recommendations.data.content.length ? (
        <>
          <div className="recommendation-grid">
            {recommendations.data.content.map((item) => (
              <Card className="recommendation-card" key={item.id}>
                <div>
                  <Badge className="status-badge">
                    {statusLabel(item.status)}
                  </Badge>
                  <h3>{item.title}</h3>
                  <small>{item.sku}</small>
                </div>
                <dl>
                  <div>
                    <dt>Stock actuel</dt>
                    <dd>{item.currentStock}</dd>
                  </div>
                  <div>
                    <dt>Point de commande</dt>
                    <dd>{item.reorderPoint}</dd>
                  </div>
                  <div>
                    <dt>Quantité recommandée</dt>
                    <dd>{item.recommendedQuantity}</dd>
                  </div>
                  <div>
                    <dt>Délai</dt>
                    <dd>{item.leadTimeDays} j</dd>
                  </div>
                </dl>
                <p>{item.explanation}</p>
                <div className="recommendation-actions">
                  <Button
                    disabled={item.status !== "PROPOSED" || update.isPending}
                    onClick={() =>
                      update.mutate({ id: item.id, status: "ACKNOWLEDGED" })
                    }
                    type="button"
                  >
                    Prendre en compte
                  </Button>
                  <Button
                    disabled={item.status !== "PROPOSED" || update.isPending}
                    onClick={() =>
                      update.mutate({ id: item.id, status: "DISMISSED" })
                    }
                    type="button"
                  >
                    Écarter
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Pagination
            page={recommendations.data.page}
            totalPages={recommendations.data.totalPages}
            totalElements={recommendations.data.totalElements}
            onChange={setPage}
          />
        </>
      ) : (
        <PageState
          title="Aucune recommandation"
          message="Générez une recommandation pour un produit actif."
        />
      )}
    </section>
  );
}

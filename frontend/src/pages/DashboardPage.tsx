import {
  Archive,
  BookOpen,
  CurrencyDollar,
  ShoppingCart,
  TrendUp,
  Warning,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { dashboardApi } from "../api/dashboard-api";
import { productsApi } from "../api/products-api";
import { DashboardCharts } from "../components/charts/DashboardCharts";
import { PageState } from "../components/feedback/PageState";
import {
  DashboardFilters,
  type DashboardFilterValues,
} from "../components/forms/DashboardFilters";
import { DashboardProductTables } from "../components/tables/DashboardProductTables";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  formatCasablancaDateInput,
  formatCurrency,
  formatQuantity,
  toCasablancaInstant,
} from "../utils/format";

const makeDefaults = (): DashboardFilterValues => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 86_400_000);
  return {
    start: formatCasablancaDateInput(thirtyDaysAgo),
    end: formatCasablancaDateInput(today),
    categoryId: "",
    language: "",
    authorId: "",
    publisherId: "",
  };
};

function DashboardSkeleton() {
  return (
    <div
      aria-label="Chargement du tableau de bord"
      className="dashboard-skeleton"
      role="status"
    >
      <span className="sr-only">Chargement des indicateurs…</span>
      <div className="kpi-grid">
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton className="kpi-card" key={index} />
        ))}
      </div>
      <div className="trends-grid">
        <Skeleton className="trend-panel" />
        <Skeleton className="trend-panel" />
      </div>
      <div className="distribution-grid">
        <Skeleton className="distribution-panel" />
        <Skeleton className="distribution-panel" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [filterValues, setFilterValues] = useState(makeDefaults);
  const filters = useMemo(
    () => ({
      start: filterValues.start
        ? toCasablancaInstant(filterValues.start, "start")
        : "",
      end: filterValues.end ? toCasablancaInstant(filterValues.end, "end") : "",
      categoryId: filterValues.categoryId
        ? Number(filterValues.categoryId)
        : undefined,
      language: filterValues.language || undefined,
      authorId: filterValues.authorId
        ? Number(filterValues.authorId)
        : undefined,
      publisherId: filterValues.publisherId
        ? Number(filterValues.publisherId)
        : undefined,
    }),
    [filterValues],
  );

  const dashboard = useQuery({
    queryKey: ["dashboard", filters],
    queryFn: ({ signal }) => dashboardApi.get(filters, signal),
    enabled: Boolean(filterValues.start && filterValues.end),
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => productsApi.categories(signal),
  });
  const authors = useQuery({
    queryKey: ["authors"],
    queryFn: ({ signal }) => productsApi.authors(signal),
  });
  const publishers = useQuery({
    queryKey: ["publishers"],
    queryFn: ({ signal }) => productsApi.publishers(signal),
  });

  const updateFilter = (key: keyof DashboardFilterValues, value: string) => {
    setFilterValues((current) => ({ ...current, [key]: value }));
  };

  const referenceError = categories.error ?? authors.error ?? publishers.error;
  if (referenceError) {
    return (
      <PageState
        message={referenceError.message}
        onRetry={() =>
          void Promise.all([
            categories.refetch(),
            authors.refetch(),
            publishers.refetch(),
          ])
        }
        title="Impossible de charger les filtres"
      />
    );
  }

  const data = dashboard.data;
  const kpis = data
    ? [
        {
          label: "Chiffre d’affaires",
          value: formatCurrency(data.totalRevenue),
          icon: CurrencyDollar,
        },
        {
          label: "Commandes",
          value: formatQuantity(data.numberOfOrders),
          icon: ShoppingCart,
        },
        {
          label: "Exemplaires vendus",
          value: formatQuantity(data.unitsSold),
          icon: BookOpen,
        },
        {
          label: "Panier moyen",
          value: formatCurrency(data.averageOrderValue),
          icon: TrendUp,
        },
        {
          label: "Stock actuel",
          value: formatQuantity(data.currentStockQuantity),
          icon: Archive,
        },
        {
          label: "Stock faible",
          value: formatQuantity(data.lowStockProducts),
          icon: Warning,
          tone: "warning",
        },
        {
          label: "Rupture de stock",
          value: formatQuantity(data.outOfStockProducts),
          icon: Warning,
          tone: "danger",
        },
      ]
    : [];

  return (
    <div className="management-dashboard">
      <DashboardFilters
        authors={authors.data?.content ?? []}
        categories={categories.data?.content ?? []}
        publishers={publishers.data?.content ?? []}
        values={filterValues}
        onChange={updateFilter}
        onReset={() => setFilterValues(makeDefaults())}
      />
      {dashboard.isFetching && data ? (
        <p className="refresh-indicator" role="status">
          Actualisation des indicateurs…
        </p>
      ) : null}
      {dashboard.isPending ? <DashboardSkeleton /> : null}
      {dashboard.isError ? (
        <PageState
          message={dashboard.error.message}
          onRetry={() => void dashboard.refetch()}
          title="Impossible de charger les données"
        />
      ) : null}
      {data ? (
        <>
          <section aria-label="Indicateurs clés" className="kpi-grid">
            {kpis.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  className={`kpi-card${item.tone ? ` kpi-card--${item.tone}` : ""}`}
                  key={item.label}
                >
                  <Icon aria-hidden="true" className="kpi-icon" />
                  <p className="kpi-label">{item.label}</p>
                  <p className="kpi-value">{item.value}</p>
                  <p className="kpi-delta">
                    <small>Période sélectionnée</small>
                  </p>
                </Card>
              );
            })}
          </section>
          <DashboardCharts data={data} />
          <DashboardProductTables data={data} />
          {!data.numberOfOrders ? (
            <PageState
              message="Modifiez la période ou les critères pour afficher des indicateurs."
              title="Aucun résultat pour ces filtres"
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

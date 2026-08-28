import {
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { Dashboard } from "@/types/api";
import { formatCurrency, formatQuantity } from "@/utils/format";

const colors = ["#08734e", "#42a37f", "#8bc8ae", "#c7e4d7", "#dfe9e4"];

export function DashboardCharts({ data }: { data: Dashboard }) {
  return (
    <>
      <section aria-label="Tendances" className="trends-grid">
        <Card className="trend-panel">
          <h2>Évolution du chiffre d’affaires (MAD)</h2>
          <div
            aria-label="Courbe du chiffre d’affaires"
            className="trend-chart"
            role="img"
          >
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={data.revenueTrend}>
                <CartesianGrid stroke="#e6e9e7" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line
                  dataKey="revenue"
                  isAnimationActive={false}
                  stroke="#08734e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="trend-panel">
          <h2>Évolution des commandes</h2>
          <div
            aria-label="Courbe des commandes"
            className="trend-chart"
            role="img"
          >
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={data.revenueTrend}>
                <CartesianGrid stroke="#e6e9e7" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  dataKey="orders"
                  isAnimationActive={false}
                  stroke="#08734e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
      <section
        aria-label="Répartition des ventes"
        className="distribution-grid"
      >
        {(
          [
            ["Ventes par catégorie", data.salesByCategory],
            ["Ventes par langue", data.salesByLanguage],
          ] as const
        ).map(([title, rows]) => (
          <Card className="distribution-panel" key={title}>
            <h2>{title}</h2>
            <div className="distribution-content">
              <div aria-label={title} className="donut-chart" role="img">
                <ResponsiveContainer height="100%" width="100%">
                  <PieChart>
                    <Pie
                      data={rows}
                      dataKey="value"
                      innerRadius="58%"
                      isAnimationActive={false}
                      nameKey="label"
                      outerRadius="92%"
                    >
                      {rows.map((item, index) => (
                        <Cell
                          fill={colors[index % colors.length]}
                          key={item.label}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="distribution-legend">
                {rows.map((item, index) => (
                  <div className="legend-row" key={item.label}>
                    <span className="legend-name">
                      <i
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                      {item.label}
                    </span>
                    <strong>{formatQuantity(item.value)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}

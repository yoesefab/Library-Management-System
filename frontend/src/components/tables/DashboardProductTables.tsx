import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Dashboard, ProductMetric } from "@/types/api";
import { formatQuantity } from "@/utils/format";

function ProductTable({
  title,
  products,
}: {
  title: string;
  products: ProductMetric[];
}) {
  return (
    <Card className="dashboard-table-panel">
      <h2>{title}</h2>
      <div className="compact-table-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Ventes</TableHead>
              <TableHead>Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.title}</TableCell>
                <TableCell>{formatQuantity(product.units)}</TableCell>
                <TableCell>{formatQuantity(product.currentStock)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Link className="table-link" to="/products">
        Voir tous les produits ›
      </Link>
    </Card>
  );
}

export function DashboardProductTables({ data }: { data: Dashboard }) {
  return (
    <section
      aria-label="Performance des produits"
      className="product-insights-grid"
    >
      <ProductTable
        products={data.bestsellingProducts}
        title="Meilleures ventes"
      />
      <ProductTable
        products={data.slowMovingProducts}
        title="Produits à faible rotation"
      />
      <Card className="dashboard-table-panel stock-risk-panel">
        <h2>Stocks à risque</h2>
        <div className="compact-table-scroll">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Situation</TableHead>
                <TableHead>Produits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Stock faible</TableCell>
                <TableCell>{formatQuantity(data.lowStockProducts)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rupture de stock</TableCell>
                <TableCell>{formatQuantity(data.outOfStockProducts)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <Link className="table-link" to="/inventory">
          Voir le stock ›
        </Link>
      </Card>
    </section>
  );
}

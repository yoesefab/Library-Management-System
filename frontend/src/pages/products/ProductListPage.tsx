import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Prohibit,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../app/auth-context";
import { inventoryApi } from "../../api/inventory-api";
import { productsApi } from "../../api/products-api";
import { ConfirmDialog } from "../../components/feedback/ConfirmDialog";
import { PageState } from "../../components/feedback/PageState";
import { Pagination } from "../../components/tables/Pagination";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import type { ProductSummary } from "../../types/api";
import { formatCurrency } from "../../utils/format";

export function ProductListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const canWrite = user?.role !== "STOCK_EMPLOYEE";
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [active, setActive] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<ProductSummary | null>(null);
  const products = useQuery({
    queryKey: ["products", { query, language, active, categoryId, page }],
    queryFn: ({ signal }) =>
      productsApi.list(
        {
          query,
          language: language || undefined,
          active: active ? active === "true" : undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
          page,
          size: 20,
        },
        signal,
      ),
    placeholderData: (previous) => previous,
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => productsApi.categories(signal),
  });
  const inventory = useQuery({
    queryKey: ["inventory", "catalog-stock"],
    queryFn: ({ signal }) => inventoryApi.list(0, 100, signal),
  });
  const stockByProduct = useMemo(
    () =>
      new Map(
        inventory.data?.content.map((item) => [item.productId, item]) ?? [],
      ),
    [inventory.data],
  );
  const deactivate = useMutation({
    mutationFn: (id: number) => productsApi.deactivate(id),
    onSuccess: async () => {
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  return (
    <section className="product-catalog" aria-labelledby="catalog-title">
      <div
        className="catalog-toolbar"
        aria-label="Recherche et filtres du catalogue"
      >
        <form
          className="catalog-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(queryInput.trim());
            setPage(0);
          }}
        >
          <label className="sr-only" htmlFor="catalog-search">
            Rechercher un produit
          </label>
          <MagnifyingGlass aria-hidden="true" />
          <Input
            id="catalog-search"
            placeholder="Rechercher par SKU, titre ou ISBN"
            type="search"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
          />
          <Button disabled={products.isFetching} type="submit">
            Rechercher
          </Button>
        </form>
        <div className="catalog-filters">
          <label>
            <span>Catégorie</span>
            <Select
              value={categoryId || "all"}
              onValueChange={(value) => {
                setCategoryId(value === "all" ? "" : value);
                setPage(0);
              }}
            >
              <SelectTrigger
                aria-label="Catégorie"
                className="catalog-select-trigger"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {categories.data?.content.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label>
            <span>Langue</span>
            <Select
              value={language || "all"}
              onValueChange={(value) => {
                setLanguage(value === "all" ? "" : value);
                setPage(0);
              }}
            >
              <SelectTrigger
                aria-label="Langue"
                className="catalog-select-trigger"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">Arabe</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label>
            <span>Statut</span>
            <Select
              value={active || "all"}
              onValueChange={(value) => {
                setActive(value === "all" ? "" : value);
                setPage(0);
              }}
            >
              <SelectTrigger
                aria-label="Statut"
                className="catalog-select-trigger"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="true">Actifs</SelectItem>
                <SelectItem value="false">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>
        {canWrite ? (
          <Button asChild className="catalog-create-button">
            <Link to="/products/new">
              <Plus aria-hidden="true" />
              Créer un produit
            </Link>
          </Button>
        ) : null}
      </div>
      <section aria-labelledby="catalog-title" className="catalog-panel">
        <div className="catalog-panel-header">
          <div>
            <h2 id="catalog-title">Catalogue produits</h2>
            <p aria-live="polite">
              {products.isPending
                ? "Chargement des produits…"
                : `${products.data?.totalElements ?? 0} produit${products.data?.totalElements === 1 ? "" : "s"} trouvé${products.data?.totalElements === 1 ? "" : "s"}`}
            </p>
          </div>
          <span>Données synchronisées avec le backend</span>
        </div>
        {products.isPending ? (
          <PageState
            loading
            title="Chargement du catalogue"
            message="Les produits sont en cours de chargement…"
          />
        ) : products.isError ? (
          <PageState
            title="Catalogue indisponible"
            message={products.error.message}
            onRetry={() => void products.refetch()}
          />
        ) : !products.data.content.length ? (
          <PageState
            title="Aucun produit"
            message="Aucun produit ne correspond aux filtres sélectionnés."
          />
        ) : (
          <>
            <div className="catalog-table-scroll">
              <Table className="catalog-table">
                <TableCaption className="sr-only">
                  Liste des produits
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Langue</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock actuel</TableHead>
                    <TableHead>Seuil</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.data.content.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="catalog-sku">
                        {product.sku}
                      </TableCell>
                      <TableCell
                        className="catalog-title"
                        dir={product.language === "ar" ? "rtl" : undefined}
                        lang={product.language === "ar" ? "ar" : undefined}
                      >
                        <strong>{product.title}</strong>
                        <small>
                          {product.publisher ?? "Éditeur non renseigné"}
                        </small>
                      </TableCell>
                      <TableCell>{product.category ?? "—"}</TableCell>
                      <TableCell>{product.language.toUpperCase()}</TableCell>
                      <TableCell className="catalog-number">
                        {formatCurrency(product.sellingPrice)}
                      </TableCell>
                      <TableCell className="catalog-number">
                        {stockByProduct.get(product.id)?.currentStock ?? "—"}
                      </TableCell>
                      <TableCell className="catalog-number">
                        {stockByProduct.get(product.id)?.minimumThreshold ??
                          "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`catalog-status ${product.active ? "catalog-status--active" : "catalog-status--inactive"}`}
                          variant={product.active ? "secondary" : "outline"}
                        >
                          {product.active ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="catalog-row-actions">
                          <Link
                            aria-label={`Voir ${product.title}`}
                            className="catalog-icon-button"
                            to={`/products/${product.id}`}
                          >
                            <Eye aria-hidden="true" />
                          </Link>
                          {canWrite ? (
                            <>
                              <Link
                                aria-label={`Modifier ${product.title}`}
                                className="catalog-icon-button"
                                to={`/products/${product.id}/edit`}
                              >
                                <PencilSimple aria-hidden="true" />
                              </Link>
                              <Button
                                aria-label={`Désactiver ${product.title}`}
                                className="catalog-icon-button catalog-icon-button--danger"
                                disabled={!product.active}
                                title={
                                  !product.active
                                    ? "Le backend ne propose pas la réactivation."
                                    : undefined
                                }
                                onClick={() => setSelected(product)}
                                size="icon"
                                type="button"
                                variant="ghost"
                              >
                                <Prohibit aria-hidden="true" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Pagination
              page={products.data.page}
              totalPages={products.data.totalPages}
              totalElements={products.data.totalElements}
              onChange={setPage}
            />
          </>
        )}
      </section>
      {selected ? (
        <ConfirmDialog
          danger
          title="Désactiver le produit"
          confirmLabel="Désactiver"
          pending={deactivate.isPending}
          onCancel={() => setSelected(null)}
          onConfirm={() => deactivate.mutate(selected.id)}
        >
          <p>
            Le produit <strong>{selected.title}</strong> sera retiré des
            opérations actives sans supprimer son historique.
          </p>
          {deactivate.isError ? (
            <p className="field-error" role="alert">
              {deactivate.error.message}
            </p>
          ) : null}
        </ConfirmDialog>
      ) : null}
    </section>
  );
}

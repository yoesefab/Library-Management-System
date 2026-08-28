import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { inventoryApi } from "../api/inventory-api";
import { productsApi } from "../api/products-api";
import { StockMovementDialog } from "../components/forms/StockMovementDialog";
import { PageState } from "../components/feedback/PageState";
import { Pagination } from "../components/tables/Pagination";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

type StockFilter = "ALL" | "LOW" | "OUT";

export function InventoryPage() {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [stock, setStock] = useState<StockFilter>("ALL");
  const [categoryId, setCategoryId] = useState("all");
  const [language, setLanguage] = useState("all");
  const [dialog, setDialog] = useState(false);
  const inventory = useQuery({
    queryKey: ["inventory", page],
    queryFn: ({ signal }) => inventoryApi.list(page, 20, signal),
    placeholderData: (previous) => previous,
  });
  const products = useQuery({
    queryKey: ["products", "inventory-metadata"],
    queryFn: ({ signal }) => productsApi.list({ page: 0, size: 100 }, signal),
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => productsApi.categories(signal),
  });
  const productById = useMemo(
    () => new Map(products.data?.content?.map((item) => [item.id, item]) ?? []),
    [products.data],
  );
  const visible = useMemo(
    () =>
      inventory.data?.content.filter((item) => {
        const product = productById.get(item.productId);
        const matchesSearch =
          !query ||
          `${item.title} ${item.sku}`
            .toLocaleLowerCase("fr")
            .includes(query.toLocaleLowerCase("fr"));
        const matchesStock =
          stock === "ALL" ||
          (stock === "LOW" &&
            item.currentStock > 0 &&
            item.currentStock <= item.minimumThreshold) ||
          (stock === "OUT" && item.currentStock === 0);
        const matchesCategory =
          categoryId === "all" || product?.category === categoryId;
        const matchesLanguage =
          language === "all" || product?.language === language;
        return (
          matchesSearch && matchesStock && matchesCategory && matchesLanguage
        );
      }) ?? [],
    [categoryId, inventory.data, language, productById, query, stock],
  );

  return (
    <div className="inventory-management">
      <section
        aria-label="Recherche et filtres de l’inventaire"
        className="inventory-toolbar"
      >
        <label className="catalog-search">
          <span className="sr-only">Rechercher</span>
          <MagnifyingGlass aria-hidden="true" />
          <Input
            placeholder="Produit ou SKU"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="inventory-filters">
          <label>
            <span>État du stock</span>
            <Select
              value={stock}
              onValueChange={(value) => setStock(value as StockFilter)}
            >
              <SelectTrigger aria-label="État du stock">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les stocks</SelectItem>
                <SelectItem value="LOW">Stock faible</SelectItem>
                <SelectItem value="OUT">Rupture de stock</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label>
            <span>Catégorie</span>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger aria-label="Catégorie">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {categories.data?.content?.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label>
            <span>Langue</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger aria-label="Langue">
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
        </div>
        <Button
          className="catalog-create-button"
          disabled={!inventory.data?.content.length}
          onClick={() => setDialog(true)}
          type="button"
        >
          <Plus aria-hidden="true" />
          Enregistrer un mouvement
        </Button>
      </section>
      <p className="control-capability-note">
        Les filtres sont appliqués à la page chargée : l’API d’inventaire ne
        propose pas encore ces paramètres côté serveur.
      </p>
      <section className="catalog-panel inventory-panel">
        <div className="catalog-panel-header">
          <div>
            <h2>État de l’inventaire</h2>
            <p>{inventory.data?.totalElements ?? 0} produits</p>
          </div>
          {inventory.isFetching ? (
            <span role="status">Actualisation…</span>
          ) : null}
        </div>
        {inventory.isPending ? (
          <PageState
            loading
            title="Chargement de l’inventaire"
            message="Récupération des niveaux de stock…"
          />
        ) : inventory.isError ? (
          <PageState
            title="Inventaire indisponible"
            message={inventory.error.message}
            onRetry={() => void inventory.refetch()}
          />
        ) : visible.length ? (
          <>
            <div className="catalog-table-scroll inventory-table-scroll">
              <Table>
                <TableCaption className="sr-only">
                  Niveaux de stock des produits
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock actuel</TableHead>
                    <TableHead>Seuil minimum</TableHead>
                    <TableHead>État</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((item) => {
                    const languageCode = productById.get(
                      item.productId,
                    )?.language;
                    const status =
                      item.currentStock === 0
                        ? "Rupture"
                        : item.currentStock <= item.minimumThreshold
                          ? "Stock faible"
                          : "Disponible";
                    return (
                      <TableRow key={item.productId}>
                        <TableCell
                          className="catalog-title"
                          dir={languageCode === "ar" ? "rtl" : undefined}
                          lang={languageCode === "ar" ? "ar" : undefined}
                        >
                          {item.title}
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.currentStock} ex.</TableCell>
                        <TableCell>{item.minimumThreshold} ex.</TableCell>
                        <TableCell>
                          <Badge
                            className={`catalog-status ${item.currentStock === 0 ? "catalog-status--out" : item.currentStock <= item.minimumThreshold ? "catalog-status--low" : "catalog-status--active"}`}
                            variant={
                              item.currentStock === 0
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <Pagination
              page={inventory.data.page}
              totalPages={inventory.data.totalPages}
              totalElements={inventory.data.totalElements}
              onChange={setPage}
            />
          </>
        ) : (
          <PageState
            title="Aucun stock trouvé"
            message="Modifiez la recherche ou les filtres pour afficher des produits."
          />
        )}
      </section>
      <section className="catalog-panel recent-movements-panel">
        <div className="catalog-panel-header">
          <div>
            <h2>Mouvements récents</h2>
            <p>Historique consolidé</p>
          </div>
        </div>
        <PageState
          title="Historique global indisponible"
          message="Le backend expose actuellement les mouvements produit par produit depuis leur fiche, mais pas encore un flux consolidé."
        />
      </section>
      {dialog && inventory.data ? (
        <StockMovementDialog
          inventory={inventory.data.content}
          onClose={() => setDialog(false)}
        />
      ) : null}
    </div>
  );
}

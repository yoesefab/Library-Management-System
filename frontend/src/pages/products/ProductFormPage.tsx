import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FloppyDisk } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../api/client";
import { productsApi } from "../../api/products-api";
import { InlineFeedback, PageState } from "../../components/feedback/PageState";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Form } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { productSchema, type ProductFormValues } from "../../schemas/product";

const defaults: ProductFormValues = {
  sku: "",
  isbn: "",
  title: "",
  description: "",
  language: "fr",
  sellingPrice: 0,
  purchaseCost: null,
  minimumStockThreshold: 0,
  supplierLeadTimeDays: null,
  categoryId: null,
  publisherId: null,
  supplierId: null,
  authorIds: [],
};

export function ProductFormPage({ mode }: { mode: "create" | "edit" }) {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const product = useQuery({
    queryKey: ["product", id],
    queryFn: ({ signal }) => productsApi.get(id, signal),
    enabled: mode === "edit" && Number.isFinite(id),
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
  const suppliers = useQuery({
    queryKey: ["suppliers"],
    queryFn: ({ signal }) => productsApi.suppliers(signal),
  });
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaults,
  });
  const authorIds = useWatch({ control: form.control, name: "authorIds" });
  useEffect(() => {
    if (product.data)
      form.reset({
        sku: product.data.sku,
        isbn: product.data.isbn ?? "",
        title: product.data.title,
        description: product.data.description ?? "",
        language: product.data.language,
        sellingPrice: product.data.sellingPrice,
        purchaseCost: product.data.purchaseCost,
        minimumStockThreshold: product.data.minimumStockThreshold,
        supplierLeadTimeDays: product.data.supplierLeadTimeDays,
        categoryId: product.data.category?.id ?? null,
        publisherId: product.data.publisher?.id ?? null,
        supplierId: product.data.supplier?.id ?? null,
        authorIds: product.data.authors.map((item) => item.id),
      });
  }, [product.data, form]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (form.formState.isDirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [form.formState.isDirty]);
  const save = useMutation({
    mutationFn: (values: ProductFormValues) =>
      mode === "create"
        ? productsApi.create(values)
        : productsApi.update(id, values),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset(form.getValues());
      navigate(`/products/${created.id}`);
    },
    onError: (error) => {
      if (error instanceof ApiError)
        error.violations.forEach((violation) => {
          if (violation.field in defaults)
            form.setError(violation.field as keyof ProductFormValues, {
              message: violation.message,
            });
        });
    },
  });
  if (mode === "edit" && product.isPending)
    return (
      <PageState
        loading
        title="Chargement du produit"
        message="Préparation du formulaire…"
      />
    );
  if (mode === "edit" && product.isError)
    return (
      <PageState title="Produit indisponible" message={product.error.message} />
    );
  const fieldError = (name: keyof ProductFormValues) =>
    form.formState.errors[name]?.message?.toString();
  return (
    <section className="product-editor">
      <div className="product-editor-heading">
        <div>
          <Link
            className="product-back-link"
            to={mode === "edit" ? `/products/${id}` : "/products"}
          >
            <ArrowLeft aria-hidden="true" />
            Retour
          </Link>
          <h2>
            {mode === "create" ? "Créer un produit" : "Modifier le produit"}
          </h2>
          <p>
            Les informations visibles restent compatibles avec le catalogue
            approuvé.
          </p>
        </div>
      </div>
      {save.isError ? (
        <InlineFeedback tone="error">{save.error.message}</InlineFeedback>
      ) : null}
      <Form {...form}>
        <form
          className="product-editor-form"
          noValidate
          onSubmit={form.handleSubmit((values) => save.mutate(values))}
        >
          <section className="product-form-section">
            <header>
              <h3>Informations générales</h3>
              <p>Identifiants et contenu bibliographique du produit.</p>
            </header>
            <div className="product-form-grid">
              <Label className="product-form-field">
                <span>SKU *</span>
                <Input
                  aria-invalid={Boolean(fieldError("sku"))}
                  {...form.register("sku")}
                />
                {fieldError("sku") ? (
                  <small className="field-error">{fieldError("sku")}</small>
                ) : null}
              </Label>
              <Label className="product-form-field">
                <span>ISBN</span>
                <Input {...form.register("isbn")} />
                {fieldError("isbn") ? (
                  <small className="field-error">{fieldError("isbn")}</small>
                ) : null}
              </Label>
              <Label className="product-form-field field-span-2">
                <span>Titre *</span>
                <Input {...form.register("title")} />
                {fieldError("title") ? (
                  <small className="field-error">{fieldError("title")}</small>
                ) : null}
              </Label>
              <Label className="product-form-field field-span-2">
                <span>Description</span>
                <Textarea rows={4} {...form.register("description")} />
              </Label>
            </div>
          </section>
          <section className="product-form-section">
            <header>
              <h3>Classification</h3>
              <p>Langue, catégorie, éditeur et auteurs associés.</p>
            </header>
            <div className="product-form-grid">
              <Label className="product-form-field">
                <span>Langue *</span>
                <select {...form.register("language")}>
                  <option value="fr">Français</option>
                  <option value="ar">Arabe</option>
                  <option value="en">Anglais</option>
                </select>
              </Label>
              <Label className="product-form-field">
                <span>Catégorie</span>
                <select
                  {...form.register("categoryId", {
                    setValueAs: (value) => (value ? Number(value) : null),
                  })}
                >
                  <option value="">Non renseignée</option>
                  {categories.data?.content.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Label>
              <Label className="product-form-field">
                <span>Éditeur</span>
                <select
                  {...form.register("publisherId", {
                    setValueAs: (value) => (value ? Number(value) : null),
                  })}
                >
                  <option value="">Non renseigné</option>
                  {publishers.data?.content.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Label>
              <Label className="product-form-field">
                <span>Auteurs</span>
                <select
                  multiple
                  value={authorIds.map(String)}
                  onChange={(event) =>
                    form.setValue(
                      "authorIds",
                      Array.from(
                        event.currentTarget.selectedOptions,
                        (option) => Number(option.value),
                      ),
                      { shouldDirty: true },
                    )
                  }
                >
                  {authors.data?.content.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Label>
            </div>
          </section>
          <section className="product-form-section">
            <header>
              <h3>Prix et stock</h3>
              <p>Montants en MAD et seuil opérationnel.</p>
            </header>
            <div className="product-form-grid">
              <Label className="product-form-field">
                <span>Prix de vente (MAD) *</span>
                <Input
                  min="0"
                  step="0.01"
                  type="number"
                  {...form.register("sellingPrice")}
                />
              </Label>
              <Label className="product-form-field">
                <span>Coût d’achat (MAD)</span>
                <Input
                  min="0"
                  step="0.01"
                  type="number"
                  {...form.register("purchaseCost", {
                    setValueAs: (value) =>
                      value === "" ? null : Number(value),
                  })}
                />
              </Label>
              <Label className="product-form-field">
                <span>Seuil de stock minimum</span>
                <Input
                  min="0"
                  type="number"
                  {...form.register("minimumStockThreshold")}
                />
              </Label>
              <Label className="product-form-field">
                <span>Délai fournisseur (jours)</span>
                <Input
                  min="0"
                  type="number"
                  {...form.register("supplierLeadTimeDays", {
                    setValueAs: (value) =>
                      value === "" ? null : Number(value),
                  })}
                />
              </Label>
            </div>
          </section>
          <section className="product-form-section">
            <header>
              <h3>Approvisionnement</h3>
              <p>Fournisseur et disponibilité du produit.</p>
            </header>
            <div className="product-form-grid">
              <Label className="product-form-field">
                <span>Fournisseur</span>
                <select
                  {...form.register("supplierId", {
                    setValueAs: (value) => (value ? Number(value) : null),
                  })}
                >
                  <option value="">Non renseigné</option>
                  {suppliers.data?.content.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Label>
              <div className="product-active-field">
                <Checkbox
                  aria-describedby="product-active-capability"
                  checked
                  disabled
                  id="product-active"
                />
                <div>
                  <Label htmlFor="product-active">Produit actif</Label>
                  <small id="product-active-capability">
                    La désactivation reste disponible depuis le catalogue ; le
                    backend ne propose pas de réactivation.
                  </small>
                </div>
              </div>
            </div>
          </section>
          <div className="product-editor-actions">
            <Link
              className="secondary-button"
              to={mode === "edit" ? `/products/${id}` : "/products"}
            >
              Annuler
            </Link>
            <Button
              className="primary-button"
              disabled={save.isPending}
              type="submit"
            >
              <FloppyDisk aria-hidden="true" />
              {save.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

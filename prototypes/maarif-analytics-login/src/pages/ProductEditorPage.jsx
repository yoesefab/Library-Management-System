import { useEffect, useId, useState } from "react";
import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowClockwise,
  ArrowRight,
  ArrowUp,
  Bell,
  Books,
  BookOpen,
  CalendarBlank,
  CaretDown,
  ChartBar,
  ChartLineUp,
  CheckCircle,
  CircleNotch,
  CloudArrowUp,
  Cube,
  CurrencyDollar,
  DownloadSimple,
  FileText,
  FileCsv,
  FloppyDisk,
  GearSix,
  Eye,
  List,
  MapPin,
  MagnifyingGlass,
  Key,
  PencilSimple,
  Plus,
  Prohibit,
  ShoppingBagOpen,
  ShoppingCart,
  Shield,
  SignOut,
  TrendUp,
  Truck,
  User,
  UserPlus,
  Users,
  Warning,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


import { CATALOG_PRODUCTS } from "../shared/catalogData.js";

const PRODUCT_FORM_DEFAULTS = {
  sku: "",
  isbn: "",
  title: "",
  description: "",
  authors: "",
  publisher: "Gallimard",
  category: "Roman",
  language: "Français",
  sellingPrice: "",
  purchaseCost: "",
  minimumStock: "5",
  supplier: "Sodis Maroc",
  supplierLeadTime: "7",
  active: true,
};

function productFormValues(product) {
  if (!product) return PRODUCT_FORM_DEFAULTS;
  return {
    sku: product.sku,
    isbn: "978-9920-35-184-6",
    title: product.title,
    description:
      "Roman marocain emblématique consacré à l’enfance, à la famille et à la vie quotidienne dans la médina de Fès.",
    authors: product.author,
    publisher: "Librairie des Écoles",
    category: product.category,
    language: product.language,
    sellingPrice: product.price.toFixed(2).replace(".", ","),
    purchaseCost: "49,50",
    minimumStock: String(product.threshold),
    supplier: "Sodis Maroc",
    supplierLeadTime: "8",
    active: product.active,
  };
}

function ProductFormField({
  children,
  error,
  help,
  id,
  label,
  required = false,
}) {
  return (
    <label className="product-form-field" htmlFor={id}>
      <span>
        {label}
        {required ? <strong aria-hidden="true"> *</strong> : null}
      </span>
      {children}
      {help && !error ? <small>{help}</small> : null}
      {error ? (
        <span className="product-form-error" id={`${id}-error`} role="alert">
          <WarningCircle aria-hidden="true" weight="fill" />
          {error}
        </span>
      ) : null}
    </label>
  );
}

function UnsavedChangesDialog({ onDiscard, onKeepEditing }) {
  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onKeepEditing()
      }
    >
      <section
        aria-labelledby="unsaved-title"
        aria-modal="true"
        className="catalog-modal catalog-confirm-modal unsaved-confirm-modal"
        role="alertdialog"
      >
        <span className="catalog-confirm-icon catalog-confirm-icon--warning">
          <Warning aria-hidden="true" />
        </span>
        <div>
          <h2 id="unsaved-title">Modifications non enregistrées</h2>
          <p>
            Si vous quittez cette page maintenant, les informations saisies
            seront perdues.
          </p>
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            onClick={onKeepEditing}
            type="button"
          >
            Continuer la modification
          </button>
          <button
            className="catalog-danger-button"
            onClick={onDiscard}
            type="button"
          >
            Quitter sans enregistrer
          </button>
        </footer>
      </section>
    </div>
  );
}

export function ProductEditor({ mode, onCancel, product }) {
  const [values, setValues] = useState(() => productFormValues(product));
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const isEdit = mode === "edit";

  useEffect(() => {
    const warnBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  const updateValue = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setFeedback(null);
    setIsDirty(true);
  };

  const validate = () => {
    const nextErrors = {};
    const sellingPrice = Number(values.sellingPrice.replace(",", "."));
    const purchaseCost = Number(values.purchaseCost.replace(",", "."));
    if (!values.sku.trim()) nextErrors.sku = "Le SKU est requis.";
    else if (!/^[A-Z]{3}-\d{6}$/.test(values.sku.trim()))
      nextErrors.sku = "Utilisez le format LIV-000000.";
    if (
      values.isbn &&
      !/^(?:\d[ -]?){9}[\dXx]$|^(?:\d[ -]?){13}$/.test(values.isbn.trim())
    )
      nextErrors.isbn = "Saisissez un ISBN-10 ou ISBN-13 valide.";
    if (!values.title.trim()) nextErrors.title = "Le titre est requis.";
    if (!values.authors.trim())
      nextErrors.authors = "Ajoutez au moins un auteur.";
    if (!Number.isFinite(sellingPrice) || sellingPrice <= 0)
      nextErrors.sellingPrice = "Saisissez un prix de vente supérieur à 0 MAD.";
    if (
      !values.purchaseCost.trim() ||
      !Number.isFinite(purchaseCost) ||
      purchaseCost < 0
    )
      nextErrors.purchaseCost = "Saisissez un coût d’achat valide.";
    else if (Number.isFinite(sellingPrice) && purchaseCost > sellingPrice)
      nextErrors.purchaseCost =
        "Le coût d’achat ne peut pas dépasser le prix de vente.";
    if (!/^\d+$/.test(values.minimumStock) || Number(values.minimumStock) < 0)
      nextErrors.minimumStock = "Saisissez un stock minimum positif ou nul.";
    if (
      !/^\d+$/.test(values.supplierLeadTime) ||
      Number(values.supplierLeadTime) < 1
    )
      nextErrors.supplierLeadTime = "Le délai doit être d’au moins un jour.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveProduct = (event) => {
    event.preventDefault();
    setFeedback(null);
    if (!validate()) {
      setFeedback({
        tone: "error",
        message: "Corrigez les champs signalés avant d’enregistrer.",
      });
      return;
    }
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      if (
        !isEdit &&
        CATALOG_PRODUCTS.some((item) => item.sku === values.sku.trim())
      ) {
        setErrors((current) => ({
          ...current,
          sku: "Ce SKU est déjà utilisé par un autre produit.",
        }));
        setFeedback({
          tone: "error",
          message:
            "Impossible de créer le produit. Vérifiez le SKU puis réessayez.",
        });
        return;
      }
      setIsDirty(false);
      setFeedback({
        tone: "success",
        message: isEdit
          ? "Produit mis à jour avec succès."
          : "Produit créé avec succès.",
      });
    }, 850);
  };

  const requestCancel = () =>
    isDirty ? setShowUnsavedWarning(true) : onCancel();
  const fieldProps = (key) => ({
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
    "aria-invalid": Boolean(errors[key]),
    id: key,
    onChange: (event) =>
      updateValue(
        key,
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
      ),
    value: values[key],
  });

  return (
    <div className="product-editor">
      <header className="product-editor-heading">
        <div>
          <button
            className="product-back-link"
            onClick={requestCancel}
            type="button"
          >
            <ArrowLeft aria-hidden="true" />
            Retour au catalogue
          </button>
          <h2>{isEdit ? "Modifier le produit" : "Créer un produit"}</h2>
          <p>
            {isEdit
              ? `Mettez à jour les informations de ${product.title}.`
              : "Ajoutez une nouvelle référence au catalogue Maarif Culture."}
          </p>
        </div>
        <span className="product-required-note">
          <strong>*</strong> Champs obligatoires
        </span>
      </header>

      {feedback ? (
        <div
          aria-live="polite"
          className={`product-feedback product-feedback--${feedback.tone}`}
          role={feedback.tone === "error" ? "alert" : "status"}
        >
          {feedback.tone === "success" ? (
            <CheckCircle aria-hidden="true" weight="fill" />
          ) : (
            <WarningCircle aria-hidden="true" weight="fill" />
          )}
          <span>{feedback.message}</span>
        </div>
      ) : null}

      <form className="product-editor-form" noValidate onSubmit={saveProduct}>
        <section className="product-form-section">
          <header>
            <h3>Informations générales</h3>
            <p>Identifiants et contenu bibliographique du produit.</p>
          </header>
          <div className="product-form-grid">
            <ProductFormField error={errors.sku} id="sku" label="SKU" required>
              <input {...fieldProps("sku")} placeholder="LIV-000000" />
            </ProductFormField>
            <ProductFormField
              error={errors.isbn}
              help="ISBN-10 ou ISBN-13, tirets acceptés."
              id="isbn"
              label="ISBN"
            >
              <input
                {...fieldProps("isbn")}
                inputMode="numeric"
                placeholder="978-9920-00-000-0"
              />
            </ProductFormField>
            <ProductFormField
              error={errors.title}
              id="title"
              label="Titre"
              required
            >
              <input {...fieldProps("title")} placeholder="Titre du livre" />
            </ProductFormField>
            <ProductFormField
              error={errors.authors}
              help="Séparez plusieurs auteurs par une virgule."
              id="authors"
              label="Auteurs"
              required
            >
              <input {...fieldProps("authors")} placeholder="Prénom Nom" />
            </ProductFormField>
            <ProductFormField id="description" label="Description">
              <textarea
                {...fieldProps("description")}
                placeholder="Résumé ou description commerciale du livre"
                rows="4"
              />
            </ProductFormField>
          </div>
        </section>

        <section className="product-form-section">
          <header>
            <h3>Classification</h3>
            <p>Référentiels utilisés pour la recherche et les rapports.</p>
          </header>
          <div className="product-form-grid product-form-grid--three">
            <ProductFormField id="publisher" label="Éditeur" required>
              <select {...fieldProps("publisher")}>
                <option>Gallimard</option>
                <option>Librairie des Écoles</option>
                <option>Le Seuil</option>
                <option>La Croisée des chemins</option>
              </select>
            </ProductFormField>
            <ProductFormField id="category" label="Catégorie" required>
              <select {...fieldProps("category")}>
                <option>Roman</option>
                <option>Jeunesse</option>
                <option>Scolaire</option>
                <option>Essai</option>
                <option>Référence</option>
              </select>
            </ProductFormField>
            <ProductFormField id="language" label="Langue" required>
              <select {...fieldProps("language")}>
                <option>Français</option>
                <option>Arabe</option>
                <option>Anglais</option>
              </select>
            </ProductFormField>
            <label className="product-active-field" htmlFor="active">
              <input
                checked={values.active}
                id="active"
                onChange={(event) =>
                  updateValue("active", event.target.checked)
                }
                type="checkbox"
              />
              <span>
                <strong>Produit actif</strong>
                <small>Disponible pour les nouvelles commandes.</small>
              </span>
            </label>
          </div>
        </section>

        <section className="product-form-section">
          <header>
            <h3>Tarification et stock</h3>
            <p>Montants en dirhams marocains et seuil d’alerte.</p>
          </header>
          <div className="product-form-grid product-form-grid--three">
            <ProductFormField
              error={errors.sellingPrice}
              id="sellingPrice"
              label="Prix de vente (MAD)"
              required
            >
              <input
                {...fieldProps("sellingPrice")}
                inputMode="decimal"
                placeholder="0,00"
              />
            </ProductFormField>
            <ProductFormField
              error={errors.purchaseCost}
              id="purchaseCost"
              label="Coût d’achat (MAD)"
              required
            >
              <input
                {...fieldProps("purchaseCost")}
                inputMode="decimal"
                placeholder="0,00"
              />
            </ProductFormField>
            <ProductFormField
              error={errors.minimumStock}
              help="Déclenche une alerte lorsque le stock atteint ce niveau."
              id="minimumStock"
              label="Stock minimum"
              required
            >
              <input {...fieldProps("minimumStock")} inputMode="numeric" />
            </ProductFormField>
          </div>
        </section>

        <section className="product-form-section">
          <header>
            <h3>Approvisionnement</h3>
            <p>Fournisseur principal et délai habituel.</p>
          </header>
          <div className="product-form-grid">
            <ProductFormField id="supplier" label="Fournisseur" required>
              <select {...fieldProps("supplier")}>
                <option>Sodis Maroc</option>
                <option>Distribution Livre Maroc</option>
                <option>Al Madariss Distribution</option>
              </select>
            </ProductFormField>
            <ProductFormField
              error={errors.supplierLeadTime}
              help="Nombre de jours calendaires."
              id="supplierLeadTime"
              label="Délai fournisseur (jours)"
              required
            >
              <input {...fieldProps("supplierLeadTime")} inputMode="numeric" />
            </ProductFormField>
          </div>
        </section>

        <footer className="product-editor-actions">
          <button
            className="catalog-secondary-button"
            onClick={requestCancel}
            type="button"
          >
            Annuler
          </button>
          <button
            className="catalog-primary-button"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? (
              <CircleNotch aria-hidden="true" className="spinner" />
            ) : (
              <FloppyDisk aria-hidden="true" />
            )}
            {isSaving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </footer>
      </form>

      {showUnsavedWarning ? (
        <UnsavedChangesDialog
          onDiscard={onCancel}
          onKeepEditing={() => setShowUnsavedWarning(false)}
        />
      ) : null}
    </div>
  );
}


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


export function ProductStatus({ active, stock, threshold }) {
  if (!active)
    return (
      <span className="catalog-status catalog-status--inactive">Désactivé</span>
    );
  if (stock === 0)
    return <span className="catalog-status catalog-status--out">Rupture</span>;
  if (stock <= threshold)
    return (
      <span className="catalog-status catalog-status--low">Stock faible</span>
    );
  return <span className="catalog-status catalog-status--active">Actif</span>;
}


export function DisableProductDialog({ onCancel, onConfirm, product }) {
  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onCancel()
      }
    >
      <section
        aria-labelledby="disable-product-title"
        aria-modal="true"
        className="catalog-modal catalog-confirm-modal"
        role="alertdialog"
      >
        <span className="catalog-confirm-icon">
          <Prohibit aria-hidden="true" />
        </span>
        <div>
          <h2 id="disable-product-title">Désactiver ce produit ?</h2>
          <p>
            <strong>{product.title}</strong> ne pourra plus être utilisé dans de
            nouvelles commandes. Son historique sera conservé.
          </p>
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            onClick={onCancel}
            type="button"
          >
            Annuler
          </button>
          <button
            className="catalog-danger-button"
            onClick={onConfirm}
            type="button"
          >
            Désactiver
          </button>
        </footer>
      </section>
    </div>
  );
}

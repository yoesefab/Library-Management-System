import {
  Archive,
  Bell,
  BookOpen,
  ChartBar,
  CloudArrowUp,
  FileText,
  List,
  ShoppingCart,
  SignOut,
  TrendUp,
  Users,
} from "@phosphor-icons/react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/auth-context";
import type { UserRole } from "../../types/api";
import { statusLabel } from "../../utils/format";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const navItems: Array<{
  to: string;
  label: string;
  icon: typeof ChartBar;
  roles: UserRole[];
}> = [
  {
    to: "/dashboard",
    label: "Tableau de bord",
    icon: ChartBar,
    roles: ["ADMINISTRATOR", "MANAGER"],
  },
  {
    to: "/products",
    label: "Produits",
    icon: BookOpen,
    roles: ["ADMINISTRATOR", "MANAGER", "STOCK_EMPLOYEE"],
  },
  {
    to: "/inventory",
    label: "Inventaire",
    icon: Archive,
    roles: ["ADMINISTRATOR", "MANAGER", "STOCK_EMPLOYEE"],
  },
  {
    to: "/orders",
    label: "Commandes",
    icon: ShoppingCart,
    roles: ["ADMINISTRATOR", "MANAGER"],
  },
  {
    to: "/imports",
    label: "Imports",
    icon: CloudArrowUp,
    roles: ["ADMINISTRATOR", "MANAGER"],
  },
  {
    to: "/alerts",
    label: "Alertes",
    icon: Bell,
    roles: ["ADMINISTRATOR", "MANAGER", "STOCK_EMPLOYEE"],
  },
  {
    to: "/forecasting",
    label: "Prévisions",
    icon: TrendUp,
    roles: ["ADMINISTRATOR", "MANAGER"],
  },
  {
    to: "/reports",
    label: "Rapports",
    icon: FileText,
    roles: ["ADMINISTRATOR", "MANAGER"],
  },
  {
    to: "/administration/users",
    label: "Administration",
    icon: Users,
    roles: ["ADMINISTRATOR"],
  },
];

const titles: Record<string, string> = {
  dashboard: "Tableau de bord",
  products: "Produits",
  inventory: "Inventaire",
  orders: "Commandes",
  imports: "Imports",
  alerts: "Alertes de stock",
  forecasting: "Prévisions",
  reports: "Rapports",
  administration: "Administration",
  unauthorized: "Accès non autorisé",
};

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const segment = location.pathname.split("/")[1] || "dashboard";
  const detailTitle = location.pathname.endsWith("/new")
    ? "Créer un produit"
    : location.pathname.endsWith("/edit")
      ? "Modifier un produit"
      : /^\/(products|orders|imports)\/\d+$/.test(location.pathname)
        ? `Détails ${segment === "products" ? "du produit" : segment === "orders" ? "de la commande" : "de l’import"}`
        : (titles[segment] ?? "Page introuvable");
  if (!user) return null;
  return (
    <main
      className={`authenticated-shell${expanded ? " is-sidebar-expanded" : ""}`}
    >
      <aside aria-label="Navigation principale" className="app-sidebar">
        <div className="app-sidebar-header">
          <button
            aria-expanded={expanded}
            aria-label={
              expanded ? "Réduire la navigation" : "Développer la navigation"
            }
            className="sidebar-toggle"
            onClick={() => setExpanded((value) => !value)}
            type="button"
          >
            <List aria-hidden="true" />
          </button>
          <NavLink
            aria-label="Maarif Analytics — Tableau de bord"
            className="app-brand"
            to={user.role === "STOCK_EMPLOYEE" ? "/inventory" : "/dashboard"}
          >
            <BookOpen
              aria-hidden="true"
              className="app-brand-icon"
              weight="fill"
            />
            <span className="app-brand-name">
              <strong>Maarif</strong> Analytics
            </span>
          </NavLink>
        </div>
        <TooltipProvider delayDuration={250}>
          <nav className="sidebar-nav">
            {navItems
              .filter((item) => item.roles.includes(user.role))
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Tooltip key={item.to}>
                    <TooltipTrigger asChild>
                      <NavLink
                        className={({ isActive }) =>
                          `sidebar-link${isActive ? " is-active" : ""}`
                        }
                        onClick={() => setExpanded(false)}
                        to={item.to}
                      >
                        <Icon aria-hidden="true" />
                        <span className="sidebar-link-label">{item.label}</span>
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              })}
          </nav>
        </TooltipProvider>
      </aside>
      <div className="app-workspace">
        <header className="top-navigation">
          <h1>{detailTitle}</h1>
          <div className="top-navigation-actions">
            <button
              aria-label="Ouvrir les alertes"
              className="alert-indicator"
              onClick={() => navigate("/alerts")}
              type="button"
            >
              <Bell aria-hidden="true" />
            </button>
            <div aria-label="Utilisateur actuel" className="current-user">
              <span className="current-user-name">{user.fullName}</span>
              <span className="current-user-role">
                {statusLabel(user.role)}
              </span>
            </div>
            <button
              className="logout-action"
              onClick={() =>
                void logout().then(() => navigate("/login", { replace: true }))
              }
              type="button"
            >
              <SignOut aria-hidden="true" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </header>
        <div
          className={`app-content${segment === "dashboard" ? " app-content--dashboard" : " app-content--catalog"}`}
        >
          <Outlet />
        </div>
      </div>
    </main>
  );
}

import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/navigation/ProtectedRoute";
import { LoginPage } from "../pages/LoginPage";
import { SystemPage } from "../pages/SystemPage";

const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);
const AlertsPage = lazy(() =>
  import("../pages/AlertsPage").then((module) => ({
    default: module.AlertsPage,
  })),
);
const ForecastingPage = lazy(() =>
  import("../pages/ForecastingPage").then((module) => ({
    default: module.ForecastingPage,
  })),
);
const InventoryPage = lazy(() =>
  import("../pages/InventoryPage").then((module) => ({
    default: module.InventoryPage,
  })),
);
const ReportsPage = lazy(() =>
  import("../pages/ReportsPage").then((module) => ({
    default: module.ReportsPage,
  })),
);
const AuditPage = lazy(() =>
  import("../pages/administration/AuditPage").then((module) => ({
    default: module.AuditPage,
  })),
);
const SettingsPage = lazy(() =>
  import("../pages/administration/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);
const UsersPage = lazy(() =>
  import("../pages/administration/UsersPage").then((module) => ({
    default: module.UsersPage,
  })),
);
const ImportDetailsPage = lazy(() =>
  import("../pages/imports/ImportDetailsPage").then((module) => ({
    default: module.ImportDetailsPage,
  })),
);
const ImportsPage = lazy(() =>
  import("../pages/imports/ImportsPage").then((module) => ({
    default: module.ImportsPage,
  })),
);
const OrderDetailsPage = lazy(() =>
  import("../pages/orders/OrderDetailsPage").then((module) => ({
    default: module.OrderDetailsPage,
  })),
);
const OrdersPage = lazy(() =>
  import("../pages/orders/OrdersPage").then((module) => ({
    default: module.OrdersPage,
  })),
);
const ProductDetailsPage = lazy(() =>
  import("../pages/products/ProductDetailsPage").then((module) => ({
    default: module.ProductDetailsPage,
  })),
);
const ProductFormPage = lazy(() =>
  import("../pages/products/ProductFormPage").then((module) => ({
    default: module.ProductFormPage,
  })),
);
const ProductListPage = lazy(() =>
  import("../pages/products/ProductListPage").then((module) => ({
    default: module.ProductListPage,
  })),
);

const management = ["ADMINISTRATOR", "MANAGER"] as const;
const inventory = ["ADMINISTRATOR", "MANAGER", "STOCK_EMPLOYEE"] as const;

export const createAppRouter = () =>
  createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            {
              element: <ProtectedRoute roles={[...management]} />,
              children: [
                { path: "/dashboard", element: <DashboardPage /> },
                { path: "/orders", element: <OrdersPage /> },
                { path: "/orders/:id", element: <OrderDetailsPage /> },
                { path: "/imports", element: <ImportsPage /> },
                { path: "/imports/:id", element: <ImportDetailsPage /> },
                { path: "/forecasting", element: <ForecastingPage /> },
                { path: "/reports", element: <ReportsPage /> },
              ],
            },
            {
              element: <ProtectedRoute roles={[...inventory]} />,
              children: [
                { path: "/products", element: <ProductListPage /> },
                { path: "/products/:id", element: <ProductDetailsPage /> },
                { path: "/inventory", element: <InventoryPage /> },
                { path: "/alerts", element: <AlertsPage /> },
              ],
            },
            {
              element: <ProtectedRoute roles={[...management]} />,
              children: [
                {
                  path: "/products/new",
                  element: <ProductFormPage mode="create" />,
                },
                {
                  path: "/products/:id/edit",
                  element: <ProductFormPage mode="edit" />,
                },
              ],
            },
            {
              element: <ProtectedRoute roles={["ADMINISTRATOR"]} />,
              children: [
                { path: "/administration/users", element: <UsersPage /> },
                { path: "/administration/settings", element: <SettingsPage /> },
                { path: "/administration/audit", element: <AuditPage /> },
              ],
            },
            {
              path: "/unauthorized",
              element: <SystemPage type="unauthorized" />,
            },
            { path: "*", element: <SystemPage type="not-found" /> },
          ],
        },
      ],
    },
  ]);

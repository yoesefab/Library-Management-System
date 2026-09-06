import { useEffect, useId, useState } from 'react'
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
  TrendUp,
  Truck,
  User,
  UserPlus,
  Users,
  Warning,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
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
} from 'recharts'
import { ProfileMenu } from '../shared/ProfileMenu.jsx'
import { CATALOG_PRODUCTS } from '../shared/catalogData.js'
import { ORDERS } from '../shared/orderData.jsx'
import { AdministrationPage } from './AdministrationPage.jsx'
import { DashboardContent } from './DashboardPage.jsx'
import { ForecastingPage } from './ForecastingPage.jsx'
import { ImportHistoryPage } from './ImportHistoryPage.jsx'
import { InventoryManagement } from './InventoryPage.jsx'
import { OrderDetailsPage } from './OrderDetailsPage.jsx'
import { OrdersManagement } from './OrdersPage.jsx'
import { ProductCatalog } from './ProductCatalogPage.jsx'
import { ProductDetails } from './ProductDetailsPage.jsx'
import { ProductEditor } from './ProductEditorPage.jsx'
import { ReportsPage } from './ReportsPage.jsx'
import { SalesImportPage } from './SalesImportPage.jsx'
import { StockAlertsPage } from './StockAlertsPage.jsx'
import { SystemStatePage } from './SystemStatePage.jsx'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: ChartBar },
  { id: 'products', label: 'Produits', icon: BookOpen },
  { id: 'inventory', label: 'Inventaire', icon: Archive },
  { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  { id: 'imports', label: 'Imports', icon: CloudArrowUp },
  { id: 'alerts', label: 'Alertes', icon: Bell },
  { id: 'forecasting', label: 'Prévisions', icon: TrendUp },
  { id: 'reports', label: 'Rapports', icon: FileText },
  { id: 'administration', label: 'Administration', icon: GearSix },
]

const KNOWN_APP_ROUTES = [
  /^\/app\/?$/,
  /^\/app\/(dashboard|inventory|alerts|forecasting|reports|administration)\/?$/,
  /^\/app\/products(?:\/new|\/[^/]+(?:\/edit)?)?\/?$/,
  /^\/app\/orders(?:\/[^/]+)?\/?$/,
  /^\/app\/imports(?:\/history)?\/?$/,
]

function resolveAuthenticatedPage(pathname) {
  if (pathname === '/app/unauthorized') return 'Accès non autorisé'
  if (
    pathname === '/app/not-found' ||
    !KNOWN_APP_ROUTES.some((pattern) => pattern.test(pathname))
  )
    return 'Page introuvable'
  if (pathname.startsWith('/app/products')) return 'Produits'
  if (pathname.startsWith('/app/orders')) return 'Commandes'
  if (pathname.startsWith('/app/imports')) return 'Imports'
  return (
    NAV_ITEMS.find((item) => pathname.endsWith(`/${item.id}`))?.label ??
    'Tableau de bord'
  )
}

export function AuthenticatedLayout({ onLogout }) {
  const pageFromPath = () => resolveAuthenticatedPage(window.location.pathname)
  const [activePage, setActivePage] = useState(pageFromPath)
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  useEffect(() => {
    document.title = `${activePage} — Maarif Analytics`
  }, [activePage])

  useEffect(() => {
    const syncPageWithHistory = () => {
      setActivePage(pageFromPath())
      setCurrentRoute(window.location.pathname)
    }
    window.addEventListener('popstate', syncPageWithHistory)
    return () => window.removeEventListener('popstate', syncPageWithHistory)
  }, [])

  const selectPage = (label) => {
    setActivePage(label)
    setSidebarExpanded(false)
    const item = NAV_ITEMS.find((candidate) => candidate.label === label)
    const nextRoute =
      item?.id === 'dashboard' ? '/app' : `/app/${item?.id ?? ''}`
    window.history.pushState({}, '', nextRoute)
    setCurrentRoute(nextRoute)
  }

  const navigateWithinProducts = (route) => {
    window.history.pushState({}, '', route)
    setCurrentRoute(route)
    setActivePage('Produits')
  }

  const navigateWithinOrders = (route) => {
    window.history.pushState({}, '', route)
    setCurrentRoute(route)
    setActivePage('Commandes')
  }

  const navigateWithinImports = (route) => {
    window.history.pushState({}, '', route)
    setCurrentRoute(route)
    setActivePage('Imports')
  }

  const isCreateProduct = currentRoute === '/app/products/new'
  const editSku = currentRoute.match(/^\/app\/products\/([^/]+)\/edit$/)?.[1]
  const detailSku = !isCreateProduct
    ? currentRoute.match(/^\/app\/products\/([^/]+)$/)?.[1]
    : null
  const editedProduct =
    CATALOG_PRODUCTS.find((item) => item.sku === editSku) ?? CATALOG_PRODUCTS[0]
  const detailedProduct =
    CATALOG_PRODUCTS.find((item) => item.sku === detailSku) ??
    CATALOG_PRODUCTS[0]
  const detailOrderReference = currentRoute.match(
    /^\/app\/orders\/([^/]+)$/
  )?.[1]
  const detailedOrder =
    ORDERS.find((item) => item.reference === detailOrderReference) ?? ORDERS[1]
  const isImportHistory = currentRoute === '/app/imports/history'
  const isUnauthorized = currentRoute === '/app/unauthorized'
  const isNotFound = activePage === 'Page introuvable'
  const topTitle = isUnauthorized
    ? 'Accès non autorisé'
    : isNotFound
      ? 'Page introuvable'
      : isCreateProduct
        ? 'Créer un produit'
        : editSku
          ? 'Modifier un produit'
          : detailSku
            ? 'Détails du produit'
            : detailOrderReference
              ? 'Détails de la commande'
              : isImportHistory
                ? 'Historique des imports'
                : activePage === 'Alertes'
                  ? 'Alertes de stock'
                  : activePage

  return (
    <main
      className={`authenticated-shell${sidebarExpanded ? ' is-sidebar-expanded' : ''}`}
    >
      <aside aria-label='Navigation principale' className='app-sidebar'>
        <div className='app-sidebar-header'>
          <button
            aria-expanded={sidebarExpanded}
            aria-label={
              sidebarExpanded
                ? 'Réduire la navigation'
                : 'Développer la navigation'
            }
            className='sidebar-toggle'
            onClick={() => setSidebarExpanded((current) => !current)}
            type='button'
          >
            <List aria-hidden='true' />
          </button>
          <a
            aria-label='Maarif Analytics — Tableau de bord'
            className='app-brand'
            href='#dashboard'
            onClick={(event) => {
              event.preventDefault()
              selectPage('Tableau de bord')
            }}
          >
            <BookOpen
              aria-hidden='true'
              className='app-brand-icon'
              weight='fill'
            />
            <span className='app-brand-name'>
              <strong>Maarif</strong> Analytics
            </span>
          </a>
        </div>

        <nav className='sidebar-nav'>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activePage === item.label
            return (
              <a
                aria-current={active ? 'page' : undefined}
                className={`sidebar-link${active ? ' is-active' : ''}`}
                href={`#${item.id}`}
                key={item.id}
                onClick={(event) => {
                  event.preventDefault()
                  selectPage(item.label)
                }}
                title={item.label}
              >
                <Icon aria-hidden='true' weight={active ? 'fill' : 'regular'} />
                <span className='sidebar-link-label'>{item.label}</span>
              </a>
            )
          })}
        </nav>
      </aside>

      <div className='app-workspace'>
        <header className='top-navigation'>
          <h1>{topTitle}</h1>
          <div className='top-navigation-actions'>
            <button
              aria-label='3 alertes — Ouvrir les alertes'
              className='alert-indicator'
              onClick={() => selectPage('Alertes')}
              type='button'
            >
              <Bell aria-hidden='true' />
              <span aria-hidden='true' className='alert-count'>
                3
              </span>
            </button>

            <ProfileMenu
              onLogout={onLogout}
              onNavigate={selectPage}
              role={
                activePage === 'Administration'
                  ? 'Administratrice'
                  : 'Gestionnaire'
              }
            />
          </div>
        </header>

        <div
          className={`app-content${activePage === 'Tableau de bord' ? ' app-content--dashboard' : ''}${activePage === 'Produits' || activePage === 'Inventaire' || activePage === 'Commandes' || activePage === 'Imports' || activePage === 'Alertes' || activePage === 'Prévisions' || activePage === 'Rapports' || activePage === 'Administration' ? ' app-content--catalog' : ''}${isUnauthorized || isNotFound ? ' app-content--system-state' : ''}`}
        >
          {isUnauthorized ? (
            <SystemStatePage
              onNavigate={() => selectPage('Produits')}
              type='unauthorized'
            />
          ) : isNotFound ? (
            <SystemStatePage
              onNavigate={() => selectPage('Tableau de bord')}
              type='not-found'
            />
          ) : activePage === 'Tableau de bord' ? (
            <DashboardContent
              onNavigateProducts={() => selectPage('Produits')}
            />
          ) : activePage === 'Produits' && (isCreateProduct || editSku) ? (
            <ProductEditor
              mode={isCreateProduct ? 'create' : 'edit'}
              onCancel={() => navigateWithinProducts('/app/products')}
              product={isCreateProduct ? null : editedProduct}
            />
          ) : activePage === 'Produits' && detailSku ? (
            <ProductDetails
              onBack={() => navigateWithinProducts('/app/products')}
              onEdit={(product) =>
                navigateWithinProducts(`/app/products/${product.sku}/edit`)
              }
              product={detailedProduct}
            />
          ) : activePage === 'Produits' ? (
            <ProductCatalog
              onCreate={() => navigateWithinProducts('/app/products/new')}
              onEdit={(product) =>
                navigateWithinProducts(`/app/products/${product.sku}/edit`)
              }
              onView={(product) =>
                navigateWithinProducts(`/app/products/${product.sku}`)
              }
            />
          ) : activePage === 'Inventaire' ? (
            <InventoryManagement />
          ) : activePage === 'Commandes' && detailOrderReference ? (
            <OrderDetailsPage
              onBack={() => navigateWithinOrders('/app/orders')}
              order={detailedOrder}
            />
          ) : activePage === 'Commandes' ? (
            <OrdersManagement
              onView={(order) =>
                navigateWithinOrders(`/app/orders/${order.reference}`)
              }
            />
          ) : activePage === 'Imports' && isImportHistory ? (
            <ImportHistoryPage />
          ) : activePage === 'Imports' ? (
            <SalesImportPage
              onOpenHistory={() =>
                navigateWithinImports('/app/imports/history')
              }
            />
          ) : activePage === 'Alertes' ? (
            <StockAlertsPage />
          ) : activePage === 'Prévisions' ? (
            <ForecastingPage />
          ) : activePage === 'Rapports' ? (
            <ReportsPage />
          ) : activePage === 'Administration' ? (
            <AdministrationPage />
          ) : (
            <section aria-label={activePage} className='section-stage' />
          )}
        </div>
      </div>
    </main>
  )
}

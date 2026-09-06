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
  SignOut,
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
import {
  DisableProductDialog,
  ProductStatus,
} from '../shared/ProductComponents.jsx'
import {
  CATALOG_PERMISSIONS,
  CATALOG_PRODUCTS,
  formatMad,
} from '../shared/catalogData.js'

function CatalogDialog({ mode, onClose, product }) {
  const isView = mode === 'view'
  const isCreate = mode === 'create'

  return (
    <div
      className='catalog-modal-backdrop'
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        aria-labelledby='catalog-dialog-title'
        aria-modal='true'
        className='catalog-modal'
        role='dialog'
      >
        <header>
          <div>
            <p>{isCreate ? 'Nouveau produit' : product?.sku}</p>
            <h2 id='catalog-dialog-title'>
              {isCreate
                ? 'Créer un produit'
                : isView
                  ? 'Détails du produit'
                  : 'Modifier le produit'}
            </h2>
          </div>
          <button
            aria-label='Fermer'
            className='catalog-icon-button'
            onClick={onClose}
            type='button'
          >
            <X aria-hidden='true' />
          </button>
        </header>
        <div className='catalog-form-grid'>
          <label>
            <span>SKU</span>
            <input defaultValue={product?.sku ?? 'LIV-'} disabled={isView} />
          </label>
          <label className='catalog-form-field--wide'>
            <span>Titre</span>
            <input defaultValue={product?.title ?? ''} disabled={isView} />
          </label>
          <label className='catalog-form-field--wide'>
            <span>Auteur</span>
            <input defaultValue={product?.author ?? ''} disabled={isView} />
          </label>
          <label>
            <span>Catégorie</span>
            <select
              defaultValue={product?.category ?? 'Roman'}
              disabled={isView}
            >
              <option>Roman</option>
              <option>Jeunesse</option>
              <option>Scolaire</option>
              <option>Essai</option>
              <option>Référence</option>
            </select>
          </label>
          <label>
            <span>Langue</span>
            <select
              defaultValue={product?.language ?? 'Français'}
              disabled={isView}
            >
              <option>Français</option>
              <option>Arabe</option>
              <option>Anglais</option>
            </select>
          </label>
          <label>
            <span>Prix (MAD)</span>
            <input
              defaultValue={product?.price?.toFixed(2) ?? '0,00'}
              disabled={isView}
              inputMode='decimal'
            />
          </label>
          <label>
            <span>Seuil d’alerte</span>
            <input
              defaultValue={product?.threshold ?? 5}
              disabled={isView}
              inputMode='numeric'
            />
          </label>
        </div>
        <footer>
          <button
            className='catalog-secondary-button'
            onClick={onClose}
            type='button'
          >
            {isView ? 'Fermer' : 'Annuler'}
          </button>
          {!isView ? (
            <button
              className='catalog-primary-button'
              onClick={onClose}
              type='button'
            >
              {isCreate ? 'Créer le produit' : 'Enregistrer'}
            </button>
          ) : null}
        </footer>
      </section>
    </div>
  )
}

export function ProductCatalog({
  onCreate,
  onEdit,
  onView,
  role = 'Gestionnaire',
}) {
  const permissions = CATALOG_PERMISSIONS[role]
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Toutes')
  const [language, setLanguage] = useState('Toutes')
  const [activeStatus, setActiveStatus] = useState('Tous')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [disabledSkus, setDisabledSkus] = useState([])
  const [dialog, setDialog] = useState(null)
  const pageSize = 7

  const products = CATALOG_PRODUCTS.map((product) =>
    disabledSkus.includes(product.sku) ? { ...product, active: false } : product
  )
  const filtered = products.filter((product) => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    const matchesQuery =
      !normalizedQuery ||
      [product.sku, product.title, product.author].some((value) =>
        value.toLocaleLowerCase('fr').includes(normalizedQuery)
      )
    const matchesCategory =
      category === 'Toutes' || product.category === category
    const matchesLanguage =
      language === 'Toutes' || product.language === language
    const matchesStatus =
      activeStatus === 'Tous' ||
      (activeStatus === 'Actifs' ? product.active : !product.active)
    return matchesQuery && matchesCategory && matchesLanguage && matchesStatus
  })
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleProducts = filtered.slice((page - 1) * pageSize, page * pageSize)

  const runServerRequest = (callback) => {
    setIsLoading(true)
    window.setTimeout(() => {
      callback()
      setIsLoading(false)
    }, 450)
  }

  const submitSearch = (event) => {
    event.preventDefault()
    runServerRequest(() => {
      setQuery(queryInput)
      setPage(1)
    })
  }

  const updateFilter = (setter, value) => {
    runServerRequest(() => {
      setter(value)
      setPage(1)
    })
  }

  return (
    <div className='product-catalog'>
      <section
        className='catalog-toolbar'
        aria-label='Recherche et filtres du catalogue'
      >
        <form className='catalog-search' onSubmit={submitSearch} role='search'>
          <MagnifyingGlass aria-hidden='true' />
          <label className='sr-only' htmlFor='catalog-search'>
            Rechercher un produit
          </label>
          <input
            id='catalog-search'
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder='Rechercher par SKU, titre ou auteur'
            type='search'
            value={queryInput}
          />
          <button disabled={isLoading} type='submit'>
            Rechercher
          </button>
        </form>
        <div className='catalog-filters'>
          <label>
            <span>Catégorie</span>
            <select
              aria-label='Filtrer par catégorie'
              onChange={(event) =>
                updateFilter(setCategory, event.target.value)
              }
              value={category}
            >
              <option>Toutes</option>
              <option>Roman</option>
              <option>Jeunesse</option>
              <option>Scolaire</option>
              <option>Essai</option>
              <option>Référence</option>
            </select>
            <CaretDown aria-hidden='true' />
          </label>
          <label>
            <span>Langue</span>
            <select
              aria-label='Filtrer par langue'
              onChange={(event) =>
                updateFilter(setLanguage, event.target.value)
              }
              value={language}
            >
              <option>Toutes</option>
              <option>Français</option>
              <option>Arabe</option>
              <option>Anglais</option>
            </select>
            <CaretDown aria-hidden='true' />
          </label>
          <label>
            <span>Statut</span>
            <select
              aria-label='Filtrer par statut actif'
              onChange={(event) =>
                updateFilter(setActiveStatus, event.target.value)
              }
              value={activeStatus}
            >
              <option>Tous</option>
              <option>Actifs</option>
              <option>Désactivés</option>
            </select>
            <CaretDown aria-hidden='true' />
          </label>
        </div>
        {permissions.create ? (
          <button
            className='catalog-create-button'
            onClick={onCreate}
            type='button'
          >
            <Plus aria-hidden='true' />
            Créer un produit
          </button>
        ) : null}
      </section>

      <section aria-labelledby='catalog-table-title' className='catalog-panel'>
        <div className='catalog-panel-header'>
          <div>
            <h2 id='catalog-table-title'>Catalogue produits</h2>
            <p aria-live='polite'>
              {isLoading
                ? 'Chargement des produits…'
                : `${filtered.length} produit${filtered.length > 1 ? 's' : ''} trouvé${filtered.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <span>Dernière actualisation : 27 août 2026 à 18:32</span>
        </div>

        <div className='catalog-table-scroll'>
          <table>
            <thead>
              <tr>
                <th scope='col'>SKU</th>
                <th scope='col'>Titre</th>
                <th scope='col'>Auteur</th>
                <th scope='col'>Catégorie</th>
                <th scope='col'>Langue</th>
                <th scope='col'>Prix</th>
                <th scope='col'>Stock actuel</th>
                <th scope='col'>Seuil</th>
                <th scope='col'>Statut</th>
                <th scope='col'>
                  <span className='sr-only'>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody aria-busy={isLoading}>
              {isLoading
                ? Array.from({ length: 7 }, (_, index) => (
                    <tr className='catalog-skeleton-row' key={index}>
                      {Array.from({ length: 10 }, (__, cell) => (
                        <td key={cell}>
                          <span />
                        </td>
                      ))}
                    </tr>
                  ))
                : null}
              {!isLoading &&
                visibleProducts.map((product) => (
                  <tr key={product.sku}>
                    <td className='catalog-sku'>{product.sku}</td>
                    <td
                      className='catalog-title'
                      lang={product.language === 'Arabe' ? 'ar' : undefined}
                      dir={product.language === 'Arabe' ? 'rtl' : undefined}
                    >
                      {product.title}
                    </td>
                    <td>{product.author}</td>
                    <td>{product.category}</td>
                    <td>{product.language}</td>
                    <td className='catalog-number'>
                      {formatMad(product.price)}
                    </td>
                    <td
                      className={`catalog-number${product.stock <= product.threshold ? ' is-stock-risk' : ''}`}
                    >
                      {product.stock}
                    </td>
                    <td className='catalog-number'>{product.threshold}</td>
                    <td>
                      <ProductStatus
                        active={product.active}
                        stock={product.stock}
                        threshold={product.threshold}
                      />
                    </td>
                    <td>
                      <div className='catalog-row-actions'>
                        {permissions.view ? (
                          <button
                            aria-label={`Voir ${product.title}`}
                            className='catalog-icon-button'
                            onClick={() => onView(product)}
                            title='Voir'
                            type='button'
                          >
                            <Eye aria-hidden='true' />
                          </button>
                        ) : null}
                        {permissions.edit && product.active ? (
                          <button
                            aria-label={`Modifier ${product.title}`}
                            className='catalog-icon-button'
                            onClick={() => onEdit(product)}
                            title='Modifier'
                            type='button'
                          >
                            <PencilSimple aria-hidden='true' />
                          </button>
                        ) : null}
                        {permissions.disable && product.active ? (
                          <button
                            aria-label={`Désactiver ${product.title}`}
                            className='catalog-icon-button catalog-icon-button--danger'
                            onClick={() =>
                              setDialog({ mode: 'disable', product })
                            }
                            title='Désactiver'
                            type='button'
                          >
                            <Prohibit aria-hidden='true' />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!isLoading && visibleProducts.length === 0 ? (
            <div className='catalog-empty'>
              <Books aria-hidden='true' />
              <h3>Aucun produit trouvé</h3>
              <p>
                Modifiez la recherche ou les filtres pour afficher des produits.
              </p>
            </div>
          ) : null}
        </div>

        <footer className='catalog-pagination'>
          <p>
            Affichage de {filtered.length ? (page - 1) * pageSize + 1 : 0} à{' '}
            {Math.min(page * pageSize, filtered.length)} sur {filtered.length}
          </p>
          <nav aria-label='Pagination du catalogue'>
            <button
              disabled={page === 1 || isLoading}
              onClick={() =>
                runServerRequest(() => setPage((current) => current - 1))
              }
              type='button'
            >
              Précédent
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  aria-current={page === pageNumber ? 'page' : undefined}
                  className={page === pageNumber ? 'is-current' : ''}
                  disabled={isLoading}
                  key={pageNumber}
                  onClick={() => runServerRequest(() => setPage(pageNumber))}
                  type='button'
                >
                  {pageNumber}
                </button>
              )
            )}
            <button
              disabled={page === pageCount || isLoading}
              onClick={() =>
                runServerRequest(() => setPage((current) => current + 1))
              }
              type='button'
            >
              Suivant
            </button>
          </nav>
        </footer>
      </section>

      {dialog?.mode === 'disable' ? (
        <DisableProductDialog
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            setDisabledSkus((current) => [...current, dialog.product.sku])
            setDialog(null)
          }}
          product={dialog.product}
        />
      ) : null}
    </div>
  )
}

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
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { RecordsTable } from '@/features/maarif/records-table'
import {
  DisableProductDialog,
  ProductStatus,
} from '../shared/ProductComponents.jsx'
import { CATALOG_PERMISSIONS } from '../shared/catalogData.js'

const RECENT_SALES = [
  ['25–27 août 2026', '38', '2 964,00 MAD'],
  ['18–24 août 2026', '74', '5 772,00 MAD'],
  ['11–17 août 2026', '81', '6 318,00 MAD'],
  ['04–10 août 2026', '69', '5 382,00 MAD'],
  ['01–03 août 2026', '50', '3 900,00 MAD'],
]

const INVENTORY_MOVEMENTS = [
  {
    date: '27 août 2026 à 16:42',
    label: 'Vente — CMD-2026-1842',
    quantity: '−2',
    balance: '42',
    tone: 'out',
  },
  {
    date: '27 août 2026 à 11:08',
    label: 'Vente — CMD-2026-1834',
    quantity: '−1',
    balance: '44',
    tone: 'out',
  },
  {
    date: '26 août 2026 à 15:20',
    label: 'Réception fournisseur — REC-2026-0318',
    quantity: '+24',
    balance: '45',
    tone: 'in',
  },
  {
    date: '26 août 2026 à 09:14',
    label: 'Vente — CMD-2026-1807',
    quantity: '−3',
    balance: '21',
    tone: 'out',
  },
  {
    date: '25 août 2026 à 18:06',
    label: 'Ajustement après inventaire',
    quantity: '+1',
    balance: '24',
    tone: 'in',
  },
]

export function ProductDetails({
  onBack,
  onDisable,
  onEdit,
  product,
  role = 'Gestionnaire',
}) {
  const permissions = CATALOG_PERMISSIONS[role]
  const [active, setActive] = useState(product.active)
  const [showDisableDialog, setShowDisableDialog] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const disableProduct = async () => {
    await onDisable?.(product.sku)
    setActive(false)
    setShowDisableDialog(false)
    setFeedback('Produit désactivé avec succès.')
  }

  return (
    <div className='product-details'>
      <header className='product-detail-heading'>
        <div>
          <button className='product-back-link' onClick={onBack} type='button'>
            <ArrowLeft aria-hidden='true' />
            Retour au catalogue
          </button>
          <div className='product-detail-title-row'>
            <div>
              <p>
                {product.sku} · ISBN {product.isbn ?? '—'}
              </p>
              <h2>{product.title}</h2>
              <span>
                {product.author} · {product.publisher ?? '—'}
              </span>
            </div>
            <ProductStatus
              active={active}
              stock={product.stock}
              threshold={product.threshold}
            />
          </div>
        </div>
        <div className='product-detail-actions'>
          {permissions.edit && active ? (
            <button
              className='catalog-secondary-button'
              onClick={() => onEdit(product)}
              type='button'
            >
              <PencilSimple aria-hidden='true' />
              Modifier
            </button>
          ) : null}
          {permissions.disable && active ? (
            <button
              className='product-disable-button'
              onClick={() => setShowDisableDialog(true)}
              type='button'
            >
              <Prohibit aria-hidden='true' />
              Désactiver
            </button>
          ) : null}
        </div>
      </header>

      {feedback ? (
        <div
          className='product-feedback product-feedback--success'
          role='status'
        >
          <CheckCircle aria-hidden='true' weight='fill' />
          <span>{feedback}</span>
        </div>
      ) : null}

      <section
        aria-label='Indicateurs du produit'
        className='product-detail-kpis'
      >
        <article>
          <CurrencyDollar aria-hidden='true' />
          <span>Prix de vente</span>
          <strong>
            {Number(product.price).toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            MAD
          </strong>
          <small>
            Marge brute :{' '}
            {Number(product.price - (product.purchaseCost ?? 0)).toLocaleString(
              'fr-FR',
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}{' '}
            MAD
          </small>
        </article>
        <article>
          <ShoppingCart aria-hidden='true' />
          <span>Coût d’achat</span>
          <strong>
            {Number(product.purchaseCost ?? 0).toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            MAD
          </strong>
          <small>
            Marge :{' '}
            {product.price
              ? (
                  ((product.price - (product.purchaseCost ?? 0)) /
                    product.price) *
                  100
                ).toLocaleString('fr-FR', { maximumFractionDigits: 1 })
              : '0'}{' '}
            %
          </small>
        </article>
        <article
          className={product.stock <= product.threshold ? 'is-alert' : ''}
        >
          <Archive aria-hidden='true' />
          <span>Stock actuel</span>
          <strong>{product.stock} exemplaires</strong>
          <small>Mis à jour le {product.updatedAtLabel ?? '—'}</small>
        </article>
        <article>
          <Warning aria-hidden='true' />
          <span>Seuil minimum</span>
          <strong>{product.threshold} exemplaires</strong>
          <small>{product.stock - product.threshold} au-dessus du seuil</small>
        </article>
      </section>

      <section className='product-detail-info-grid'>
        <article className='product-detail-panel bibliographic-panel'>
          <header>
            <BookOpen aria-hidden='true' />
            <div>
              <h3>Informations bibliographiques</h3>
              <p>Données de référence du catalogue</p>
            </div>
          </header>
          <dl>
            <div>
              <dt>Titre</dt>
              <dd>{product.title}</dd>
            </div>
            <div>
              <dt>Auteur</dt>
              <dd>{product.author}</dd>
            </div>
            <div>
              <dt>ISBN</dt>
              <dd>{product.isbn ?? '—'}</dd>
            </div>
            <div>
              <dt>Éditeur</dt>
              <dd>{product.publisher ?? '—'}</dd>
            </div>
            <div>
              <dt>Catégorie</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>Langue</dt>
              <dd>{product.language}</dd>
            </div>
            <div className='detail-description'>
              <dt>Description</dt>
              <dd>{product.description ?? '—'}</dd>
            </div>
          </dl>
        </article>

        <article className='product-detail-panel supplier-panel'>
          <header>
            <Truck aria-hidden='true' />
            <div>
              <h3>Fournisseur</h3>
              <p>Approvisionnement principal</p>
            </div>
          </header>
          <dl>
            <div>
              <dt>Fournisseur</dt>
              <dd>{product.supplier ?? '—'}</dd>
            </div>
            <div>
              <dt>Délai habituel</dt>
              <dd>{product.supplierLeadTime ?? '—'} jours calendaires</dd>
            </div>
            <div>
              <dt>Dernière réception</dt>
              <dd>26 août 2026 à 15:20</dd>
            </div>
            <div>
              <dt>Quantité reçue</dt>
              <dd>24 exemplaires</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className='product-detail-operations-grid'>
        <Card className='min-w-0'>
          <CardHeader>
            <CardTitle>Ventes récentes</CardTitle>
            <CardDescription>
              312 exemplaires sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecordsTable
              label='Ventes récentes'
              data={RECENT_SALES.map(([period, quantity, revenue]) => ({
                period,
                quantity: Number(quantity),
                revenue,
              }))}
              fields={[
                { key: 'period', label: 'Période' },
                { key: 'quantity', label: 'Exemplaires' },
                {
                  key: 'revenue',
                  label: 'Chiffre d’affaires',
                  sortable: false,
                },
              ]}
              rowId={(row) => row.period}
              selectable={false}
              toolbar={false}
              pagination={false}
            />
          </CardContent>
        </Card>

        <article className='product-detail-panel inventory-timeline-panel'>
          <header>
            <Archive aria-hidden='true' />
            <div>
              <h3>Mouvements de stock</h3>
              <p>Derniers mouvements enregistrés</p>
            </div>
          </header>
          <ol>
            {INVENTORY_MOVEMENTS.map((movement) => {
              const Icon = movement.tone === 'in' ? ArrowDown : ArrowUp
              return (
                <li key={movement.date}>
                  <span
                    className={`movement-icon movement-icon--${movement.tone}`}
                  >
                    <Icon aria-hidden='true' />
                  </span>
                  <div>
                    <strong>{movement.label}</strong>
                    <time>{movement.date}</time>
                  </div>
                  <span
                    className={`movement-quantity movement-quantity--${movement.tone}`}
                  >
                    {movement.quantity}
                  </span>
                  <small>Solde {movement.balance}</small>
                </li>
              )
            })}
          </ol>
        </article>
      </section>

      <section className='product-detail-forecast-grid'>
        <article className='product-detail-panel forecast-panel'>
          <header>
            <TrendUp aria-hidden='true' />
            <div>
              <h3>Prévision actuelle</h3>
              <p>Calculée le 27 août 2026 à 18:00</p>
            </div>
          </header>
          <div className='forecast-values'>
            <div>
              <span>Demande prévue</span>
              <strong>96</strong>
              <small>exemplaires · 4 semaines</small>
            </div>
            <div>
              <span>Couverture actuelle</span>
              <strong>13</strong>
              <small>jours de stock</small>
            </div>
            <div>
              <span>Risque de rupture</span>
              <strong className='forecast-risk'>Élevé</strong>
              <small>dans 14 jours</small>
            </div>
          </div>
        </article>

        <article className='product-detail-panel reorder-panel'>
          <header>
            <Cube aria-hidden='true' />
            <div>
              <h3>Recommandation de réapprovisionnement</h3>
              <p>Basée sur la prévision et le délai fournisseur</p>
            </div>
          </header>
          <div className='reorder-recommendation'>
            <strong>Commander 90 exemplaires</strong>
            <p>
              Passer la commande avant le <b>31 août 2026</b> pour maintenir 21
              jours de couverture après réception.
            </p>
            <dl>
              <div>
                <dt>Arrivée estimée</dt>
                <dd>08 septembre 2026</dd>
              </div>
              <div>
                <dt>Coût estimé</dt>
                <dd>4 455,00 MAD</dd>
              </div>
            </dl>
          </div>
        </article>
      </section>

      {showDisableDialog ? (
        <DisableProductDialog
          onCancel={() => setShowDisableDialog(false)}
          onConfirm={disableProduct}
          product={product}
        />
      ) : null}
    </div>
  )
}

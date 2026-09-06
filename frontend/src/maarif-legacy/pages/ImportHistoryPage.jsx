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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { RecordsTable } from '@/features/maarif/records-table'
import { StatusBadge } from '@/features/maarif/status-badge'
import { frenchDateOrder } from '@/features/maarif/table-format'
import { TablePageHeading, TableFeedback } from '@/features/maarif/table-page'
import { SALES_IMPORT_ERRORS } from '../shared/salesImportData.js'

const IMPORT_HISTORY = [
  {
    id: 'IMP-2026-0084',
    fileName: 'ventes_27_aout_2026.csv',
    checksum: '7f2e18c134b9d7551c5317aa03b0c841',
    status: 'Terminé avec erreurs',
    totalRows: 247,
    successfulRows: 242,
    failedRows: 5,
    user: 'Nadia El Mansouri',
    startTime: '27 août 2026 à 20:47',
    completionTime: '27 août 2026 à 20:48',
  },
  {
    id: 'IMP-2026-0083',
    fileName: 'ventes_26_aout_2026.csv',
    checksum: '1ac9dd874b91d82962a72fa03256e429',
    status: 'Terminé',
    totalRows: 198,
    successfulRows: 198,
    failedRows: 0,
    user: 'Salma Bennani',
    startTime: '26 août 2026 à 18:12',
    completionTime: '26 août 2026 à 18:13',
  },
  {
    id: 'IMP-2026-0082',
    fileName: 'ventes_25_aout_2026.csv',
    checksum: '8a4d992b88d823f70d2c37b3380f278d',
    status: 'Échec',
    totalRows: 321,
    successfulRows: 0,
    failedRows: 321,
    user: 'Salma Bennani',
    startTime: '25 août 2026 à 18:04',
    completionTime: '25 août 2026 à 18:05',
  },
  {
    id: 'IMP-2026-0081',
    fileName: 'rattrapage_ventes_24_aout.csv',
    checksum: 'f349acce244ea52e6aba5166d293f9e2',
    status: 'Terminé avec erreurs',
    totalRows: 88,
    successfulRows: 86,
    failedRows: 2,
    user: 'Yassine Alaoui',
    startTime: '25 août 2026 à 09:14',
    completionTime: '25 août 2026 à 09:15',
  },
  {
    id: 'IMP-2026-0080',
    fileName: 'ventes_24_aout_2026.csv',
    checksum: '9c408e353dc601a50ad89db9f6f09ac7',
    status: 'Terminé',
    totalRows: 276,
    successfulRows: 276,
    failedRows: 0,
    user: 'Nadia El Mansouri',
    startTime: '24 août 2026 à 18:21',
    completionTime: '24 août 2026 à 18:22',
  },
  {
    id: 'IMP-2026-0079',
    fileName: 'ventes_boutique_23_aout.csv',
    checksum: '3d8654c327a07113642449ab96de28e1',
    status: 'Terminé',
    totalRows: 143,
    successfulRows: 143,
    failedRows: 0,
    user: 'Imane Zahraoui',
    startTime: '23 août 2026 à 20:11',
    completionTime: '23 août 2026 à 20:12',
  },
  {
    id: 'IMP-2026-0078',
    fileName: 'ventes_web_23_aout.csv',
    checksum: '05f51fc0ec8a2385084bf7475d2cd22d',
    status: 'Terminé avec erreurs',
    totalRows: 179,
    successfulRows: 176,
    failedRows: 3,
    user: 'Imane Zahraoui',
    startTime: '23 août 2026 à 19:36',
    completionTime: '23 août 2026 à 19:37',
  },
  {
    id: 'IMP-2026-0077',
    fileName: 'ventes_22_aout_2026.csv',
    checksum: '828584850803fbda7084893812833b12',
    status: 'Terminé',
    totalRows: 214,
    successfulRows: 214,
    failedRows: 0,
    user: 'Salma Bennani',
    startTime: '22 août 2026 à 18:03',
    completionTime: '22 août 2026 à 18:04',
  },
  {
    id: 'IMP-2026-0076',
    fileName: 'ventes_21_aout_2026.csv',
    checksum: 'f48254d98633b7383008ac817f935221',
    status: 'Annulé',
    totalRows: 205,
    successfulRows: 81,
    failedRows: 0,
    user: 'Yassine Alaoui',
    startTime: '21 août 2026 à 18:16',
    completionTime: '21 août 2026 à 18:17',
  },
  {
    id: 'IMP-2026-0075',
    fileName: 'ventes_20_aout_2026.csv',
    checksum: 'b20bc03dd203dc3979e4996454f65d19',
    status: 'Terminé',
    totalRows: 233,
    successfulRows: 233,
    failedRows: 0,
    user: 'Nadia El Mansouri',
    startTime: '20 août 2026 à 18:06',
    completionTime: '20 août 2026 à 18:07',
  },
  {
    id: 'IMP-2026-0074',
    fileName: 'ventes_19_aout_2026.csv',
    checksum: '2632031416ed3a58378664ce90b23c29',
    status: 'Terminé avec erreurs',
    totalRows: 221,
    successfulRows: 217,
    failedRows: 4,
    user: 'Salma Bennani',
    startTime: '19 août 2026 à 18:09',
    completionTime: '19 août 2026 à 18:10',
  },
]

function ImportHistoryStatus({ status }) {
  const tone =
    status === 'Terminé'
      ? 'success'
      : status === 'Terminé avec erreurs'
        ? 'warning'
        : status === 'Échec'
          ? 'error'
          : 'neutral'
  return (
    <span className={`import-history-status import-history-status--${tone}`}>
      {status === 'Terminé' ? (
        <CheckCircle aria-hidden='true' weight='fill' />
      ) : status === 'Annulé' ? (
        <Prohibit aria-hidden='true' />
      ) : (
        <WarningCircle aria-hidden='true' weight='fill' />
      )}
      {status}
    </span>
  )
}

function errorsForImport(item) {
  if (item.id === 'IMP-2026-0084') return SALES_IMPORT_ERRORS
  if (item.failedRows === 0) return []
  if (item.status === 'Échec')
    return [
      [
        1,
        'en-têtes',
        'Les colonnes attendues ne correspondent pas au modèle des ventes.',
      ],
      [2, 'sale_date', 'Format de date non reconnu.'],
      [3, 'sku', 'SKU manquant.'],
      [4, 'quantity', 'Quantité non numérique.'],
      [5, 'order_reference', 'Référence de commande vide.'],
    ]
  return SALES_IMPORT_ERRORS.slice(
    0,
    Math.min(item.failedRows, SALES_IMPORT_ERRORS.length)
  )
}

function importErrorReport(item) {
  const rows = errorsForImport(item)
  return encodeURIComponent(
    [
      'line,column,error',
      ...rows.map(
        ([line, column, message]) => `${line},${column},\"${message}\"`
      ),
    ].join('\n')
  )
}

function ImportHistoryDialog({ item, onClose }) {
  const errors = errorsForImport(item)
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className='max-h-[90svh] overflow-y-auto sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='break-all'>{item.fileName}</DialogTitle>
          <DialogDescription>
            {item.id} · {item.successfulRows} lignes réussies sur{' '}
            {item.totalRows}
          </DialogDescription>
        </DialogHeader>
        <StatusBadge status={item.status} />
        <dl className='grid gap-4 text-sm sm:grid-cols-2'>
          {[
            ['Empreinte du fichier', item.checksum],
            ['Utilisateur', item.user],
            ['Début', item.startTime],
            ['Fin', item.completionTime],
            ['Lignes totales', item.totalRows],
            ['Lignes en échec', item.failedRows],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className='text-muted-foreground'>{label}</dt>
              <dd className='font-medium break-all'>{value}</dd>
            </div>
          ))}
        </dl>
        <section
          aria-labelledby='import-error-list-title'
          className='min-w-0 space-y-4'
        >
          <div>
            <h3 id='import-error-list-title' className='font-semibold'>
              Erreurs de l’import
            </h3>
            <p className='text-sm text-muted-foreground'>
              {item.failedRows
                ? `${errors.length} erreurs affichées sur ${item.failedRows}`
                : 'Aucune erreur enregistrée'}
            </p>
          </div>
          {errors.length ? (
            <RecordsTable
              label='Erreurs de l’import'
              data={errors.map(([line, column, message]) => ({
                line,
                column,
                message,
              }))}
              rowId={(row) => `${row.line}-${row.column}`}
              selectable={false}
              fields={[
                { key: 'line', label: 'Ligne' },
                {
                  key: 'column',
                  label: 'Colonne',
                  filter: true,
                  render: (row) => <code>{row.column}</code>,
                },
                {
                  key: 'message',
                  label: 'Erreur',
                  render: (row) => (
                    <span className='block max-w-md whitespace-normal'>
                      {row.message}
                    </span>
                  ),
                },
              ]}
            />
          ) : (
            <p className='text-sm'>
              Ce fichier ne contient aucune ligne rejetée.
            </p>
          )}
        </section>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Fermer
          </Button>
          {!!item.failedRows && (
            <Button asChild>
              <a
                download={`rapport_erreurs_${item.id.toLowerCase()}.csv`}
                href={`data:text/csv;charset=utf-8,${importErrorReport(item)}`}
              >
                Télécharger le rapport d’erreurs
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ImportHistoryPage({ imports = IMPORT_HISTORY }) {
  const [selectedImport, setSelectedImport] = useState(null)
  return (
    <div className='flex min-w-0 flex-col gap-6'>
      <TablePageHeading
        title='Historique des imports'
        description='Consultez les traitements, les volumes et les rejets de chaque fichier.'
      />
      <RecordsTable
        label='Historique des imports'
        data={imports}
        rowId={(row) => row.id}
        searchPlaceholder='Rechercher un fichier ou un import…'
        fields={[
          {
            key: 'fileName',
            label: 'Fichier',
            render: (row) => (
              <span className='font-medium'>{row.fileName}</span>
            ),
          },
          { key: 'id', label: 'Import', hidden: true },
          {
            key: 'checksum',
            label: 'Empreinte',
            hidden: true,
            render: (row) => (
              <code title={row.checksum}>
                {row.checksum.slice(0, 8)}…{row.checksum.slice(-4)}
              </code>
            ),
          },
          {
            key: 'status',
            label: 'Statut',
            filter: true,
            render: (row) => <StatusBadge status={row.status} />,
          },
          { key: 'totalRows', label: 'Total' },
          { key: 'successfulRows', label: 'Réussies' },
          {
            key: 'failedRows',
            label: 'Échecs',
            render: (row) => (
              <span className={row.failedRows ? 'text-destructive' : ''}>
                {row.failedRows}
              </span>
            ),
          },
          { key: 'user', label: 'Utilisateur', filter: true },
          {
            key: 'startTime',
            label: 'Début',
            value: (row) => frenchDateOrder(row.startTime),
            render: (row) => row.startTime,
          },
          {
            key: 'completionTime',
            label: 'Fin',
            value: (row) => frenchDateOrder(row.completionTime),
            render: (row) => row.completionTime,
            hidden: true,
          },
        ]}
        actions={(item) => [
          { label: 'Ouvrir l’import', onClick: () => setSelectedImport(item) },
          ...(item.failedRows
            ? [
                {
                  label: 'Télécharger les erreurs',
                  download: 'rapport_erreurs_' + item.id.toLowerCase() + '.csv',
                  href:
                    'data:text/csv;charset=utf-8,' + importErrorReport(item),
                },
              ]
            : []),
        ]}
      />
      {selectedImport && (
        <ImportHistoryDialog
          item={selectedImport}
          onClose={() => setSelectedImport(null)}
        />
      )}
    </div>
  )
}

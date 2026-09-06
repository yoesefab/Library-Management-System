import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RecordsTable } from '@/features/maarif/records-table'
import { StatusBadge } from '@/features/maarif/status-badge'
import { TablePageHeading } from '@/features/maarif/table-page'
import { formatMad } from '../shared/catalogData.js'
import { ORDERS } from '../shared/orderData.jsx'

export function OrdersManagement({ onView, orders = ORDERS }) {
  const [dateRange, setDateRange] = useState('01–27 août 2026')
  const filtered = orders.filter((order) => {
    if (dateRange === 'Toutes les dates') return true
    if (dateRange === '20–27 août 2026')
      return order.isoDate >= '2026-08-20' && order.isoDate <= '2026-08-27'
    if (dateRange === '01–31 juillet 2026')
      return order.isoDate >= '2026-07-01' && order.isoDate <= '2026-07-31'
    return order.isoDate >= '2026-08-01' && order.isoDate <= '2026-08-27'
  })
  return (
    <div className='flex min-w-0 flex-col gap-6'>
      <TablePageHeading
        title='Commandes'
        description='Consultez les ventes et suivez les commandes.'
      />
      <RecordsTable
        key={dateRange}
        searchAccessory={
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger
              aria-label='Filtrer par période'
              className='h-8 w-48'
              size='sm'
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                '01–27 août 2026',
                '20–27 août 2026',
                '01–31 juillet 2026',
                'Toutes les dates',
              ].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        label='Liste des commandes'
        bulkSelection={{
          entityName: 'commande',
          entityGender: 'feminine',
          exportFileName: 'commandes-selection.csv',
        }}
        data={filtered}
        rowId={(row) => row.reference}
        searchPlaceholder='Rechercher une référence ou une ville…'
        fields={[
          {
            key: 'reference',
            label: 'Référence',
            render: (row) => (
              <span className='font-medium'>{row.reference}</span>
            ),
          },
          {
            key: 'date',
            label: 'Date',
            value: (row) => row.isoDate,
            render: (row) => <time dateTime={row.isoDate}>{row.date}</time>,
          },
          {
            key: 'status',
            label: 'Statut',
            filter: true,
            render: (row) => <StatusBadge status={row.status} />,
          },
          { key: 'source', label: 'Source', filter: true },
          { key: 'city', label: 'Ville' },
          { key: 'itemCount', label: 'Articles' },
          {
            key: 'total',
            label: 'Total',
            render: (row) => formatMad(row.total),
          },
        ]}
        actions={(row) => [
          { label: 'Voir la commande', onClick: () => onView(row) },
        ]}
      />
    </div>
  )
}

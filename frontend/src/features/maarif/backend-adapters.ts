import type {
  AuditLog,
  ImportPreview,
  InventoryMovement,
  InventoryMovementType,
  ProductDetail,
  ProductRequest,
  Recommendation,
  SalesOrder,
  StockAlert,
  StockItem,
} from '@/types/api'
import { inventoryApi } from '@/api/inventory-api'
import { ordersApi } from '@/api/orders-api'
import { productsApi } from '@/api/products-api'
import type { ProductForm } from './product-create-dialog'
import type { Product } from './products-catalog'

const languageLabels: Record<string, string> = {
  AR: 'Arabe',
  ar: 'Arabe',
  Arabe: 'Arabe',
  EN: 'Anglais',
  en: 'Anglais',
  Anglais: 'Anglais',
  FR: 'Français',
  fr: 'Français',
  Français: 'Français',
}

const languageCodes: Record<string, string> = {
  Arabe: 'ar',
  Anglais: 'en',
  Français: 'fr',
}

const dateTime = new Intl.DateTimeFormat('fr-MA', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Africa/Casablanca',
})

const statusLabels = {
  PENDING: 'Brouillon',
  PROCESSING: 'En préparation',
  COMPLETED: 'Livrée',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
} as const

const movementLabels: Record<InventoryMovementType, string> = {
  INITIAL_STOCK: 'Stock initial',
  PURCHASE: 'Achat',
  SALE: 'Sortie',
  CUSTOMER_RETURN: 'Retour client',
  SUPPLIER_RETURN: 'Retour fournisseur',
  DAMAGE: 'Dommage',
  CORRECTION: 'Correction',
}

export const movementTypes: Record<string, InventoryMovementType> = {
  'Stock initial': 'INITIAL_STOCK',
  Achat: 'PURCHASE',
  'Retour client': 'CUSTOMER_RETURN',
  'Retour fournisseur': 'SUPPLIER_RETURN',
  Dommage: 'DAMAGE',
  Correction: 'CORRECTION',
}

export async function loadProducts(signal?: AbortSignal) {
  const [products, inventory] = await Promise.all([
    productsApi.list({ page: 0, size: 100 }, signal),
    inventoryApi.list(0, 100, signal),
  ])
  const details = await Promise.all(
    products.content.map((product) => productsApi.get(product.id, signal))
  )
  const stockByProduct = new Map(
    inventory.content.map((item) => [item.productId, item])
  )
  return details.map((detail) =>
    mapProduct(detail, stockByProduct.get(detail.id))
  )
}

export function mapProduct(
  detail: ProductDetail,
  stock?: StockItem
): Product & Record<string, unknown> {
  return {
    id: detail.id,
    sku: detail.sku,
    isbn: detail.isbn,
    title: detail.title,
    description: detail.description,
    author: detail.authors.map((author) => author.name).join(', ') || '—',
    category: detail.category?.name ?? '—',
    language: languageLabels[detail.language] ?? detail.language,
    price: Number(detail.sellingPrice),
    purchaseCost: Number(detail.purchaseCost ?? 0),
    stock: stock?.currentStock ?? 0,
    threshold: detail.minimumStockThreshold,
    active: detail.active,
    publisher: detail.publisher?.name ?? null,
    supplier: detail.supplier?.name ?? null,
    supplierLeadTime:
      detail.supplierLeadTimeDays ?? detail.minimumStockThreshold,
    updatedAtLabel: dateTime.format(new Date(detail.updatedAt)),
  }
}

export async function productRequest(
  values: ProductForm
): Promise<ProductRequest> {
  const [categories, authors, publishers, suppliers] = await Promise.all([
    productsApi.categories(),
    productsApi.authors(),
    productsApi.publishers(),
    productsApi.suppliers(),
  ])
  const names = values.authors
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
  return {
    sku: values.sku.trim(),
    isbn: values.isbn.trim() || undefined,
    title: values.title.trim(),
    description: values.description.trim() || undefined,
    language: languageCodes[values.language] ?? values.language,
    sellingPrice: Number(values.sellingPrice.replace(',', '.')),
    purchaseCost: Number(values.purchaseCost.replace(',', '.')),
    minimumStockThreshold: Number(values.minimumStock),
    supplierLeadTimeDays: Number(values.supplierLeadTime),
    categoryId:
      categories.content.find((item) => item.name === values.category)?.id ??
      null,
    publisherId:
      publishers.content.find((item) => item.name === values.publisher)?.id ??
      null,
    supplierId:
      suppliers.content.find((item) => item.name === values.supplier)?.id ??
      null,
    authorIds: authors.content
      .filter((item) => names.includes(item.name))
      .map((item) => item.id),
  }
}

export async function loadInventoryHistory(products: Product[]) {
  const responses = await Promise.all(
    products
      .filter((product) => product.id != null)
      .map((product) => inventoryApi.movements(product.id as number))
  )
  return responses
    .flatMap((response) => response.content)
    .sort(
      (left, right) =>
        new Date(right.occurredAt).getTime() -
        new Date(left.occurredAt).getTime()
    )
    .map(mapMovement)
}

export function mapMovement(movement: InventoryMovement) {
  return {
    id: `MVT-${movement.id}`,
    date: dateTime.format(new Date(movement.occurredAt)),
    product: movement.productTitle,
    sku: movement.sku,
    type: movementLabels[movement.type],
    quantity: movement.quantity,
    balance: movement.resultingStock,
    reference: movement.reason,
  }
}

export async function loadOrders(signal?: AbortSignal) {
  const first = await ordersApi.list(undefined, 0, signal)
  const pages = await Promise.all(
    Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, index) =>
      ordersApi.list(undefined, index + 1, signal)
    )
  )
  const summaries = [first, ...pages].flatMap((page) => page.content)
  const detailed = await Promise.all(
    summaries.map((order) => ordersApi.get(order.id, signal))
  )
  return detailed.map(mapOrder)
}

export function mapOrder(order: SalesOrder) {
  return {
    backendId: order.id,
    reference: order.externalReference || `CMD-${order.id}`,
    isoDate: order.orderDate.slice(0, 10),
    date: dateTime.format(new Date(order.orderDate)),
    status: statusLabels[order.status],
    source: order.source === 'CSV_IMPORT' ? 'Import CSV' : 'Saisie manuelle',
    city: order.customerCity ?? '—',
    itemCount: order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    total: Number(order.totalAmount),
    details: {
      lines: (order.items ?? []).map((item) => ({
        product: item.title,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
        lineTotal: Number(item.lineTotal),
      })),
      movements: [],
    },
  }
}

export function mapAlert(alert: StockAlert) {
  const type = {
    LOW_STOCK: 'Stock faible',
    OUT_OF_STOCK: 'Rupture de stock',
    APPROACHING_STOCKOUT: 'Risque de rupture',
    SLOW_MOVING: 'Rotation lente',
    DEAD_STOCK: 'Stock dormant',
  }[alert.type]
  const severity = {
    INFO: 'Moyenne',
    WARNING: 'Élevée',
    CRITICAL: 'Critique',
  }[alert.severity]
  const status = {
    OPEN: 'Nouvelle',
    ACKNOWLEDGED: 'Acquittée',
    RESOLVED: 'Résolue',
  }[alert.status]
  return {
    backendId: alert.id,
    id: `ALT-${alert.id}`,
    product: alert.productTitle,
    sku: alert.sku,
    type,
    severity,
    explanation: alert.explanation,
    suggestedAction: 'Consulter le stock et planifier le réapprovisionnement.',
    createdAt: dateTime.format(new Date(alert.createdAt)),
    status,
  }
}

export function mapImport(item: ImportPreview) {
  const status = {
    UPLOADED: 'Téléversé',
    VALIDATED: 'Validé',
    PROCESSING: 'En cours',
    COMPLETED: 'Terminé',
    FAILED: 'Échec',
    PARTIALLY_COMPLETED: 'Terminé avec erreurs',
  }[item.status]
  return {
    backendId: item.id,
    id: `IMP-${item.id}`,
    fileName: item.fileName,
    checksum: item.checksum,
    status,
    totalRows: item.totalRows,
    successfulRows: item.successfulRows,
    failedRows: item.failedRows,
    user: 'Système',
    startTime: dateTime.format(new Date(item.startedAt)),
    completionTime: item.completedAt
      ? dateTime.format(new Date(item.completedAt))
      : '—',
  }
}

export function mapRecommendation(item: Recommendation) {
  const predicted = Math.max(0, item.predictedDemand)
  return {
    backendId: item.id,
    productId: item.productId,
    sku: item.sku,
    title: item.title,
    author: '—',
    category: 'Catalogue',
    method: 'Prévision automatique',
    predictedQuantity: predicted,
    metricLabel: 'Prévision',
    metricValue: `${predicted} ex.`,
    generatedAt: dateTime.format(new Date(item.generatedAt)),
    currentStock: item.currentStock,
    leadTime: `${item.leadTimeDays} jours`,
    safetyStock: item.safetyStock,
    reorderPoint: item.reorderPoint,
    recommendedQuantity: item.recommendedQuantity,
    supplier: '—',
    data: Array.from({ length: 16 }, (_, index) => ({
      week: `S${index + 1}`,
      actual: null,
      predicted: Math.round(predicted / 4),
    })),
  }
}

export function mapAudit(item: AuditLog) {
  return {
    id: `AUD-${item.id}`,
    date: dateTime.format(new Date(item.occurredAt)),
    user: item.userEmail,
    action: item.action,
    entityType: item.entityType,
    entity: item.entityId,
    summary: item.metadata ?? item.action,
    result: 'Réussi',
  }
}

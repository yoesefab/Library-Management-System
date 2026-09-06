import type {
  Category,
  PageResponse,
  ProductDetail,
  ProductRequest,
  ProductSummary,
  Reference,
  Supplier,
} from '../types/api'
import { apiRequest, queryString } from './client'

export interface ProductFilters {
  query?: string
  active?: boolean
  language?: string
  categoryId?: number
  page?: number
  size?: number
}
export const productsApi = {
  list: (filters: ProductFilters, signal?: AbortSignal) =>
    apiRequest<PageResponse<ProductSummary>>(
      `/api/products${queryString(filters)}`,
      { signal }
    ),
  get: (id: number, signal?: AbortSignal) =>
    apiRequest<ProductDetail>(`/api/products/${id}`, { signal }),
  create: (body: ProductRequest) =>
    apiRequest<ProductDetail>('/api/products', { method: 'POST', body }),
  update: (id: number, body: ProductRequest) =>
    apiRequest<ProductDetail>(`/api/products/${id}`, { method: 'PUT', body }),
  deactivate: (id: number) =>
    apiRequest<void>(`/api/products/${id}`, { method: 'DELETE' }),
  categories: (signal?: AbortSignal) =>
    apiRequest<PageResponse<Category>>('/api/catalog/categories?size=100', {
      signal,
    }),
  authors: (signal?: AbortSignal) =>
    apiRequest<PageResponse<Reference>>('/api/catalog/authors?size=100', {
      signal,
    }),
  publishers: (signal?: AbortSignal) =>
    apiRequest<PageResponse<Reference>>('/api/catalog/publishers?size=100', {
      signal,
    }),
  suppliers: (signal?: AbortSignal) =>
    apiRequest<PageResponse<Supplier>>('/api/catalog/suppliers?size=100', {
      signal,
    }),
}

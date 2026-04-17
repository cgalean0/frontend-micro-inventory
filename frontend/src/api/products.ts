import { apiClient } from './client'

export interface Product {
  id: number
  name: string
  sku: string
  category: string
  size?: string
  color?: string
  quantity: number
  price: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  sku: string
  category: string
  size?: string
  color?: string
  quantity: number
  price: number
  description?: string
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface ProductFilters {
  page?: number
  size?: number
  category?: string
  sizeParam?: string
  color?: string
  search?: string
}

export const productsApi = {
  getAll: async (filters: ProductFilters = {}): Promise<Page<Product>> => {
    const response = await apiClient.get<Page<Product>>('/api/products', { params: filters })
    return response.data
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/products/${id}`)
    return response.data
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>('/api/products', data)
    return response.data
  },

  update: async (id: number, data: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(`/api/products/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`)
  },
}

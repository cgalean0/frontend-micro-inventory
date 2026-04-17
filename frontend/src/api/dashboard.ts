import { apiClient } from './client'

export interface DashboardStats {
  totalProducts: number
  totalItemsInStock: number
  lowStockCount: number
  outOfStockCount: number
  totalInventoryValue: number
  byCategory: CategoryStats[]
}

export interface CategoryStats {
  category: string
  productCount: number
  totalQuantity: number
  totalValue: number
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/api/dashboard/stats')
    return response.data
  },
}

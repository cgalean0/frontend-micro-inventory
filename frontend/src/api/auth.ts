import { apiClient } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  tokenType: string
  expiresIn: number
  username: string
  roles: string[]
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout')
  },

  refresh: async (): Promise<void> => {
    await apiClient.post('/api/auth/refresh')
  },
}

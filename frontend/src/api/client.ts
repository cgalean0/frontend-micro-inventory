import axios from 'axios'
import { API_BASE_URL } from '@/lib/constants'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await apiClient.post('/api/auth/refresh')
        return apiClient(error.config)
      } catch {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

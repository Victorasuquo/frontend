import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../config'
import { getAccessToken, getRefreshToken, setTokens, clearTokens, getStoredRole } from './tokenStore'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface RefreshResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined
    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      return Promise.reject(error)
    }

    try {
      originalRequest._retry = true
      const refreshResponse = await axios.post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      })
      const role = getStoredRole() ?? 'pcn'
      setTokens(refreshResponse.data.access_token, refreshToken, role)
      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`
      return api(originalRequest)
    } catch (refreshError) {
      clearTokens()
      return Promise.reject(refreshError)
    }
  },
)

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle errors and token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          // Try to refresh token
          const refreshed = await this.refreshAuthToken()
          if (refreshed) {
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${this.getAuthToken()}`
            return this.api(originalRequest)
          } else {
            // Refresh failed, logout user
            this.handleUnauthorized()
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      const tokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'vibeclip_token'
      return localStorage.getItem(tokenKey)
    }
    return null
  }

  private async refreshAuthToken(): Promise<boolean> {
    try {
      const refreshTokenKey = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'vibeclip_refresh_token'
      const refreshToken = localStorage.getItem(refreshTokenKey)
      
      if (!refreshToken) {
        return false
      }
      
      // Call refresh endpoint without auth interceptor
      const response = await axios.post(`${API_BASE_URL}/api/${API_VERSION}/auth/refresh`, {
        refreshToken
      })
      
      if (response.data.success && response.data.data.tokens) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens
        const tokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'vibeclip_token'
        
        localStorage.setItem(tokenKey, accessToken)
        localStorage.setItem(refreshTokenKey, newRefreshToken)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  private handleUnauthorized() {
    // Clear tokens and redirect to login
    if (typeof window !== 'undefined') {
      const tokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'vibeclip_token'
      const refreshTokenKey = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'vibeclip_refresh_token'
      
      localStorage.removeItem(tokenKey)
      localStorage.removeItem(refreshTokenKey)
      
      // Dispatch logout action or redirect
      window.location.href = '/login'
    }
  }

  // Generic HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config)
    return response.data
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config)
    return response.data
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config)
    return response.data
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config)
    return response.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config)
    return response.data
  }

  // File upload method
  async uploadFile<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    }

    const response: AxiosResponse<T> = await this.api.post(url, formData, config)
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService
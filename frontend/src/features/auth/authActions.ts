import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from '../../services/api'
import { setCredentials, logout as logoutAction, setError } from './authSlice'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name?: string
}

interface AuthResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      name: string | null
      role: string
    }
    tokens: {
      accessToken: string
      refreshToken: string
    }
  }
}

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials)

      if (response.success) {
        const { user, tokens } = response.data

        // Store tokens in localStorage
        localStorage.setItem('vibeclip_token', tokens.accessToken)
        localStorage.setItem('vibeclip_refresh_token', tokens.refreshToken)

        // Update Redux state
        dispatch(
          setCredentials({
            user: {
              id: user.id,
              email: user.email,
              name: user.name || '',
              role: user.role as 'user' | 'admin',
            },
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          })
        )

        return response.data
      }

      return rejectWithValue('Login failed')
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', data)

      if (response.success) {
        const { user, tokens } = response.data

        // Store tokens in localStorage
        localStorage.setItem('vibeclip_token', tokens.accessToken)
        localStorage.setItem('vibeclip_refresh_token', tokens.refreshToken)

        // Update Redux state
        dispatch(
          setCredentials({
            user: {
              id: user.id,
              email: user.email,
              name: user.name || '',
              role: user.role as 'user' | 'admin',
            },
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          })
        )

        return response.data
      }

      return rejectWithValue('Registration failed')
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Registration failed'
      return rejectWithValue(message)
    }
  }
)

// Logout action
export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    await apiService.post('/auth/logout')
  } catch (error) {
    // Ignore errors on logout
  } finally {
    // Clear tokens from localStorage
    localStorage.removeItem('vibeclip_token')
    localStorage.removeItem('vibeclip_refresh_token')

    // Update Redux state
    dispatch(logoutAction())
  }
})

// Get current user profile
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.get<{ success: boolean; data: { user: any } }>('/auth/me')

      if (response.success) {
        const { user } = response.data

        dispatch(
          setCredentials({
            user: {
              id: user.id,
              email: user.email,
              name: user.name || '',
              role: user.role as 'user' | 'admin',
            },
            token: localStorage.getItem('vibeclip_token') || '',
            refreshToken: localStorage.getItem('vibeclip_refresh_token') || '',
          })
        )

        return response.data
      }

      return rejectWithValue('Failed to get profile')
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to get profile'
      return rejectWithValue(message)
    }
  }
)

// Change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/auth/change-password', {
        oldPassword,
        newPassword,
      })

      return response
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to change password'
      return rejectWithValue(message)
    }
  }
)

// Initialize auth from localStorage
export const initAuth = createAsyncThunk('auth/init', async (_, { dispatch }) => {
  const token = localStorage.getItem('vibeclip_token')
  const refreshToken = localStorage.getItem('vibeclip_refresh_token')

  if (token && refreshToken) {
    // Try to get user profile
    try {
      await dispatch(getProfile())
    } catch (error) {
      // If failed, clear tokens
      localStorage.removeItem('vibeclip_token')
      localStorage.removeItem('vibeclip_refresh_token')
      dispatch(logoutAction())
    }
  }
})

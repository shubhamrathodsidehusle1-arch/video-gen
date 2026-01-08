import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from '../../services/api'

export interface Job {
  id: string
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  inputPrompt: string
  outputUrl: string | null
  metadata: Record<string, any> | null
  retryCount: number
  errorMessage: string | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  projectId: string | null
  project?: {
    id: string
    name: string
    color: string
  }
}

interface CreateJobData {
  inputPrompt: string
  projectId?: string
  metadata?: Record<string, any>
}

interface ListJobsParams {
  page?: number
  limit?: number
  status?: string
  projectId?: string
}

interface JobsResponse {
  success: boolean
  data: {
    jobs: Job[]
    total: number
    page: number
    totalPages: number
  }
}

interface JobResponse {
  success: boolean
  data: {
    job: Job
  }
}

// Create new job
export const createJob = createAsyncThunk(
  'jobs/create',
  async (data: CreateJobData, { rejectWithValue }) => {
    try {
      const response = await apiService.post<JobResponse>('/jobs', data)
      return response.data.job
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to create job'
      return rejectWithValue(message)
    }
  }
)

// Fetch jobs list
export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (params: ListJobsParams = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.status) queryParams.append('status', params.status)
      if (params.projectId) queryParams.append('projectId', params.projectId)

      const response = await apiService.get<JobsResponse>(`/jobs?${queryParams.toString()}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch jobs'
      return rejectWithValue(message)
    }
  }
)

// Fetch single job
export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<JobResponse>(`/jobs/${jobId}`)
      return response.data.job
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch job'
      return rejectWithValue(message)
    }
  }
)

// Update job
export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ jobId, data }: { jobId: string; data: Partial<Job> }, { rejectWithValue }) => {
    try {
      const response = await apiService.put<JobResponse>(`/jobs/${jobId}`, data)
      return response.data.job
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to update job'
      return rejectWithValue(message)
    }
  }
)

// Delete job
export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (jobId: string, { rejectWithValue }) => {
    try {
      await apiService.delete(`/jobs/${jobId}`)
      return jobId
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to delete job'
      return rejectWithValue(message)
    }
  }
)

// Cancel job
export const cancelJob = createAsyncThunk(
  'jobs/cancel',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.post<JobResponse>(`/jobs/${jobId}/cancel`)
      return response.data.job
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to cancel job'
      return rejectWithValue(message)
    }
  }
)

// Get job status
export const fetchJobStatus = createAsyncThunk(
  'jobs/fetchStatus',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{
        success: boolean
        data: {
          id: string
          status: string
          progress: number | null
          startedAt: string | null
          completedAt: string | null
          errorMessage: string | null
        }
      }>(`/jobs/${jobId}/status`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch job status'
      return rejectWithValue(message)
    }
  }
)

// Get job stats
export const fetchJobStats = createAsyncThunk(
  'jobs/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{
        success: boolean
        data: {
          stats: {
            total: number
            pending: number
            processing: number
            completed: number
            failed: number
          }
        }
      }>('/jobs/stats')
      return response.data.stats
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch job stats'
      return rejectWithValue(message)
    }
  }
)

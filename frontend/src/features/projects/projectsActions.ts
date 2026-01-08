import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from '../../services/api'

export interface Project {
  id: string
  userId: string
  name: string
  description: string | null
  color: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    jobs: number
  }
}

interface CreateProjectData {
  name: string
  description?: string
  color?: string
}

interface UpdateProjectData {
  name?: string
  description?: string
  color?: string
  isArchived?: boolean
}

interface ListProjectsParams {
  page?: number
  limit?: number
  isArchived?: boolean
}

interface ProjectsResponse {
  success: boolean
  data: {
    projects: Project[]
    total: number
    page: number
    totalPages: number
  }
}

interface ProjectResponse {
  success: boolean
  data: {
    project: Project
  }
}

// Create new project
export const createProject = createAsyncThunk(
  'projects/create',
  async (data: CreateProjectData, { rejectWithValue }) => {
    try {
      const response = await apiService.post<ProjectResponse>('/projects', data)
      return response.data.project
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to create project'
      return rejectWithValue(message)
    }
  }
)

// Fetch projects list
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (params: ListProjectsParams = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.isArchived !== undefined) queryParams.append('isArchived', params.isArchived.toString())

      const response = await apiService.get<ProjectsResponse>(`/projects?${queryParams.toString()}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch projects'
      return rejectWithValue(message)
    }
  }
)

// Fetch single project
export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<ProjectResponse>(`/projects/${projectId}`)
      return response.data.project
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch project'
      return rejectWithValue(message)
    }
  }
)

// Update project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ projectId, data }: { projectId: string; data: UpdateProjectData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put<ProjectResponse>(`/projects/${projectId}`, data)
      return response.data.project
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to update project'
      return rejectWithValue(message)
    }
  }
)

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (projectId: string, { rejectWithValue }) => {
    try {
      await apiService.delete(`/projects/${projectId}`)
      return projectId
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to delete project'
      return rejectWithValue(message)
    }
  }
)

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  createProject,
  fetchProjects,
  fetchProjectById,
  updateProject,
  deleteProject,
  Project,
} from './projectsActions'

interface ProjectsState {
  projects: Project[]
  currentProject: Project | null
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  error: string | null
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  total: 0,
  page: 1,
  totalPages: 0,
  isLoading: false,
  error: null,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
    },
  },
  extraReducers: (builder) => {
    // Create project
    builder.addCase(createProject.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false
      state.projects.unshift(action.payload)
      state.total += 1
    })
    builder.addCase(createProject.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch projects
    builder.addCase(fetchProjects.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.isLoading = false
      state.projects = action.payload.projects
      state.total = action.payload.total
      state.page = action.payload.page
      state.totalPages = action.payload.totalPages
    })
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch project by ID
    builder.addCase(fetchProjectById.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false
      state.currentProject = action.payload
    })
    builder.addCase(fetchProjectById.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Update project
    builder.addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex((project) => project.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = action.payload
      }
    })

    // Delete project
    builder.addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((project) => project.id !== action.payload)
      state.total -= 1
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null
      }
    })
  },
})

export const { clearError, clearCurrentProject } = projectsSlice.actions
export default projectsSlice.reducer

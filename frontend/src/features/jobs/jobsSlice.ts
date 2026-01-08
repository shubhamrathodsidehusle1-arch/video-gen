import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  createJob,
  fetchJobs,
  fetchJobById,
  updateJob,
  deleteJob,
  cancelJob,
  fetchJobStats,
  Job,
} from './jobsActions'

interface JobsState {
  jobs: Job[]
  currentJob: Job | null
  stats: {
    total: number
    pending: number
    processing: number
    completed: number
    failed: number
  } | null
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  error: string | null
}

const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  stats: null,
  total: 0,
  page: 1,
  totalPages: 0,
  isLoading: false,
  error: null,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentJob: (state) => {
      state.currentJob = null
    },
  },
  extraReducers: (builder) => {
    // Create job
    builder.addCase(createJob.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
      state.isLoading = false
      state.jobs.unshift(action.payload)
      state.total += 1
    })
    builder.addCase(createJob.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch jobs
    builder.addCase(fetchJobs.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.isLoading = false
      state.jobs = action.payload.jobs
      state.total = action.payload.total
      state.page = action.payload.page
      state.totalPages = action.payload.totalPages
    })
    builder.addCase(fetchJobs.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch job by ID
    builder.addCase(fetchJobById.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
      state.isLoading = false
      state.currentJob = action.payload
    })
    builder.addCase(fetchJobById.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Update job
    builder.addCase(updateJob.fulfilled, (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id)
      if (index !== -1) {
        state.jobs[index] = action.payload
      }
      if (state.currentJob?.id === action.payload.id) {
        state.currentJob = action.payload
      }
    })

    // Delete job
    builder.addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload)
      state.total -= 1
      if (state.currentJob?.id === action.payload) {
        state.currentJob = null
      }
    })

    // Cancel job
    builder.addCase(cancelJob.fulfilled, (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id)
      if (index !== -1) {
        state.jobs[index] = action.payload
      }
      if (state.currentJob?.id === action.payload.id) {
        state.currentJob = action.payload
      }
    })

    // Fetch job stats
    builder.addCase(fetchJobStats.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchJobStats.fulfilled, (state, action) => {
      state.isLoading = false
      state.stats = action.payload
    })
    builder.addCase(fetchJobStats.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })
  },
})

export const { clearError, clearCurrentJob } = jobsSlice.actions
export default jobsSlice.reducer

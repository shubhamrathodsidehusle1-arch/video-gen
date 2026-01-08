import { configureStore } from '@reduxjs/toolkit'
import authSlice from '@/features/auth/authSlice'
import uiSlice from '@/features/ui/uiSlice'
import jobsSlice from '@/features/jobs/jobsSlice'
import projectsSlice from '@/features/projects/projectsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    jobs: jobsSlice,
    projects: projectsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
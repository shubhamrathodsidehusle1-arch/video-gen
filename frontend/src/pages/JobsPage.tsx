import React, { useState } from 'react'
import { useAppSelector } from '@/hooks/redux'

interface Job {
  id: string
  title: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: string
  videoUrl?: string
  clipsGenerated?: number
}

export const JobsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [jobs, setJobs] = useState<Job[]>([])

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return 'badge-warning'
      case 'processing':
        return 'badge-info'
      case 'completed':
        return 'badge-success'
      case 'failed':
        return 'badge-error'
      default:
        return 'badge-ghost'
    }
  }

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'processing':
        return '⚡'
      case 'completed':
        return '✅'
      case 'failed':
        return '❌'
      default:
        return '❓'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Processing Jobs</h1>
          <p className="text-base-content/70 mt-1">
            Monitor your video processing jobs and clip generation status
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <span className="mr-2">➕</span>
            New Job
          </button>
        </div>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-warning">
            <span className="text-2xl">⏳</span>
          </div>
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">0</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-info">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="stat-title">Processing</div>
          <div className="stat-value text-info">0</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-success">
            <span className="text-2xl">✅</span>
          </div>
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">0</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-error">
            <span className="text-2xl">❌</span>
          </div>
          <div className="stat-title">Failed</div>
          <div className="stat-value text-error">0</div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Recent Jobs</h3>
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-sm btn-ghost">
                Filter
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h4 className="text-lg font-medium text-base-content mb-2">No jobs yet</h4>
              <p className="text-base-content/70 mb-6">
                Start by creating your first processing job to generate video clips
              </p>
              <button className="btn btn-primary">
                <span className="mr-2">➕</span>
                Create Your First Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="card bg-base-200 border border-base-300">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-base-content">{job.title}</h4>
                        <p className="text-sm text-base-content/70 mt-1">
                          Created {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`badge ${getStatusColor(job.status)} badge-lg`}>
                          {getStatusIcon(job.status)} {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        {job.status === 'processing' && (
                          <div className="w-24">
                            <progress className="progress progress-primary w-full" value={job.progress} max="100"></progress>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {job.clipsGenerated && (
                      <div className="mt-3 text-sm text-base-content/70">
                        Generated {job.clipsGenerated} clips
                      </div>
                    )}
                    
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-ghost btn-sm">View Details</button>
                      <button className="btn btn-primary btn-sm">View Clips</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
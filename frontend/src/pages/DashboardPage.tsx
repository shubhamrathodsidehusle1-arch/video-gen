import React from 'react'
import { useAppSelector } from '@/hooks/redux'

export const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-base-content/70">
          Ready to create some amazing video clips? Let's get started.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="stat-title">Active Jobs</div>
          <div className="stat-value text-primary">0</div>
          <div className="stat-desc">No processing jobs</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-secondary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="stat-title">Total Projects</div>
          <div className="stat-value text-secondary">0</div>
          <div className="stat-desc">No projects yet</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-accent">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="stat-title">Generated Clips</div>
          <div className="stat-value text-accent">0</div>
          <div className="stat-desc">Ready to create your first clip?</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-success">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">Processing Time</div>
          <div className="stat-value text-success">0min</div>
          <div className="stat-desc">Total processing time</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="card-body text-center">
            <div className="text-4xl mb-2">📹</div>
            <h3 className="card-title justify-center">Upload Video</h3>
            <p className="text-base-content/70">
              Start by uploading a video file to create clips
            </p>
            <div className="card-actions justify-center">
              <button className="btn btn-primary btn-sm">Upload</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="card-body text-center">
            <div className="text-4xl mb-2">🎬</div>
            <h3 className="card-title justify-center">AI Clip Generation</h3>
            <p className="text-base-content/70">
              Let AI automatically find the best moments
            </p>
            <div className="card-actions justify-center">
              <button className="btn btn-secondary btn-sm" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="card-body text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="card-title justify-center">Analytics</h3>
            <p className="text-base-content/70">
              Track your clip performance and engagement
            </p>
            <div className="card-actions justify-center">
              <button className="btn btn-accent btn-sm" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">Recent Activity</h3>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-base-content/70">No recent activity</p>
            <p className="text-sm text-base-content/50 mt-2">
              Upload your first video to get started!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
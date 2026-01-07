import React, { useState } from 'react'
import { useAppSelector } from '@/hooks/redux'

interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  lastModified: string
  videoCount: number
  clipCount: number
  thumbnail?: string
}

export const ProjectsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [projects, setProjects] = useState<Project[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Projects</h1>
          <p className="text-base-content/70 mt-1">
            Organize your videos and clips into projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <div className="join">
            <button
              className={`btn btn-sm join-item ${viewMode === 'grid' ? 'btn-active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              className={`btn btn-sm join-item ${viewMode === 'list' ? 'btn-active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
          <button className="btn btn-primary">
            <span className="mr-2">➕</span>
            New Project
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-primary">
            <span className="text-2xl">📁</span>
          </div>
          <div className="stat-title">Total Projects</div>
          <div className="stat-value text-primary">0</div>
          <div className="stat-desc">All your projects</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-secondary">
            <span className="text-2xl">📹</span>
          </div>
          <div className="stat-title">Total Videos</div>
          <div className="stat-value text-secondary">0</div>
          <div className="stat-desc">Across all projects</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-accent">
            <span className="text-2xl">🎬</span>
          </div>
          <div className="stat-title">Generated Clips</div>
          <div className="stat-value text-accent">0</div>
          <div className="stat-desc">Ready to share</div>
        </div>
      </div>

      {/* Projects List/Grid */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📂</div>
              <h4 className="text-lg font-medium text-base-content mb-2">No projects yet</h4>
              <p className="text-base-content/70 mb-6">
                Create your first project to organize your videos and clips
              </p>
              <button className="btn btn-primary">
                <span className="mr-2">➕</span>
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-4'
            }>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`card bg-base-200 border border-base-300 hover:shadow-lg transition-shadow cursor-pointer ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}
                >
                  <div className={`card-body ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-base-content">{project.name}</h4>
                        <p className="text-sm text-base-content/70 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-base-content/70">
                      <span>📹 {project.videoCount} videos</span>
                      <span>🎬 {project.clipCount} clips</span>
                    </div>
                    
                    <div className="text-xs text-base-content/50 mt-2">
                      Modified {new Date(project.lastModified).toLocaleDateString()}
                    </div>
                    
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-ghost btn-sm">View</button>
                      <button className="btn btn-primary btn-sm">Open</button>
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
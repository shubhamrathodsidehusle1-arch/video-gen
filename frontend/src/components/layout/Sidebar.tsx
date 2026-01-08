import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/redux'
import { setSidebarOpen } from '@/features/ui/uiSlice'

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()

  const isActive = (path: string) => location.pathname === path

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Jobs', href: '/jobs', icon: '⚡' },
    { name: 'Projects', href: '/projects', icon: '📁' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ]

  return (
    <aside className="w-64 min-h-full bg-base-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-base-content mb-4">Navigation</h2>
        
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => dispatch(setSidebarOpen(false))}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-primary text-primary-content'
                  : 'text-base-content hover:bg-base-300'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="divider my-6"></div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-base-content/70 uppercase tracking-wider">Quick Actions</h3>
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-base-content hover:bg-base-300 transition-colors">
            <span className="mr-3 text-lg">➕</span>
            New Job
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-base-content hover:bg-base-300 transition-colors">
            <span className="mr-3 text-lg">📤</span>
            Upload Video
          </button>
        </div>
      </div>
    </aside>
  )
}
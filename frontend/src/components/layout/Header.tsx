import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { toggleSidebar } from '@/features/ui/uiSlice'

export const Header: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-300">
      <div className="navbar-start">
        <button
          className="btn btn-ghost lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <span className="font-bold text-primary">VibeClip</span>
          <span className="text-base-content/70 ml-1">AI</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/jobs">Jobs</Link></li>
          <li><Link to="/projects">Projects</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end">
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button className="btn btn-ghost btn-circle">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
            <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
              <div className="card-body">
                <span className="font-bold text-lg">No notifications</span>
                <span className="text-info">You're all caught up!</span>
              </div>
            </div>
          </div>
          
          {isAuthenticated && user ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                  />
                </div>
              </button>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li><Link to="/settings">Settings</Link></li>
                <li><button>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
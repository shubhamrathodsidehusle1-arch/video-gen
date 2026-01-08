import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { toggleTheme, setTheme } from '@/features/ui/uiSlice'

export const SettingsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const { theme } = useAppSelector((state) => state.ui)
  const dispatch = useAppDispatch()
  
  const [activeTab, setActiveTab] = useState('profile')

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'billing', name: 'Billing', icon: '💳' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-base-content">Settings</h1>
        <p className="text-base-content/70 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-0">
              <ul className="menu">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      className={`flex items-center px-4 py-3 ${
                        activeTab === tab.id ? 'bg-primary text-primary-content' : ''
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="mr-3 text-lg">{tab.icon}</span>
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Profile Information</h3>
                  
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                      <span className="text-2xl">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Full Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={user?.name || ''}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        className="input input-bordered"
                        value={user?.email || ''}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Bio</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      placeholder="Tell us about yourself"
                    ></textarea>
                  </div>
                  
                  <button className="btn btn-primary">Save Changes</button>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Preferences</h3>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Theme</span>
                      <select
                        className="select select-bordered select-sm"
                        value={theme}
                        onChange={(e) => dispatch(setTheme(e.target.value as 'light' | 'dark'))}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Auto-save projects</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Show advanced options</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Default video quality</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="480p">480p</option>
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                    </select>
                  </div>
                  
                  <button className="btn btn-primary">Save Preferences</button>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Billing & Subscription</h3>
                  
                  <div className="alert alert-info">
                    <svg className="stroke-current shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Billing features will be available in the next phase. Currently using free tier.
                    </span>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Current Plan</div>
                      <div className="stat-value text-primary">Free</div>
                      <div className="stat-desc">No billing information required</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-title">Videos Processed</div>
                      <div className="stat-value">0</div>
                      <div className="stat-desc">This month</div>
                    </div>
                  </div>
                  
                  <button className="btn btn-outline" disabled>
                    Upgrade to Pro (Coming Soon)
                  </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Notification Settings</h3>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Email notifications</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Job completion notifications</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Marketing emails</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Security alerts</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                  </div>
                  
                  <button className="btn btn-primary">Save Notification Settings</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
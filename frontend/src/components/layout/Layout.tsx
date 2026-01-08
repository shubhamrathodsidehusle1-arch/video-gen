import React from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <div className="min-h-screen bg-base-100">
      <Header />
      
      <div className="drawer lg:drawer-open">
        <input
          id="drawer-toggle"
          type="checkbox"
          className="drawer-toggle"
          checked={sidebarOpen}
          onChange={() => {}}
        />
        
        <div className="drawer-content">
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        
        <div className="drawer-side">
          <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
          <Sidebar />
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content border-t border-base-300">
      <aside>
        <p className="text-sm text-base-content/70">
          © {new Date().getFullYear()} VibeClip AI. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2">
          <a href="#" className="link link-hover text-sm">Privacy Policy</a>
          <a href="#" className="link link-hover text-sm">Terms of Service</a>
          <a href="#" className="link link-hover text-sm">Support</a>
        </div>
      </aside>
    </footer>
  )
}
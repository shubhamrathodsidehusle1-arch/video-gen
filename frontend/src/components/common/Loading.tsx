import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'loading-spinner loading-xs',
    md: 'loading-spinner loading-sm',
    lg: 'loading-spinner loading-md'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <span className={`loading loading-dots ${sizeClasses[size]}`}></span>
      {text && <p className="mt-2 text-sm text-base-content/70">{text}</p>}
    </div>
  )
}

interface FullPageLoadingProps {
  text?: string
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
  text = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <Loading size="lg" text={text} />
    </div>
  )
}

export const InlineLoading: React.FC<LoadingProps> = ({ 
  size = 'sm', 
  text 
}) => {
  return (
    <div className="flex items-center">
      <span className={`loading loading-spinner ${size === 'sm' ? 'loading-xs' : size === 'md' ? 'loading-sm' : 'loading-md'}`}></span>
      {text && <span className="ml-2 text-sm text-base-content/70">{text}</span>}
    </div>
  )
}
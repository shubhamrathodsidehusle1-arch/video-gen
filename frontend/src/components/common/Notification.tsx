import React from 'react'

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  onClose?: () => void
  duration?: number
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  onClose,
  duration = 5000,
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'alert-success'
      case 'error':
        return 'alert-error'
      case 'warning':
        return 'alert-warning'
      case 'info':
        return 'alert-info'
      default:
        return 'alert-info'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={`alert ${getTypeClasses()} shadow-lg mb-2`}>
      <span className="text-lg">{getIcon()}</span>
      <div>
        <h3 className="font-bold">{title}</h3>
        {message && <div className="text-xs">{message}</div>}
      </div>
      {onClose && (
        <div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

interface NotificationContainerProps {
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  }>
  onRemove: (id: string) => void
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
}) => {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-sm space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  )
}
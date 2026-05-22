import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

const palette = {
  success: {
    bg: 'linear-gradient(135deg, #22c55e, #16a34a)',
    icon: '✅',
  },
  info: {
    bg: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
    icon: '✨',
  },
  warning: {
    bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    icon: '⚠️',
  },
  error: {
    bg: 'linear-gradient(135deg, #f87171, #ef4444)',
    icon: '⛔',
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = (message, options = {}) => {
    const id = Date.now() + Math.random()
    const duration = options.duration ?? 2400
    const type = options.type ?? 'success'
    const title = options.title ?? null

    setToasts((prev) => [...prev, { id, message, type, title }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    return id
  }

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const value = useMemo(() => ({ add, remove }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {toasts.map((t) => {
          const colors = palette[t.type] ?? palette.success
          return (
            <div
              key={t.id}
              style={{
                background: colors.bg,
                color: '#fff',
                padding: '14px 16px',
                borderRadius: 14,
                boxShadow: '0 15px 30px rgba(15,23,42,0.25)',
                minWidth: 260,
                maxWidth: 360,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                fontFamily: 'Inter, system-ui, sans-serif',
                animation: 'toastFadeIn 0.25s ease-out',
              }}
            >
              <div style={{ fontSize: '1.35rem', lineHeight: '1rem' }}>
                {colors.icon}
              </div>
              <div style={{ flex: 1 }}>
                {t.title && (
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.title}</div>
                )}
                <div style={{ fontWeight: 500 }}>{t.message}</div>
              </div>
              <button
                onClick={() => remove(t.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.9)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes toastFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

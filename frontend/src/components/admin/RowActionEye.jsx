import { useState, useRef, useEffect } from 'react'

export default function RowActionEye({ onView, onEdit, onDelete, placement = 'left' }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const hasActions = Boolean(onEdit || onDelete)

  const handleClick = (e) => {
    e.stopPropagation()
    if (!hasActions && onView) {
      onView()
      return
    }
    setOpen((v) => !v)
  }

  return (
    <div className="position-relative d-inline-block" ref={menuRef}>
      <button className="btn btn-sm btn-outline-secondary" onClick={handleClick} title={hasActions ? 'Options' : 'View'}>
        <i className="bi bi-eye"></i>
      </button>
      {hasActions && open && (
        <div
          className="card shadow-sm"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [placement]: 0,
            zIndex: 1050,
            minWidth: '140px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="list-group list-group-flush">
            {onView && (
              <button className="list-group-item list-group-item-action" onClick={() => { setOpen(false); onView() }}>
                <i className="bi bi-eye me-2"></i>View
              </button>
            )}
            {onEdit && (
              <button className="list-group-item list-group-item-action" onClick={() => { setOpen(false); onEdit() }}>
                <i className="bi bi-pencil me-2"></i>Edit
              </button>
            )}
            {onDelete && (
              <button className="list-group-item list-group-item-action text-danger" onClick={() => { setOpen(false); onDelete() }}>
                <i className="bi bi-trash me-2"></i>Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}



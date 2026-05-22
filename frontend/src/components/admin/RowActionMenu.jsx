import { useState, useRef, useEffect } from 'react'

export default function RowActionMenu({ onEdit, onDelete, placement = 'right' }) {
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
    if (!hasActions) return
    setOpen((v) => !v)
  }

  return (
    <div className="position-relative d-inline-block" ref={menuRef}>
      <button className="btn btn-sm btn-outline-secondary" onClick={handleClick} title="Options">
        ...
      </button>
      {hasActions && open && (
        <div
          className="card shadow-sm p-2"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [placement]: 0,
            zIndex: 1050
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex gap-2">
            {onEdit && (
              <button className="btn btn-sm btn-outline-info" onClick={() => { setOpen(false); onEdit() }}>
                Edit
              </button>
            )}
            {onDelete && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => { setOpen(false); onDelete() }}>
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}



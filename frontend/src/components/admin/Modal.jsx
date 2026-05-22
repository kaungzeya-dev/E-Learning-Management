export default function Modal({ show, onClose, title, children, size = '' }) {
  if (!show) return null

  return (
    <div className="modal d-block modal-backdrop" tabIndex="-1" onClick={onClose}>
      <div className={`modal-dialog ${size ? `modal-${size}` : ''} modal-dialog-centered`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          {title && (
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}


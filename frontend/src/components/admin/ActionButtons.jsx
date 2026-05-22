export default function ActionButtons({ onEdit, onDelete, editLabel = 'Edit', deleteLabel = 'Delete' }) {
  return (
    <div className="text-end">
      {onEdit && (
        <button className="btn btn-sm btn-outline-info me-2" onClick={onEdit}>
          <i className="bi bi-pencil me-1"></i>{editLabel}
        </button>
      )}
      {onDelete && (
        <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
          <i className="bi bi-trash me-1"></i>{deleteLabel}
        </button>
      )}
    </div>
  )
}


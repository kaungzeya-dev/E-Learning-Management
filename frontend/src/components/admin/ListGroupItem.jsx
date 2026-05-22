export default function ListGroupItem({ title, description, badge, badgeVariant = 'success', extra }) {
  return (
    <div className="list-group-item">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <strong>{title}</strong>
          {description && <div className="text-muted small mt-1">{description}</div>}
          {(badge || extra) && (
            <div className="mt-2">
              {badge && <span className={`badge bg-${badgeVariant}`}>{badge}</span>}
              {extra}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


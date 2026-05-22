export default function DetailSection({ label, children, className = '' }) {
  return (
    <div className={`detail-section ${className}`}>
      <label className="form-label detail-label">{label}</label>
      {children}
    </div>
  )
}


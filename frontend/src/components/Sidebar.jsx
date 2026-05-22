export default function Sidebar({ active, onSelect }) {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
      { id: 'admins', label: 'Admin', icon: 'bi-shield-lock' },
      { id: 'students', label: 'Students', icon: 'bi-mortarboard' },
      { id: 'instructors', label: 'Instructors', icon: 'bi-person-workspace' },
      { id: 'courses', label: 'Courses', icon: 'bi-journal-bookmark' },
      { id: 'enrollment', label: 'Enrollment', icon: 'bi-people' },
    ]
  
    return (
      <aside className="d-flex flex-column gap-1 p-3 min-vh-100 border-end bg-info-subtle" style={{ width: 260 }}>
        <div className="d-flex align-items-center mb-3">
          <span className="badge text-bg-info me-2">EL</span>
          <strong className="fs-5 text-dark">E-Learn</strong>
        </div>
        <ul className="nav nav-pills flex-column">
          {items.map(item => (
            <li className="nav-item" key={item.id}>
              <button
                className={`nav-link w-100 text-start d-flex align-items-center ${active === item.id ? 'active' : ''}`}
                onClick={() => onSelect(item.id)}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    )
  }
  
  
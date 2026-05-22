import React from 'react'
import './Topbar.css'

export default function Topbar({ title, admin }) {
  const [open, setOpen] = React.useState(false)

  const handleMouseEnter = () => setOpen(true)
  const handleMouseLeave = () => setOpen(false)

  const logout = () => {
    document.dispatchEvent(new CustomEvent('topbar:logout'))
  }

  const getInitial = () => {
    if (admin?.firstName) {
      return admin.firstName.charAt(0).toUpperCase()
    }
    if (admin?.email) {
      return admin.email.charAt(0).toUpperCase()
    }
    return 'A'
  }

  const getDisplayName = () => {
    if (admin?.firstName && admin?.lastName) {
      return `${admin.firstName} ${admin.lastName}`
    }
    return admin?.email || 'Admin'
  }

  return (
    <nav className="navbar navbar-expand bg-white border-bottom px-3" role="navigation">
      <div className="container-fluid position-relative">
        <span className="position-absolute top-50 start-50 translate-middle text-info fw-bold fs-3">{title}</span>
        <div className="ms-auto position-relative account-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="account-icon-circle">
            <span className="account-initial">{getInitial()}</span>
          </div>
          <ul className={`dropdown-menu account-dropdown ${open ? 'show' : ''}`}>
            <li className="dropdown-header px-3 py-2">
              <div className="fw-semibold">Logged in admin account</div>
              <div className="small text-muted">{getDisplayName()}</div>
              <div className="small text-muted">{admin?.email || ''}</div>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item text-danger" onClick={logout}><i className="bi bi-box-arrow-right me-2"></i>Log Out</button></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}


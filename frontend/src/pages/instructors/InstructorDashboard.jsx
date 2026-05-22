import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/InstructorDashboard.css'
import CourseManagement from '../../components/CourseManagement'
import InstructorAnalytics from '../../components/InstructorAnalytics'

export default function InstructorDashboard() {
  const navigate = useNavigate()
  const [instructor, setInstructor] = useState(null)
  const [activeTab, setActiveTab] = useState('courses')
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const userData = localStorage.getItem('user')
    
    if (!token || userRole !== 'INSTRUCTOR' || !userData) {
      navigate('/instructor/signin')
      return
    }
    
    const parsed = JSON.parse(userData)
    setInstructor(parsed)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    navigate('/')
  }

  return (
    <div className="instructor-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-name">LearnHub Instructor</span>
          </div>
          <div className="header-actions">
            <div
              className="user-info"
              onClick={() => setShowMenu((v) => !v)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <div className="user-avatar">
                <span>{instructor?.firstName?.charAt(0) || 'I'}</span>
              </div>
              <div className="user-details">
                <span className="user-name">{instructor?.firstName} {instructor?.lastName}</span>
              </div>
              {showMenu && (
                <div className="dashboard-user-menu">
                  <div className="dashboard-user-menu-header">
                    <div className="dashboard-user-menu-name">
                      {instructor?.firstName} {instructor?.lastName}
                    </div>
                    <div className="dashboard-user-menu-email">
                      {instructor?.email}
                    </div>
                  </div>
                  <button
                    className="dashboard-user-menu-item"
                    onClick={() => {
                      setShowMenu(false)
                      navigate('/instructor/settings')
                    }}
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>
                  <button
                    className="dashboard-user-menu-item"
                    onClick={() => {
                      setShowMenu(false)
                      navigate('/forgot-password?role=INSTRUCTOR')
                    }}
                  >
                    <span>🔒</span>
                    <span>Change Password</span>
                  </button>
                  <div className="dashboard-user-menu-divider" />
                  <button
                    className="dashboard-user-menu-item danger"
                    onClick={() => {
                      setShowMenu(false)
                      handleLogout()
                    }}
                  >
                    <span>🚪</span>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <span className="nav-icon">📚</span>
              My Courses
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="nav-icon">📊</span>
              Analytics
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {activeTab === 'courses' && <CourseManagement />}
          {activeTab === 'analytics' && <InstructorAnalytics />}
        </main>
      </div>
    </div>
  )
}

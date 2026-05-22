import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'
import '../pages/styles/AdminAnalytics.css'

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Admin uses 'auth.token' in localStorage
      const token = localStorage.getItem('auth.token') || localStorage.getItem('token')

      if (!token) {
        setError('No authentication token found. Please log in again.')
        setLoading(false)
        return
      }

      const response = await apiClient.get('/analytics/admin', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setAnalytics(response.data.data)
      } else {
        setError('Failed to load analytics')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-analytics-container">
        <div className="text-center p-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-analytics-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-info text-white" onClick={fetchAnalytics}>
          Retry
        </button>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="admin-analytics-container">
        <div className="card shadow-sm">
          <div className="card-body text-center p-5">
            <h5 className="text-muted">No analytics data available</h5>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-analytics-container">
      <div className="analytics-header mb-4">
        <h2 className="text-info mb-2">System Analytics Dashboard</h2>
        <p className="text-muted">Overview of your e-learning platform</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm stat-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">👥</div>
                <div>
                  <h3 className="mb-0">{analytics.totalStudents || 0}</h3>
                  <p className="text-muted mb-0 small">Total Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm stat-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">👨‍🏫</div>
                <div>
                  <h3 className="mb-0">{analytics.totalInstructors || 0}</h3>
                  <p className="text-muted mb-0 small">Total Instructors</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm stat-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">🛡️</div>
                <div>
                  <h3 className="mb-0">{analytics.totalAdmins || 0}</h3>
                  <p className="text-muted mb-0 small">Total Admins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm stat-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">📚</div>
                <div>
                  <h3 className="mb-0">{analytics.totalCourses || 0}</h3>
                  <p className="text-muted mb-0 small">Total Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm stat-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">✅</div>
                <div>
                  <h3 className="mb-0">{analytics.publishedCourses || 0}</h3>
                  <p className="text-muted mb-0 small">Published Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm stat-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">📝</div>
                <div>
                  <h3 className="mb-0">{analytics.draftCourses || 0}</h3>
                  <p className="text-muted mb-0 small">Draft Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm stat-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">🎓</div>
                <div>
                  <h3 className="mb-0">{analytics.totalEnrollments || 0}</h3>
                  <p className="text-muted mb-0 small">Total Enrollments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm stat-card highlight">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">📈</div>
                <div>
                  <h3 className="mb-0">{analytics.averageCompletionRate?.toFixed(1) || 0}%</h3>
                  <p className="text-muted mb-0 small">Avg Completion Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Status */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-info mb-3">Enrollment Status</h5>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Completed</span>
                <strong>{analytics.completedEnrollments || 0}</strong>
              </div>
              <div className="progress mb-3" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width: `${analytics.totalEnrollments > 0 
                      ? (analytics.completedEnrollments / analytics.totalEnrollments * 100) 
                      : 0}%`
                  }}
                ></div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>In Progress</span>
                <strong>{analytics.inProgressEnrollments || 0}</strong>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{
                    width: `${analytics.totalEnrollments > 0 
                      ? (analytics.inProgressEnrollments / analytics.totalEnrollments * 100) 
                      : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-info mb-3">Course Status</h5>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Published</span>
                <strong>{analytics.publishedCourses || 0}</strong>
              </div>
              <div className="progress mb-3" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-info"
                  role="progressbar"
                  style={{
                    width: `${analytics.totalCourses > 0 
                      ? (analytics.publishedCourses / analytics.totalCourses * 100) 
                      : 0}%`
                  }}
                ></div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Draft</span>
                <strong>{analytics.draftCourses || 0}</strong>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-secondary"
                  role="progressbar"
                  style={{
                    width: `${analytics.totalCourses > 0 
                      ? (analytics.draftCourses / analytics.totalCourses * 100) 
                      : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


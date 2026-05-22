import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'
import '../pages/styles/InstructorAnalytics.css'

export default function InstructorAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user'))
      const instructorId = userData.instructorId

      const response = await apiClient.get(`/analytics/instructor/${instructorId}`, {
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
      <div className="analytics-container">
        <div className="loading-state">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="error-message">{error}</div>
        <button className="btn-primary" onClick={fetchAnalytics}>
          Retry
        </button>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="analytics-container">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No analytics data available</h3>
          <p>Start creating courses to see your analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Track your course performance and student engagement</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{analytics.totalCourses || 0}</h3>
            <p>Total Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{analytics.publishedCourses || 0}</h3>
            <p>Published Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{analytics.draftCourses || 0}</h3>
            <p>Draft Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{analytics.totalEnrollments || 0}</h3>
            <p>Total Enrollments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{analytics.completedEnrollments || 0}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{analytics.inProgressEnrollments || 0}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{analytics.averageCompletionRate?.toFixed(1) || 0}%</h3>
            <p>Average Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Course Analytics Table */}
      {analytics.courseAnalytics && analytics.courseAnalytics.length > 0 ? (
        <div className="course-analytics-section">
          <h2>Course Performance</h2>
          <div className="analytics-table-container">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Status</th>
                  <th>Enrollments</th>
                  <th>Completed</th>
                  <th>In Progress</th>
                  <th>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.courseAnalytics.map((course) => (
                  <tr key={course.courseId}>
                    <td className="course-title">{course.courseTitle}</td>
                    <td>
                      <span className={`status-badge ${course.status === 'Published' ? 'published' : 'draft'}`}>
                        {course.status}
                      </span>
                    </td>
                    <td>{course.enrollmentCount || 0}</td>
                    <td>{course.completedCount || 0}</td>
                    <td>{course.inProgressCount || 0}</td>
                    <td>
                      <div className="completion-rate">
                        <span className="rate-value">{course.completionRate?.toFixed(1) || 0}%</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${course.completionRate || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No course analytics yet</h3>
          <p>Create courses and get enrollments to see detailed analytics</p>
        </div>
      )}
    </div>
  )
}


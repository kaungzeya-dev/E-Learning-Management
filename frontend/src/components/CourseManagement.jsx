import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import CourseModal from './CourseModal'
import { categoryAPI } from '../services/api.js'
import { useToast } from '../state/ToastContext.jsx'

export default function CourseManagement() {
  const toast = useToast()
  const [courses, setCourses] = useState([])
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user'))
      const instructorId = userData.instructorId
      
      // Fetch courses
      const response = await apiClient.get(`/courses/instructor/${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const coursesData = response.data.data || response.data
      
      // Fetch categories to map IDs to names
      try {
        const categoriesData = await categoryAPI.getAllCategories()
        
        // Add category name to each course
        if (categoriesData && categoriesData.length > 0) {
          const coursesWithCategories = coursesData.map(course => {
            const category = categoriesData.find(cat => cat.categoryId === course.categoryId)
            return {
              ...course,
              category: category || { name: 'Unknown Category' }
            }
          })
          setCourses(coursesWithCategories)
        } else {
          setCourses(coursesData)
        }
      } catch (categoryError) {
        console.error('Error fetching categories:', categoryError)
        setCourses(coursesData)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Delete this course? This action cannot be undone.')) return
    
    try {
      const token = localStorage.getItem('token')
      await apiClient.delete(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCourses()
      toast.add('Course deleted successfully')
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="course-management">
      <div className="tab-header">
        <div>
          <h1>My Courses</h1>
          <p>Create and manage your courses</p>
        </div>
        <button className="btn-primary" onClick={() => { setSelectedCourse(null); setShowCourseModal(true) }}>
          <span>+</span> Create New Course
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No courses yet</h3>
          <p>Create your first course to start teaching</p>
         
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.courseId} className="course-card">
              <div className="course-card-header">
                <div className="course-thumbnail">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title || 'Course thumbnail'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px'
                      }}
                    />
                  ) : (
                    <span className="course-emoji">📖</span>
                  )}
                </div>
                <span className={`status-badge ${course.status === 'Published' ? 'published' : 'draft'}`}>
                  {course.status}
                </span>
              </div>
              <div className="course-card-body">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📚</span>
                    {course.category?.name || `Category ID: ${course.categoryId}`}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">📊</span>
                    {course.status}
                  </span>
                </div>
                <div className="course-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => navigate(`/instructor/course/${course.courseId}`)}
                  >
                    Manage
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => { setSelectedCourse(course); setShowCourseModal(true) }}
                    style={{ marginLeft: '8px' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDeleteCourse(course.courseId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCourseModal && (
        <CourseModal 
          course={selectedCourse}
          onClose={() => { setShowCourseModal(false); setSelectedCourse(null) }}
          onSuccess={() => {
            setShowCourseModal(false)
            fetchCourses()
            toast.add(selectedCourse ? 'Course updated successfully' : 'Course created successfully')
            setSelectedCourse(null)
          }}
        />
      )}
    </div>
  )
}

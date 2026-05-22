import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../api/apiClient'
import ModuleModal from '../../components/ModuleModal'
import ContentModal from '../../components/ContentModal'
import { categoryAPI } from '../../services/api.js'
import { useToast } from '../../state/ToastContext.jsx'
import '../styles/InstructorDashboard.css'

export default function CourseManage() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [courseData, setCourseData] = useState(null)
  const [modules, setModules] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryName, setCategoryName] = useState('Loading...')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingCourse, setEditingCourse] = useState(false)
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [showContentModal, setShowContentModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await apiClient.get(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const coursePayload = response.data.data || response.data

      setCourse(coursePayload)
      setCourseData(coursePayload)

      await Promise.all([fetchModules(coursePayload.courseId), fetchCategories(coursePayload)])
    } catch (err) {
      console.error('Error fetching course', err)
      setError('Unable to load course details. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchModules = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await apiClient.get(`/course-modules/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setModules(response.data.data || response.data || [])
    } catch (err) {
      console.error('Error fetching modules', err)
    }
  }

  const fetchCategories = async (coursePayload) => {
    try {
      setLoadingCategories(true)
      const categoriesData = await categoryAPI.getAllCategories()
      setCategories(categoriesData || [])

      if (categoriesData && categoriesData.length > 0) {
        const courseCategory = categoriesData.find(
          (category) => category.categoryId === coursePayload.categoryId,
        )
        setCategoryName(courseCategory ? courseCategory.name : 'Unknown Category')
      } else {
        setCategoryName('Category Not Found')
      }
    } catch (err) {
      console.error('Error fetching categories', err)
      setCategoryName('Category Not Found')
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleUpdateCourse = async () => {
    if (!courseData) return

    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')

      const payload = {
        ...courseData,
        instructorId: userData.instructorId,
      }

      await apiClient.put(`/courses/${courseId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setEditingCourse(false)
      fetchCourse()
      toast.add('Course updated successfully')
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Delete this module?')) return
    try {
      const token = localStorage.getItem('token')
      await apiClient.delete(`/course-modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchModules(courseId)
      toast.add('Module deleted successfully')
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  const openContentModal = (module) => {
    setSelectedModule(module)
    setShowContentModal(true)
  }

  const openCreateModuleModal = () => {
    setSelectedModule(null)
    setShowModuleModal(true)
  }

  const openEditModuleModal = (module) => {
    setSelectedModule(module)
    setShowModuleModal(true)
  }

  const closeContentModal = () => {
    setSelectedModule(null)
    setShowContentModal(false)
  }

  const handleBack = () => {
    navigate('/instructor/dashboard')
  }

  if (loading) {
    return (
      <div className="course-manage-page">
        <div className="course-manage-container">
          <div className="loading-state large">Loading course...</div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="course-manage-page">
        <div className="course-manage-container">
          <div className="error-state large">
            <h2>Course Not Available</h2>
            <p>{error || 'We could not find the course you are looking for.'}</p>
            <button className="btn-primary" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="course-manage-page">
      <div className="course-manage-container">
        <div className="manage-top-bar">
          <button className="btn-secondary" onClick={handleBack}>
            ← Back to Dashboard
          </button>
          <div className="manage-top-info">
            <h1>{course.title}</h1>
            <p>Manage modules and add course content</p>
          </div>
          <span className={`status-badge ${course.status === 'Published' ? 'published' : 'draft'}`}>
            {course.status}
          </span>
        </div>

        <div className="course-manage-card">
           

          <div className="course-section">
            <div className="section-header">
              <div>
                <h3>Modules</h3>
                <p className="section-subtitle">
                  Organise your course content into modular lessons and add videos, slides, and quizzes.
                </p>
              </div>
              <button className="btn-primary" onClick={openCreateModuleModal}>
                + Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="empty-state large">
                <div className="empty-icon">📘</div>
                <h4>No modules yet</h4>
                <p>Create your first module to start adding lessons and activities.</p>
                <button className="btn-primary" onClick={openCreateModuleModal}>
                  Create Module
                </button>
              </div>
            ) : (
              <div className="modules-list">
                {modules.map((module, index) => (
                  <div key={module.moduleId} className="module-item">
                    <div className="module-number">{index + 1}</div>
                    <div className="module-info">
                      <h4>{module.title}</h4>
                      <p>{module.description || 'No module description provided.'}</p>
                    </div>
                    <div className="module-actions">
                      <button
                        className="btn-secondary small"
                        onClick={() => navigate(`/instructor/course/${courseId}/module/${module.moduleId}`)}
                      >
                        Manage Contents
                      </button>
                      <button className="btn-secondary small" onClick={() => openEditModuleModal(module)}>
                        Edit
                      </button>
                      <button className="btn-icon" onClick={() => handleDeleteModule(module.moduleId)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModuleModal && (
        <ModuleModal
          courseId={Number(courseId)}
          module={selectedModule || undefined}
          onClose={() => setShowModuleModal(false)}
          onSuccess={(updatedId) => {
            setShowModuleModal(false)
            fetchModules(courseId)
            toast.add(selectedModule ? 'Module updated successfully' : 'Module created successfully')
          }}
        />
      )}

      {showContentModal && selectedModule && (
        <ContentModal
          module={selectedModule}
          onClose={() => {
            closeContentModal()
            fetchModules(courseId)
          }}
        />
      )}
    </div>
  )
}


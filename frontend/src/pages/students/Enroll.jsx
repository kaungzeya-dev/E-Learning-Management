import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { courseAPI, enrollmentAPI, courseModuleAPI, courseContentAPI, instructorAPI } from '../../services/api.js'

export default function Enroll() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(searchParams.get('enrolled') === '1')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [modules, setModules] = useState([])
  const [moduleLoading, setModuleLoading] = useState(false)
  const [courseContents, setCourseContents] = useState({})
  const [contentLoading, setContentLoading] = useState(false)
  const [instructor, setInstructor] = useState(null)
  const [instructorLoading, setInstructorLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const fetchCourseAndEnrollmentStatus = async () => {
      try {
        setLoading(true)
        const courseData = await courseAPI.getCourseById(id)
        setCourse(courseData)

        const userData = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        const userRole = localStorage.getItem('userRole')

        if (userData && token && userRole === 'STUDENT') {
          setIsLoggedIn(true)
          const user = JSON.parse(userData)
          try {
            const isEnrolled = await enrollmentAPI.checkEnrollment(user.studentId, id)
            setEnrolled(isEnrolled)
          } catch (err) {
            console.error('Failed to check enrollment status:', err)
          }
        } else {
          setIsLoggedIn(false)
        }

        fetchCourseModules(id)

        if (courseData?.instructorId) {
          fetchInstructor(courseData.instructorId)
        }
      } catch (err) {
        console.error('Failed to fetch course:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseAndEnrollmentStatus()
  }, [id])

  const fetchCourseModules = async (courseId) => {
    try {
      setModuleLoading(true)
      const moduleData = await courseModuleAPI.getModulesByCourseId(courseId)

      if (moduleData?.length) {
        const sortedModules = [...moduleData].sort((a, b) => a.moduleOrder - b.moduleOrder)
        setModules(sortedModules)
        for (const module of sortedModules) {
          fetchModuleContents(module.moduleId)
        }
      } else {
        setModules([])
      }
    } catch (err) {
      console.error('Failed to fetch modules:', err)
      setModules([])
    } finally {
      setModuleLoading(false)
    }
  }

  const fetchInstructor = async (instructorId) => {
    try {
      setInstructorLoading(true)
      const instructorData = await instructorAPI.getInstructorById(instructorId)
      setInstructor(instructorData)
    } catch (err) {
      console.error(`Failed to fetch instructor ${instructorId}:`, err)
      setInstructor(null)
    } finally {
      setInstructorLoading(false)
    }
  }

  const fetchModuleContents = async (moduleId) => {
    try {
      setContentLoading(true)
      const contentData = await courseContentAPI.getContentsByModuleId(moduleId)
      const sortedContents = contentData?.length
        ? [...contentData].sort((a, b) => a.contentOrder - b.contentOrder)
        : []

      setCourseContents((prev) => ({
        ...prev,
        [moduleId]: sortedContents
      }))
    } catch (err) {
      console.error(`Failed to fetch contents for module ${moduleId}:`, err)
      setCourseContents((prev) => ({
        ...prev,
        [moduleId]: []
      }))
    } finally {
      setContentLoading(false)
    }
  }

  const onEnroll = async () => {
    setErrorMessage('')

    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    if (!userData || !token || userRole !== 'STUDENT') {
      setShowSignInPrompt(true)
      return
    }

    setEnrolling(true)

    try {
      const user = JSON.parse(userData)

      if (!user.studentId) {
        throw new Error('Invalid student information. Please sign in again.')
      }

      await enrollmentAPI.enrollInCourse(user.studentId, id)
      setEnrolled(true)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to enroll:', err)
      setErrorMessage(err.message || 'Failed to enroll in the course. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  const Badge = ({ text }) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0 12px',
        height: 30,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.2)',
        color: '#fff',
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: 0.4
      }}
    >
      {text}
    </span>
  )

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ maxWidth: 900, margin: '10vh auto', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <p>The course you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    )
  }

  const courseColor = course.color || '#6366f1'
  const courseThumbnail = course.thumbnail || '🎓'
  const courseCategory = course.category?.name || 'General'
  const courseLevel = course.level || 'Beginner'
  const courseDuration = course.duration || '6 weeks'
  const createdDate = course.createdAt ? new Date(course.createdAt).toLocaleDateString() : '—'
  const totalLessons = modules.reduce(
    (sum, module) => sum + (courseContents[module.moduleId]?.length || 0),
    0
  )
  const moduleSummary = moduleLoading
    ? 'Loading modules…'
    : modules.length === 0
      ? 'No modules published yet'
      : `${modules.length} ${modules.length === 1 ? 'module' : 'modules'} · ${totalLessons} ${totalLessons === 1 ? 'lesson' : 'lessons'}`

  const renderPrimaryCta = () => {
    if (!isLoggedIn) {
      return (
        <button
          style={{
            padding: '14px 28px',
            borderRadius: 16,
            border: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            background: '#1d4ed8',
            color: '#fff',
            boxShadow: '0 20px 40px rgba(29,78,216,0.25)',
            cursor: 'pointer'
          }}
          onClick={() => setShowSignInPrompt(true)}
        >
          Sign in to enroll
        </button>
      )
    }

    if (!enrolled) {
      return (
        <button
          style={{
            padding: '14px 28px',
            borderRadius: 16,
            border: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            background: '#4338ca',
            color: '#fff',
            boxShadow: '0 20px 40px rgba(67,56,202,0.25)',
            cursor: enrolling ? 'not-allowed' : 'pointer',
            opacity: enrolling ? 0.7 : 1
          }}
          onClick={onEnroll}
          disabled={enrolling}
        >
          {enrolling ? 'Enrolling…' : 'Enroll now'}
        </button>
      )
    }

    return (
      <button
        style={{
          padding: '14px 28px',
          borderRadius: 16,
          border: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          background: '#059669',
          color: '#fff',
          boxShadow: '0 20px 40px rgba(5,150,105,0.25)',
          cursor: 'pointer'
        }}
        onClick={() => navigate(`/course-player/${course.courseId}`)}
      >
        Continue learning
      </button>
    )
  }

  const stats = [
    { label: 'Level', value: courseLevel },
    { label: 'Duration', value: courseDuration },
    { label: 'Created', value: createdDate }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#eef1ff' }}>
      {showSuccess && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            background: '#10b981',
            color: 'white',
            padding: '16px 24px',
            borderRadius: 14,
            boxShadow: '0 20px 45px rgba(16,185,129,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 600
          }}
        >
          <span style={{ fontSize: 22 }}>✓</span>
          <span>Successfully enrolled in the course</span>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            background: '#dc2626',
            color: 'white',
            padding: '16px 24px',
            borderRadius: 14,
            boxShadow: '0 20px 45px rgba(220,38,38,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 600
          }}
        >
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div>
            <div>Enrollment failed</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 400 }}>{errorMessage}</div>
            <button
              onClick={() => setErrorMessage('')}
              style={{
                marginTop: 8,
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: 999,
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {showSignInPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15,23,42,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 24,
              maxWidth: 420,
              width: '90%',
              boxShadow: '0 40px 80px rgba(15,23,42,0.35)',
              textAlign: 'center'
            }}
          >
            {isLoggedIn ? (
              <>
                <h3 style={{ marginTop: 0, color: '#111827' }}>Please enroll first</h3>
                <p style={{ color: '#4b5563', marginBottom: 24 }}>
                  You need to enroll in this course before you can view its modules and lessons.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowSignInPrompt(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 12,
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#4b5563',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Not now
                  </button>
                  <button
                    onClick={() => {
                      setShowSignInPrompt(false)
                      onEnroll()
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 12,
                      border: 'none',
                      backgroundColor: '#4338ca',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Enroll now
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 0, color: '#111827' }}>Sign in required</h3>
                <p style={{ color: '#4b5563', marginBottom: 24 }}>Please sign in or create a new account to enroll in this course.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowSignInPrompt(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 12,
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#4b5563',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Not now
                  </button>
                  <button
                    onClick={() => navigate('/student/signin')}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 12,
                      border: 'none',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Sign in
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '48px 16px 64px', maxWidth: 1220 }}>
        <div
          style={{
            background: 'linear-gradient(120deg,#312e81 0%,#4338ca 45%,#a855f7 100%)',
            borderRadius: 36,
            padding: 40,
            marginBottom: 48,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(79,70,229,0.35)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 50%)',
              opacity: 0.4
            }}
          ></div>
          <div style={{ position: 'relative', zIndex: 2, display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            <div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                <Badge text={courseCategory} />
                <Badge text={courseLevel} />
                <Badge text={courseDuration} />
              </div>
              <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: 12 }}>{course.title}</h1>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.65, marginBottom: 28 }}>
                {course.description || 'Learn industry-ready skills with immersive lessons, guided projects, and mentor support.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {renderPrimaryCta()}
                <Link
                  to="/"
                  style={{
                    padding: '12px 22px',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.35)',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Back to catalog
                </Link>
              </div>
              {enrolled && (
                <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.85)' }}>You are already enrolled in this course.</p>
              )}
            </div>
            <div
              style={{
                background: '#fff',
                borderRadius: 28,
                padding: 28,
                color: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                boxShadow: '0 30px 60px rgba(15,23,42,0.25)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#4c1d95' }}>Course overview</span>
                <span style={{ fontSize: 13, color: '#6366f1' }}>{moduleSummary}</span>
              </div>
              <div style={{ borderRadius: 20, background: '#eef2ff', padding: 20, textAlign: 'center' }}>
                {course.thumbnail && course.thumbnail.startsWith('data:image') ? (
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', borderRadius: 18, objectFit: 'cover', maxHeight: 160 }} />
                ) : (
                  <div style={{ fontSize: 54 }}>{courseThumbnail}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {stats.map((stat) => (
                  <div key={stat.label} style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', color: '#94a3b8' }}>{stat.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(280px,1fr)', gap: 32 }}>
          <div>
            <div
              style={{
                background: '#fff',
                borderRadius: 32,
                padding: 32,
                marginBottom: 32,
                boxShadow: '0 35px 60px rgba(15,23,42,0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Curriculum overview</h2>
                  <p style={{ margin: '6px 0 0', color: '#6b7280' }}>{moduleSummary}</p>
                </div>
                <span style={{ background: '#eef2ff', color: '#4338ca', padding: '6px 14px', borderRadius: 999, fontWeight: 600 }}>
                  {modules.length || 0} modules
                </span>
              </div>
              <div style={{ height: 2, background: '#f3f4f6', marginBottom: 20 }}></div>
              {moduleLoading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p style={{ marginTop: 12, color: '#6b7280' }}>Fetching modules…</p>
                </div>
              ) : modules.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32, color: '#6b7280' }}>No modules available for this course yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {modules.map((module, index) => (
                    <div key={module.moduleId} style={{ display: 'flex', gap: 20 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: '#eef2ff',
                            color: '#4338ca',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {index + 1}
                        </div>
                        {index < modules.length - 1 && <div style={{ flexGrow: 1, width: 2, background: '#e5e7eb', marginTop: 6 }}></div>}
                      </div>
                      <div style={{ flexGrow: 1, padding: 22, borderRadius: 22, background: '#f5f5ff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{module.title}</h3>
                            <p style={{ margin: '6px 0 0', color: '#6b7280' }}>
                              {courseContents[module.moduleId]?.length || 0}{' '}
                              {courseContents[module.moduleId]?.length === 1 ? 'lesson' : 'lessons'}
                            </p>
                          </div>
                          <button
                            style={{
                              border: 'none',
                              background: '#4338ca',
                              color: '#fff',
                              padding: '8px 16px',
                              borderRadius: 14,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              if (enrolled) {
                                navigate(`/course-player/${course.courseId}`)
                              } else {
                                setShowSignInPrompt(true)
                              }
                            }}
                          >
                            View module
                          </button>
                        </div>
                        {courseContents[module.moduleId] && (
                          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                            {courseContents[module.moduleId].slice(0, 3).map((content) => (
                              <div key={content.contentId} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#4b5563' }}>
                                <span
                                  style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 12,
                                    background: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                    color: '#4338ca'
                                  }}
                                >
                                  {content.contentType === 'VIDEO' ? '▶' : content.contentType === 'QUIZ' ? '❓' : '📄'}
                                </span>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{content.title}</div>
                                  <div style={{ fontSize: 13, color: '#6b7280' }}>{content.contentType}</div>
                                </div>
                              </div>
                            ))}
                            {courseContents[module.moduleId].length > 3 && (
                              <div style={{ fontSize: 13, color: '#6b7280' }}>
                                + {courseContents[module.moduleId].length - 3} more items
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* What you'll learn section removed as requested */}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#fff', borderRadius: 28, padding: 28, boxShadow: '0 25px 60px rgba(15,23,42,0.08)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18 }}>Course information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 0.8 }}>Category</div>
                  <div style={{ fontWeight: 600 }}>{courseCategory}</div>
                </div>
                {course.status && (
                  <div>
                    <div style={{ fontSize: 12, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 0.8 }}>Status</div>
                    <div style={{ fontWeight: 600 }}>{course.status}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 0.8 }}>Created</div>
                  <div style={{ fontWeight: 600 }}>{createdDate}</div>
                </div>
                
              </div>
            </div>

            {instructor && (
              <div style={{ background: '#0f172a', color: '#fff', borderRadius: 28, padding: 28, boxShadow: '0 25px 60px rgba(15,23,42,0.35)' }}>
                <div style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#a5b4fc', marginBottom: 8 }}>Instructor</div>
                <h3 style={{ margin: 0 }}>{instructor.fullName || instructor.name}</h3>
                <p style={{ color: '#cbd5f5', marginTop: 12 }}>
                  {instructor.bio || 'Experienced instructor guiding students through practical labs and real-world case studies.'}
                </p>
                {instructor.specialization && <p style={{ marginTop: 12, color: '#a5b4fc' }}>{instructor.specialization}</p>}
              </div>
            )}

            {/* Need help card removed as requested */}
          </div>
        </div>
      </div>
    </div>
  )
}



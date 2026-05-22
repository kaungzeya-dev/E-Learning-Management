import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { courseAPI, enrollmentAPI, progressAPI } from '../../services/api.js'

export default function MyCourses() {
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [courseProgress, setCourseProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Function to fetch course progress data
  const fetchCourseProgress = async (studentId, courseId) => {
    try {
      console.log(`Fetching progress for course ${courseId} and student ${studentId}`);
      const progressData = await progressAPI.getStudentProgress(courseId, studentId);
      console.log(`Progress data for course ${courseId}:`, progressData);
      return progressData;
    } catch (error) {
      console.error(`Error fetching progress for course ${courseId}:`, error);
      return { progressPercentage: 0, completedModules: 0, totalModules: 0 };
    }
  };

  useEffect(() => {
    const loadEnrolledCourses = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Load user profile from localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          
          // Load enrolled courses if we have a studentId
          if (parsedUser.studentId) {
            try {
              // Try to get enrollments from API
              const enrollments = await enrollmentAPI.getEnrollmentsByStudentId(parsedUser.studentId)
              
              if (enrollments && enrollments.length > 0) {
                // Fetch full course details for each enrollment
                const coursesPromises = enrollments.map(enrollment => 
                  courseAPI.getCourseById(enrollment.courseId)
                )
                
                const enrolledCoursesData = await Promise.all(coursesPromises)
                setEnrolledCourses(enrolledCoursesData)
                
                // Fetch progress data for each course
                const progressData = {};
                for (const course of enrolledCoursesData) {
                  const progress = await fetchCourseProgress(parsedUser.studentId, course.courseId);
                  progressData[course.courseId] = progress;
                }
                setCourseProgress(progressData);
              }
            } catch (err) {
              console.error('Failed to fetch enrollments:', err)
              // Fall back to localStorage if API fails
              const storedEnrollments = localStorage.getItem('enrollments')
              if (storedEnrollments) {
                setEnrolledCourses(JSON.parse(storedEnrollments))
              }
            }
          }
        } else {
          // No user data found, redirect to login
          navigate('/student/signin')
        }
      } catch (err) {
        console.error('Error loading enrolled courses:', err)
        setError('Failed to load your courses. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    loadEnrolledCourses()
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa', paddingTop: 80 }}>
      <div className="container" style={{ paddingTop: 24, paddingBottom: 32 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* Page Title */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', borderRadius: 12, background: '#eef2ff', color: '#3b82f6', fontSize: 24 }}>📚</div>
                <div className="ms-3">
                  <h2 className="mb-0" style={{ lineHeight: 1.2 }}>My Courses</h2>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>Courses you've enrolled in</div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Link to="/" className="btn btn-outline-secondary" style={{ borderRadius: 8 }}>
                  <span className="me-2">🏠</span>
                  Back to Home
                </Link>
                <Link to="/accomplishments" className="btn btn-outline-primary" style={{ borderRadius: 8 }}>
                  <span className="me-2">🏆</span>
                  View Accomplishments
                </Link>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            
            {/* Error state */}
            {!loading && error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            {/* No courses state */}
            {!loading && !error && enrolledCourses.length === 0 && (
              <div className="text-center py-5" style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#d1d5db' }}>📚</div>
                <h4>No courses yet</h4>
                <p className="text-muted">You haven't enrolled in any courses yet.</p>
                <Link to="/" className="btn btn-primary mt-3" style={{ borderRadius: 10 }}>Browse Courses</Link>
              </div>
            )}
            
            {/* Course list */}
            {!loading && !error && enrolledCourses.length > 0 && (
              <div className="card" style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                <div className="card-body">
                  <h5 className="card-title mb-4">Your Learning Journey</h5>
                  
                  <div className="row g-4">
                    {enrolledCourses.map(course => (
                      <div key={course.courseId} className="col-12">
                        <div className="card" style={{ borderRadius: 16, border: '1px solid #e5e7eb' }}>
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                              <div className="d-flex align-items-center gap-3">
                                <div style={{ 
                                  width: 80, 
                                  height: 80, 
                                  borderRadius: 12, 
                                  overflow: 'hidden',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: '#4361ee'
                                }}>
                                  {course.thumbnail && course.thumbnail.startsWith('data:image') ? (
                                    <img 
                                      src={course.thumbnail} 
                                      alt={course.title}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                  ) : (
                                    <span style={{ fontSize: '2.5rem', color: 'white' }}>🎓</span>
                                  )}
                                </div>
                                <div>
                                  <div className="fw-bold" style={{ fontSize: '1.25rem', lineHeight: 1.2 }}>{course.title}</div>
                                  <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {course.instructor?.firstName} {course.instructor?.lastName} • {course.level} • {course.duration}
                                  </div>
                                </div>
                              </div>
                              <Link to={`/course-player/${course.courseId}`} className="btn btn-primary" style={{ borderRadius: 8, minWidth: '140px' }}>Continue Learning</Link>
                            </div>
                            
                            <div className="mt-4">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Progress</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                  {courseProgress[course.courseId] ? 
                                    `${courseProgress[course.courseId].progressPercentage.toFixed(0)}%` : 
                                    '0%'}
                                </div>
                              </div>
                              <div className="progress" style={{ height: 8, borderRadius: 999, background: '#e9edf2' }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ 
                                    width: courseProgress[course.courseId] ? 
                                      `${courseProgress[course.courseId].progressPercentage}%` : '0%', 
                                    backgroundColor: courseProgress[course.courseId]?.progressPercentage >= 100 ? 
                                      '#10b981' : '#4361ee' 
                                  }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                                <div>
                                  {courseProgress[course.courseId] && (
                                    <span className="badge bg-light text-dark">
                                      {courseProgress[course.courseId].completedModules} of {courseProgress[course.courseId].totalModules} modules
                                    </span>
                                  )}
                                  {courseProgress[course.courseId]?.progressPercentage >= 100 && (
                                    <span className="badge bg-success text-white ms-2">Completed</span>
                                  )}
                                </div>
                                
                                {/* Certificate View Button for completed courses */}
                                {courseProgress[course.courseId]?.progressPercentage >= 100 && (
                                  <Link 
                                    to={`/certificate/${course.courseId}`} 
                                    className="btn btn-sm btn-outline-success"
                                    style={{ borderRadius: 8 }}
                                  >
                                    <span className="me-1">🏆</span> View Certificate
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/StudentHome.css";
import { courseAPI, categoryAPI, enrollmentAPI } from "../../services/api.js";
import AuthModal from "../../components/auth/AuthModal";

// Categories will be fetched from the backend

export default function StudentHome() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({
    userType: 'student',
    mode: 'signin'
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openAuthModalWith = (config) => {
    setAuthModalConfig(config);
    setShowAuthModal(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setShowSignInDropdown(false);
  };

  const toggleMobileMenu = () => {
    setShowSignInDropdown(false);
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleAuthSelection = (userType, mode = 'signin') => {
    openAuthModalWith({ userType, mode });
    closeMobileMenu();
  };

  const navigateAndCloseMenu = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userData = localStorage.getItem("user");

    if (token && userRole === "STUDENT" && userData) {
      setIsLoggedIn(true);
      setStudent(JSON.parse(userData));
    }

    // Fetch courses and categories from API
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch categories first
        try {
          const categoriesData = await categoryAPI.getAllCategories();
          if (categoriesData && categoriesData.length > 0) {
            // Extract category names and add 'All' option
            const categoryNames = ['All', ...categoriesData.map(cat => cat.name)]
            console.log('Available categories:', categoryNames)
            setCategories(categoryNames)
          } else {
            console.warn('No categories data available from API')
          }
        } catch (err) {
          console.error("Failed to fetch categories:", err);
          // Keep default 'All' category if fetch fails
        }

        // Fetch courses
        const allCourses = await courseAPI.getAllCourses();

        if (allCourses && allCourses.length > 0) {
          // Filter published courses
          const publishedCourses = allCourses.filter(
            (c) => c.status === "Published"
          );

          // Map backend courses to frontend format with real data
          const mappedCourses = publishedCourses.map((course) => {
            // Get instructor name
            const instructorName = course.instructor
              ? `${course.instructor.firstName} ${course.instructor.lastName}`
              : "Instructor";

            // Get category name
            const categoryName = course.category?.name || 'General'
            
            // Log raw course data to debug category issues
            console.log(`Processing course: ${course.title}, categoryId: ${course.categoryId}, category object:`, course.category)
            
            return {
              id: course.courseId,
              title: course.title,
              instructor: instructorName,
              rating: course.rating || 4.5, // Use default rating if not available
              students: course.enrollmentCount || 0, // Use real enrollment count if available
              price: "Free", // Assuming all courses are free for now
              level: course.level || "Beginner",
              duration: course.duration || "6 weeks",
              category: categoryName,
              thumbnail: course.thumbnail,
              summary: course.description || ''
            }
          })
          
          // Log the mapped courses to see what we're working with
          console.log('Mapped courses with categories:', mappedCourses.map(c => ({ title: c.title, category: c.category })))
          
            // If logged in as a student, filter out courses the student already enrolled in
            let finalCourses = mappedCourses
            try {
              const token = localStorage.getItem('token')
              const userRole = localStorage.getItem('userRole')
              // Use the student from localStorage (set above) or current state
              const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
              const currentStudent = student || storedUser

              if (token && userRole === 'STUDENT' && currentStudent) {
                const studentId = currentStudent.id || currentStudent.studentId
                if (studentId) {
                  const enrollments = await enrollmentAPI.getEnrollmentsByStudentId(studentId)
                  const enrolledIds = new Set((enrollments || []).map(e => e.courseId))
                  finalCourses = mappedCourses.filter(c => !enrolledIds.has(c.id))
                }
              }
            } catch (enrErr) {
              console.warn('Failed to fetch enrollments for filtering:', enrErr)
            }

            setCourses(finalCourses)
          
          if (mappedCourses.length === 0) {
            setError(
              "No published courses found. Check back later for new courses."
            );
          }
        } else {
          setError(
            "No courses available at the moment. Please check back later."
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoggedIn, student?.studentId]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }
    if (isMobileMenuOpen) {
      document.body.style.setProperty('overflow', 'hidden');
    } else {
      document.body.style.removeProperty('overflow');
    }
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isMobileMenuOpen) {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowSignInDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    setIsLoggedIn(false)
    setStudent(null)
    closeMobileMenu()
    navigate('/')
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    // Fix category filtering - compare with the category name
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    
    // Debug info to help troubleshoot category filtering
    if (selectedCategory !== 'All' && course.category !== selectedCategory) {
      console.log(`Course '${course.title}' with category '${course.category}' doesn't match selected category '${selectedCategory}'`)
    }
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="student-home">
      {/* Navigation */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top ${
          isScrolled ? "navbar-scrolled" : ""
        }`}
      >
        <div className="container-fluid px-4">
          <a className="navbar-brand" href="/">
            <span className="brand-icon">🎓</span>
            LearnHub
          </a>
          <button
            className="navbar-toggler"
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="studentHomeNav"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={toggleMobileMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="studentHomeNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Navigation items removed for branch merging */}
            </ul>
            <div className="d-flex align-items-center gap-3">
              {isLoggedIn ? (
                <div className="user-dropdown-wrapper">
                  <div
                    className="user-profile-button"
                    onClick={() => setShowSignInDropdown(!showSignInDropdown)}
                  >
                    <div className="user-avatar">
                      <span>{student?.firstName?.charAt(0) || "H"}</span>
                    </div>
                    <span className="user-name d-none d-md-inline">
                      Hi, {student?.firstName || "Hello"}!
                    </span>
                  </div>

                  {showSignInDropdown && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-name">
                          {student?.firstName} {student?.lastName}
                        </div>
                        <div className="user-dropdown-email">
                          {student?.email}
                        </div>
                      </div>

                      <div className="user-dropdown-menu">
                        {/* Profile link removed */}

                        <Link
                          to="/student/settings"
                          className="dropdown-item"
                          onClick={() => setShowSignInDropdown(false)}
                        >
                          <span className="dropdown-item-icon">⚙️</span>{" "}
                          Settings
                        </Link>

                        <Link
                          to="/my-courses"
                          className="dropdown-item"
                          onClick={() => setShowSignInDropdown(false)}
                        >
                          <span className="dropdown-item-icon">📚</span> My
                          Courses
                        </Link>

                        <Link
                          to="/accomplishments"
                          className="dropdown-item"
                          onClick={() => setShowSignInDropdown(false)}
                        >
                          <span className="dropdown-item-icon">🏆</span>{" "}
                          Accomplishments
                        </Link>

                        <div className="dropdown-divider"></div>

                        <button
                          className="dropdown-item dropdown-item-logout"
                          onClick={() => {
                            handleLogout();
                            setShowSignInDropdown(false);
                          }}
                        >
                          <span className="dropdown-item-icon">🚪</span> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="signin-dropdown-wrapper">
                  <button
                    className="btn btn-signin-nav"
                    onClick={() => setShowSignInDropdown(!showSignInDropdown)}
                  >
                    Sign In
                    <span className="dropdown-arrow">
                      {showSignInDropdown ? "▲" : "▼"}
                    </span>
                  </button>
                  {showSignInDropdown && (
                    <div className="signin-dropdown">
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setShowSignInDropdown(false);
                          setAuthModalConfig({ userType: 'student', mode: 'signin' });
                          setShowAuthModal(true);
                        }}
                      >
                        <span className="item-icon">👨‍🎓</span>
                        Sign in as Student
                      </button>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setShowSignInDropdown(false);
                          setAuthModalConfig({ userType: 'instructor', mode: 'signin' });
                          setShowAuthModal(true);
                        }}
                      >
                        <span className="item-icon">👨‍🏫</span>
                        Sign in as Instructor
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Admin buttons removed for branch merging */}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <div
            className="mobile-menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <div className="mobile-menu-brand">
                <span className="brand-icon">🎓</span>
                <span>LearnHub</span>
              </div>
              <button
                className="mobile-menu-close"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
              >
                ×
              </button>
            </div>

            <div className="mobile-menu-auth">
              {isLoggedIn ? (
                <>
                  <div className="mobile-menu-user-card">
                    <div className="mobile-menu-user-avatar">
                      {student?.firstName?.charAt(0) || 'H'}
                    </div>
                    <div>
                      <div className="mobile-menu-user-name">
                        {student?.firstName} {student?.lastName}
                      </div>
                      <div className="mobile-menu-user-email">{student?.email}</div>
                    </div>
                  </div>
                  <div className="mobile-menu-actions">
                    <button
                      type="button"
                      onClick={() => navigateAndCloseMenu('/my-courses')}
                    >
                      📚 My Courses
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndCloseMenu('/accomplishments')}
                    >
                      🏆 Accomplishments
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateAndCloseMenu('/student/settings')}
                    >
                      ⚙️ Settings
                    </button>
                  </div>
                  <button
                    type="button"
                    className="mobile-menu-logout"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="mobile-menu-auth-buttons">
                  <button
                    type="button"
                    onClick={() => handleAuthSelection('student')}
                  >
                    👨‍🎓 Sign in as Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAuthSelection('instructor')}
                  >
                    👨‍🏫 Sign in as Instructor
                  </button>
                  <button
                    type="button"
                    className="mobile-menu-secondary"
                    onClick={() => handleAuthSelection('student', 'signup')}
                  >
                    Create a student account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section" id="hero">
        {/* Animated shapes */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              top: "-100px",
              right: "-50px",
              animation: "float 8s infinite ease-in-out",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              bottom: "-50px",
              left: "10%",
              animation: "float 10s infinite ease-in-out",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              top: "20%",
              left: "5%",
              animation: "float 7s infinite ease-in-out",
            }}
          ></div>
        </div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="hero-content">
                <div
                  style={{
                    marginBottom: "20px",
                    display: "inline-block",
                    background: "rgba(255,255,255,0.2)",
                    padding: "8px 16px",
                    borderRadius: "20px",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>✨</span>
                  <span style={{ fontWeight: 500 }}>Welcome to LearnHub</span>
                </div>
                <h1
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    marginBottom: "20px",
                    lineHeight: 1.2,
                  }}
                >
                  Learn <span style={{ color: "#4CC9F0" }}>Without Limits</span>
                </h1>
                <p
                  style={{
                    fontSize: "1.2rem",
                    marginBottom: "30px",
                    opacity: 0.9,
                    fontWeight: 300,
                    lineHeight: 1.6,
                  }}
                >
                  Discover top-quality courses taught by industry experts. Start
                  your learning journey today and unlock your potential.
                </p>
                <div className="search-container">
                  <div className="search-input-wrapper">
                    <div className="search-icon-container">
                      <i className="search-icon">🔍</i>
                    </div>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="What do you want to learn today?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="search-button">Search</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div style={{ position: "relative", textAlign: "center" }}>
                <div
                  style={{
                    position: "absolute",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: -1,
                  }}
                ></div>
                <img
                  src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4735.jpg"
                  alt="Learning illustration"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section className="section course-catalog" id="courses">
        <div className="container">
          {/* Quick Links */}
          <div className="row g-3 mb-3"></div>
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📚</span>
              {selectedCategory === "All" ? "All Courses" : selectedCategory}
            </h2>
          </div>

          {/* Categories */}
          <div className="categories-filter" id="categories-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-filter-btn ${
                  selectedCategory === cat ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                {selectedCategory === cat && (
                  <span className="active-indicator"></span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
              <h3>Oops!</h3>
              <p className="text-muted">{error}</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h3>No courses found</h3>
              <p className="text-muted">
                Try adjusting your search or browse different categories
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="col-12 col-sm-6 col-lg-4">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-icon">🎓</span>
              <span className="brand-name">LearnHub</span>
            </div>
            <p className="footer-copyright">
              © 2025 LearnHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal 
        show={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          // Check if user is logged in after modal closes
          const token = localStorage.getItem("token");
          const userRole = localStorage.getItem("userRole");
          const userData = localStorage.getItem("user");
          
          if (token && userRole === "STUDENT" && userData) {
            setIsLoggedIn(true);
            setStudent(JSON.parse(userData));
          }
        }}
        userType={authModalConfig.userType}
        mode={authModalConfig.mode}
        onModeChange={(newConfig) => setAuthModalConfig({ ...authModalConfig, ...newConfig })}
      />
    </div>
  );
}

// Course Card Component
function CourseCard({ course }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="card course-card"
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: isHovered
          ? "0 5px 15px rgba(0,0,0,0.08)"
          : "0 2px 6px rgba(0,0,0,0.04)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        transform: isHovered ? "translateY(-3px)" : "none",
        border: "1px solid #e5e7eb",
        height: "100%",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Course Thumbnail */}
        <div
          style={{
            position: "relative",
            height: "160px",
            overflow: "hidden",
            background:
              course.thumbnail && course.thumbnail.startsWith("data:image")
                ? "none"
                : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
          }}
        >
          {course.thumbnail && course.thumbnail.startsWith("data:image") ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.2s ease",
                transform: isHovered ? "scale(1.01)" : "scale(1)",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                fontSize: "3.5rem",
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                color: "white",
              }}
            >
              <span>{course.thumbnail || "🎓"}</span>
            </div>
          )}

          {/* Level Badge */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              zIndex: 2,
              background: "rgba(255,255,255,0.9)",
              color: "#333",
              padding: "5px 12px",
              borderRadius: "20px",
              fontWeight: 600,
              fontSize: "0.75rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              textTransform: "capitalize",
            }}
          >
            {course.level}
          </div>
        </div>

        {/* Card Content */}
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {/* Category */}
          <div
            style={{
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "4px",
                background: "#4361ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {course.category?.charAt(0) || "L"}
            </div>
            <span
              style={{ fontSize: "0.85rem", color: "#4361ee", fontWeight: 600 }}
            >
              {course.category || "General"}
            </span>
          </div>

          {/* Title */}
          <h5
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              marginBottom: "10px",
              lineHeight: 1.3,
              color: "#111827",
            }}
          >
            {course.title}
          </h5>

          {/* Specialization Tag */}
          <div style={{ marginBottom: "15px" }}>
            <span
              style={{
                fontSize: "0.85rem",
                color: "#6b7280",
              }}
            >
              Specialization
            </span>
          </div>

          {/* Course Duration */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "auto",
              paddingTop: "15px",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              <span style={{ marginRight: "5px" }}>⏱️</span>
              {course.duration || "6 weeks"}
            </span>
          </div>

          {/* Enroll Button */}
          <div
            style={{
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => navigate(`/enroll/${course.id}`)}
              style={{
                width: "100%",
                background: "#4361ee",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 0",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3a56d4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4361ee";
              }}
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import './AuthModal.css';

export default function AuthModal({ show, onClose, userType = 'student', mode = 'signin', onModeChange }) {
  const navigate = useNavigate();
  
  // Student signin state
  const [studentSignInForm, setStudentSignInForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Student signup state
  const [studentSignUpForm, setStudentSignUpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Instructor signin state
  const [instructorSignInForm, setInstructorSignInForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Instructor signup state
  const [instructorSignUpForm, setInstructorSignUpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    expertise: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Toggle between signin and signup
  const toggleMode = () => {
    setError('');
    // Update the mode directly through the parent component
    if (mode === 'signin') {
      if (typeof onModeChange === 'function') {
        onModeChange({ mode: 'signup', userType });
      }
    } else {
      if (typeof onModeChange === 'function') {
        onModeChange({ mode: 'signin', userType });
      }
    }
  };
  
  const handleStudentSignInChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentSignInForm({
      ...studentSignInForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleStudentSignUpChange = (e) => {
    const { name, value } = e.target;
    setStudentSignUpForm({
      ...studentSignUpForm,
      [name]: value
    });
  };
  
  const handleInstructorSignInChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInstructorSignInForm({
      ...instructorSignInForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleInstructorSignUpChange = (e) => {
    const { name, value } = e.target;
    setInstructorSignUpForm({
      ...instructorSignUpForm,
      [name]: value
    });
  };
  
  const handleStudentSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post(
        "/auth/student/login",
        {
          email: studentSignInForm.email,
          password: studentSignInForm.password,
        }
      );

      // Store token and user data
      const { token, student } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(student));
      localStorage.setItem("userRole", "STUDENT");

      // Close modal and navigate to home page
      onClose();
      navigate("/");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Invalid email or password";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStudentSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (studentSignUpForm.password !== studentSignUpForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (studentSignUpForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post(
        "/auth/student/signup",
        {
          firstName: studentSignUpForm.firstName,
          lastName: studentSignUpForm.lastName,
          email: studentSignUpForm.email,
          password: studentSignUpForm.password,
        }
      );

      // After successful signup, automatically log the user in
      try {
        const loginResponse = await apiClient.post(
          "/auth/student/login",
          {
            email: studentSignUpForm.email,
            password: studentSignUpForm.password,
          }
        );
        
        // Store token and user data
        const { token, student } = loginResponse.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(student));
        localStorage.setItem("userRole", "STUDENT");
        
        // Close modal and navigate to home page
        onClose();
        navigate("/");
        return;
      } catch (loginErr) {
        console.log("Auto-login after signup failed, switching to signin mode");
      }
      
      // If auto-login fails, switch to signin mode
      setError('');
      if (typeof onModeChange === 'function') {
        onModeChange({ mode: 'signin', userType: 'student' });
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInstructorSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post(
        "/auth/instructor/login",
        {
          email: instructorSignInForm.email,
          password: instructorSignInForm.password,
        }
      );

      // Store token and user data
      const { token, instructor } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(instructor));
      localStorage.setItem("userRole", "INSTRUCTOR");

      // Close modal and navigate to instructor dashboard
      onClose();
      navigate("/instructor/dashboard");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Invalid email or password";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInstructorSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (instructorSignUpForm.password !== instructorSignUpForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (instructorSignUpForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post(
        "/auth/instructor/signup",
        {
          firstName: instructorSignUpForm.firstName,
          lastName: instructorSignUpForm.lastName,
          email: instructorSignUpForm.email,
          bio: instructorSignUpForm.bio,
          expertise: instructorSignUpForm.expertise,
          password: instructorSignUpForm.password,
        }
      );

      // After successful signup, automatically log the user in
      try {
        const loginResponse = await apiClient.post(
          "/auth/instructor/login",
          {
            email: instructorSignUpForm.email,
            password: instructorSignUpForm.password,
          }
        );
        
        // Store token and user data
        const { token, instructor } = loginResponse.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(instructor));
        localStorage.setItem("userRole", "INSTRUCTOR");
        
        // Close modal and navigate to instructor dashboard
        onClose();
        navigate("/instructor/dashboard");
        return;
      } catch (loginErr) {
        console.log("Auto-login after signup failed, switching to signin mode");
      }
      
      // If auto-login fails, switch to signin mode
      setError('');
      if (typeof onModeChange === 'function') {
        onModeChange({ mode: 'signin', userType: 'instructor' });
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  if (!show) return null;
  
  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          <div className="auth-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">LearnHub</span>
          </div>
          
          {userType === 'student' && mode === 'signin' && (
            <>
              <h1 className="auth-title">Student Sign In</h1>
              <p className="auth-subtitle">Welcome back! Continue your learning journey</p>
            </>
          )}
          
          {userType === 'student' && mode === 'signup' && (
            <>
              <h1 className="auth-title">Create Student Account</h1>
              <p className="auth-subtitle">Start your learning journey today</p>
            </>
          )}
          
          {userType === 'instructor' && mode === 'signin' && (
            <>
              <h1 className="auth-title">Instructor Sign In</h1>
              <p className="auth-subtitle">Welcome back! Continue inspiring students</p>
            </>
          )}
          
          {userType === 'instructor' && mode === 'signup' && (
            <>
              <h1 className="auth-title">Become an Instructor</h1>
              <p className="auth-subtitle">Share your knowledge with the world</p>
            </>
          )}
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {/* Student Sign In Form */}
        {userType === 'student' && mode === 'signin' && (
          <form onSubmit={handleStudentSignIn} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={studentSignInForm.email}
                onChange={handleStudentSignInChange}
                placeholder="student@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={studentSignInForm.password}
                onChange={handleStudentSignInChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-footer">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={studentSignInForm.rememberMe}
                  onChange={handleStudentSignInChange}
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password?role=STUDENT" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}
        
        {/* Student Sign Up Form */}
        {userType === 'student' && mode === 'signup' && (
          <form onSubmit={handleStudentSignUp} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={studentSignUpForm.firstName}
                  onChange={handleStudentSignUpChange}
                  placeholder="John"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={studentSignUpForm.lastName}
                  onChange={handleStudentSignUpChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={studentSignUpForm.email}
                onChange={handleStudentSignUpChange}
                placeholder="student@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={studentSignUpForm.password}
                onChange={handleStudentSignUpChange}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={studentSignUpForm.confirmPassword}
                onChange={handleStudentSignUpChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
        
        {/* Instructor Sign In Form */}
        {userType === 'instructor' && mode === 'signin' && (
          <form onSubmit={handleInstructorSignIn} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={instructorSignInForm.email}
                onChange={handleInstructorSignInChange}
                placeholder="instructor@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={instructorSignInForm.password}
                onChange={handleInstructorSignInChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-footer">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={instructorSignInForm.rememberMe}
                  onChange={handleInstructorSignInChange}
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password?role=INSTRUCTOR" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}
        
        {/* Instructor Sign Up Form */}
        {userType === 'instructor' && mode === 'signup' && (
          <form onSubmit={handleInstructorSignUp} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={instructorSignUpForm.firstName}
                  onChange={handleInstructorSignUpChange}
                  placeholder="John"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={instructorSignUpForm.lastName}
                  onChange={handleInstructorSignUpChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={instructorSignUpForm.email}
                onChange={handleInstructorSignUpChange}
                placeholder="instructor@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={instructorSignUpForm.bio}
                onChange={handleInstructorSignUpChange}
                placeholder="Tell us about yourself and your teaching experience"
                rows="3"
                required
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expertise">Area of Expertise</label>
              <input
                id="expertise"
                name="expertise"
                type="text"
                value={instructorSignUpForm.expertise}
                onChange={handleInstructorSignUpChange}
                placeholder="e.g., Web Development, Data Science"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={instructorSignUpForm.password}
                onChange={handleInstructorSignUpChange}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={instructorSignUpForm.confirmPassword}
                onChange={handleInstructorSignUpChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
        
        <div className="auth-switch">
          {mode === 'signin' ? (
            <>Don't have an account? <button type="button" onClick={toggleMode} className="auth-switch-btn">Sign up</button></>
          ) : (
            <>Already have an account? <button type="button" onClick={toggleMode} className="auth-switch-btn">Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
}

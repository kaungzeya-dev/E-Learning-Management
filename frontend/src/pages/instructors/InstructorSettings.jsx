
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/StudentHome.css";
import { instructorAPI } from "../../services/api.js";

export default function InstructorSettings() {
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingProfile, setPendingProfile] = useState({ firstName: '', lastName: '', email: '', bio: '', expertise: '' });

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (!userRaw) {
      navigate("/instructor/signin");
      return;
    }
    try {
      const u = JSON.parse(userRaw);
      setInstructor(u);
      setFirstName(u.firstName || "");
      setLastName(u.lastName || "");
      setEmail(u.email || "");
      setBio(u.bio || "");
      setExpertise(u.expertise || "");
      if (token && userRole === "INSTRUCTOR" && userRaw) {
        setIsLoggedIn(true);
      }
    } catch {
      navigate("/instructor/signin");
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!instructor?.id && !instructor?.instructorId && !instructor?._id) {
      setError("Missing instructor id in local storage");
      return;
    }
    // If profile or email changed, show confirmation box
    if (
      firstName !== (instructor?.firstName || "") ||
      lastName !== (instructor?.lastName || "") ||
      email !== (instructor?.email || "") ||
      bio !== (instructor?.bio || "") ||
      expertise !== (instructor?.expertise || "")
    ) {
      setPendingProfile({ firstName, lastName, email, bio, expertise });
      setShowConfirm(true);
      return;
    }
    // If no changes, do nothing
    return;
  };

  // Confirm and actually update profile/email
  const confirmProfileChange = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const id = instructor.id || instructor.instructorId || instructor._id;
      await apiClient.put(`/instructors/${id}`, {
        firstName: pendingProfile.firstName,
        lastName: pendingProfile.lastName,
        email: pendingProfile.email,
        bio: pendingProfile.bio,
        expertise: pendingProfile.expertise
      });
      // Remove user info and redirect immediately
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      setShowConfirm(false);
      navigate("/instructor/signin", {
        state: {
          message: "If you change your profile or email, you have to sign in again."
        }
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    // Check if confirmation text matches
    if (deleteConfirmText !== "DELETE") {
      setError("Please type DELETE to confirm account deletion");
      return;
    }
    
    if (!instructor?.id && !instructor?.instructorId) {
      setError("Missing instructor id in local storage");
      return;
    }
    
    setDeleteLoading(true);
    setError("");
    
    try {
      const id = instructor.id || instructor.instructorId;
      await instructorAPI.deleteInstructor(id);
      
      // Clear all local storage data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      
      // Redirect to home page with a message
      navigate("/", { 
        state: { 
          message: "Your instructor account has been successfully deleted. We're sorry to see you go!" 
        } 
      });
    } catch (err) {
      setError(err?.message || "Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  };
  
  const toggleDeleteConfirm = () => {
    setShowDeleteConfirm(!showDeleteConfirm);
    setDeleteConfirmText("");
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa" }}>
      {/* Instructor navbar */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top ${
          isScrolled ? "navbar-scrolled" : ""
        }`}
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <div className="container-fluid px-4">
          <a className="navbar-brand" href="/instructor/dashboard">
            <span className="brand-icon">🎓</span>
            LearnHub
          </a>
        </div>
      </nav>

      <main
        className="container"
        style={{ paddingTop: 96, paddingBottom: 32 }}
      >
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="mt-5">Instructor Settings</h2>
                <small className="text-muted">
                  Manage your profile and account settings
                </small>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}

            <div className="row g-4">
              <div className="col-12 col-xl-8">
                <div
                  className="card"
                  style={{
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title mb-3">Profile</h5>
                    <p className="text-muted mb-4" style={{ fontSize: 14 }}>
                      Update your profile information. Your profile is visible to students enrolled in your courses.
                    </p>
                    <form onSubmit={saveProfile}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="firstName" className="form-label">
                            First name
                          </label>
                          <input
                            id="firstName"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="lastName" className="form-label">
                            Last name
                          </label>
                          <input
                            id="lastName"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="email" className="form-label">
                            Email address
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="bio" className="form-label">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            className="form-control"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            placeholder="Tell students about yourself"
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="expertise" className="form-label">
                            Expertise
                          </label>
                          <input
                            id="expertise"
                            className="form-control"
                            value={expertise}
                            onChange={(e) => setExpertise(e.target.value)}
                            placeholder="e.g. Web Development, Data Science, etc."
                          />
                        </div>
                      </div>
                      <div className="mt-4 d-flex gap-2">
                        {/* Hide Save Changes button when confirmation box is shown */}
                        {!showConfirm && (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                              loading ||
                              (
                                firstName === (instructor?.firstName || "") &&
                                lastName === (instructor?.lastName || "") &&
                                email === (instructor?.email || "") &&
                                bio === (instructor?.bio || "") &&
                                expertise === (instructor?.expertise || "")
                              )
                            }
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        )}
                        {/* Confirmation modal/box for profile change */}
                        {showConfirm ? (
                          <div className="alert alert-warning mt-3 p-4 d-flex flex-column align-items-start" style={{ zIndex: 10, minWidth: 320, maxWidth: 400 }}>
                            <h6 className="alert-heading mb-2">Are you sure you want to change your profile or email?</h6>
                            <p className="mb-3" style={{ fontSize: 15 }}>
                              If you change your profile or email, you have to sign in again.<br />
                              Click <strong>Save Changes</strong> below to confirm and continue.
                            </p>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-danger px-4"
                                onClick={confirmProfileChange}
                                disabled={loading}
                              >
                                {loading ? "Saving..." : "Save Changes"}
                              </button>
                              <button
                                className="btn btn-outline-secondary px-4"
                                onClick={() => setShowConfirm(false)}
                                disabled={loading}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : null}
                        {/* Hide Reset button when confirmation box is shown */}
                        {!showConfirm && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setFirstName(instructor?.firstName || "");
                              setLastName(instructor?.lastName || "");
                              setEmail(instructor?.email || "");
                              setBio(instructor?.bio || "");
                              setExpertise(instructor?.expertise || "");
                            }}
                            disabled={loading}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="card mb-4" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <h6 className="card-title">Security</h6>
                    <p className="text-muted" style={{ fontSize: 14 }}>
                      Change your password using the recovery flow.
                    </p>
                    <Link
                      to="/forgot-password?role=INSTRUCTOR"
                      className="btn btn-outline-primary w-100"
                    >
                      Change password
                    </Link>
                  </div>
                </div>

                {/* Delete Account Card */}
                <div className="card mt-4" style={{ borderRadius: 16, borderColor: showDeleteConfirm ? '#dc3545' : null }}>
                  <div className="card-body">
                    <h6 className="card-title text-danger">Delete Account</h6>
                    <p className="text-muted" style={{ fontSize: 14 }}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button 
                        onClick={toggleDeleteConfirm}
                        className="btn btn-outline-danger w-100"
                      >
                        Delete Account
                      </button>
                    ) : (
                      <div>
                        <div className="alert alert-danger" role="alert">
                          <h6 className="alert-heading">Warning: This action cannot be undone!</h6>
                          <p className="mb-0" style={{ fontSize: 14 }}>
                            Deleting your account will permanently remove all your data, including:
                          </p>
                          <ul className="mt-2 mb-0" style={{ fontSize: 14 }}>
                            <li>All your courses</li>
                            <li>Course content and materials</li>
                            <li>Student enrollments in your courses</li>
                            <li>Personal information</li>
                          </ul>
                        </div>
                        
                        <div className="form-group mt-3">
                          <label htmlFor="deleteConfirm" className="form-label">
                            Type <strong>DELETE</strong> to confirm:
                          </label>
                          <input
                            id="deleteConfirm"
                            className="form-control"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="DELETE"
                          />
                        </div>
                        
                        <div className="d-flex gap-2 mt-3">
                          <button
                            onClick={handleDeleteAccount}
                            className="btn btn-danger flex-grow-1"
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting..." : "Confirm Delete"}
                          </button>
                          <button
                            onClick={toggleDeleteConfirm}
                            className="btn btn-outline-secondary"
                            disabled={deleteLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

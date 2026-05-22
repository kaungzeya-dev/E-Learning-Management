import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CourseProgressCard from '../../components/CourseProgressCard';
import BadgeDisplay from '../../components/BadgeDisplay';
import CertificatesList from '../../components/CertificatesList';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState([]);
  const [badges, setBadges] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activeTab, setActiveTab] = useState('progress');

  useEffect(() => {
    // Get student ID from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.studentId) {
        setStudentId(user.studentId);
        setStudentName(`${user.firstName || ''} ${user.lastName || ''}`);
        fetchStudentData(user.studentId);
      } else {
        // Not logged in as student, redirect to login
        navigate('/login');
      }
    } else {
      // Not logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const fetchStudentData = async (id) => {
    setLoading(true);
    try {
      // Fetch course progress
      const progressResponse = await fetch(`http://localhost:8080/api/progress/student/${id}`);
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setCourseProgress(progressData);
      }

      // Fetch badges
      const badgesResponse = await fetch(`http://localhost:8080/api/badges/student/${id}`);
      if (badgesResponse.ok) {
        const badgesData = await badgesResponse.json();
        setBadges(badgesData);
      }

      // Fetch certificates
      const certificatesResponse = await fetch(`http://localhost:8080/api/certificates/student/${id}`);
      if (certificatesResponse.ok) {
        const certificatesData = await certificatesResponse.json();
        setCertificates(certificatesData);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Student Dashboard</h2>
              <p className="text-muted">Welcome back, {studentName || 'Student'}</p>
            </div>
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Course Progress
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges {badges.length > 0 && <span className="badge bg-primary ms-1">{badges.length}</span>}
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            Certificates {certificates.length > 0 && <span className="badge bg-primary ms-1">{certificates.length}</span>}
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Course Progress Tab */}
        <div className={`tab-pane fade ${activeTab === 'progress' ? 'show active' : ''}`}>
          <div className="row">
            <div className="col-12">
              <h4 className="mb-3">Your Course Progress</h4>
              
              {courseProgress.length === 0 ? (
                <div className="alert alert-info">
                  <p className="mb-0">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses" className="btn btn-sm btn-primary mt-2">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                courseProgress.map((progress) => (
                  <CourseProgressCard key={progress.courseId} progress={progress} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Badges Tab */}
        <div className={`tab-pane fade ${activeTab === 'badges' ? 'show active' : ''}`}>
          <div className="row">
            <div className="col-12">
              <h4 className="mb-3">Your Badges</h4>
              <BadgeDisplay badges={badges} />
            </div>
          </div>
        </div>

        {/* Certificates Tab */}
        <div className={`tab-pane fade ${activeTab === 'certificates' ? 'show active' : ''}`}>
          <div className="row">
            <div className="col-12">
              <h4 className="mb-3">Your Certificates</h4>
              <CertificatesList certificates={certificates} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

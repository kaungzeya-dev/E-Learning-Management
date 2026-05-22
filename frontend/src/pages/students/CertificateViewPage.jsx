import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CertificateView from '../../components/CertificateView';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { progressAPI, certificateAPI } from '../../services/api.js';

const CertificateViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('Please log in to view your certificate');
      }
      
      const user = JSON.parse(userData);
      if (!user.studentId) {
        throw new Error('Student information not found');
      }
      
      // First check if the course is completed
      try {
        const progressData = await progressAPI.getStudentProgress(id, user.studentId);
        console.log('Progress data for certificate:', progressData);
        setCourseProgress(progressData);
        
        // If course is not completed, show error
        if (!progressData || progressData.progressPercentage < 100) {
          throw new Error('You need to complete the course before viewing the certificate');
        }
      } catch (progressErr) {
        console.error('Error checking course progress:', progressErr);
        throw new Error('Unable to verify course completion status');
      }
      
      // Try to fetch existing certificate
      try {
        const existingCertificate = await certificateAPI.getCertificateByCourseAndStudent(id, user.studentId);
        console.log('Existing certificate check:', existingCertificate);
        
        if (existingCertificate) {
          console.log('Found existing certificate:', existingCertificate);
          setCertificate(existingCertificate);
          return;
        }
      } catch (certErr) {
        console.error('Error fetching existing certificate:', certErr);
      }
      
      // If no certificate exists, try to generate one
      setGeneratingCertificate(true);
      try {
        console.log(`Generating certificate for student ${user.studentId} and course ${id}`);
        const generatedCert = await certificateAPI.generateCertificate(id, user.studentId);
        console.log('Generated certificate:', generatedCert);
        setCertificate(generatedCert);
      } catch (genErr) {
        console.error('Error generating certificate:', genErr);
        throw new Error('Failed to generate certificate. Please try again later.');
      } finally {
        setGeneratingCertificate(false);
      }
    } catch (err) {
      console.error('Error in certificate process:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {generatingCertificate && (
          <div className="mt-3">
            <p>Generating your certificate...</p>
            <p className="text-muted small">This may take a moment</p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex gap-2">
            <button 
              className="btn btn-warning" 
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchCertificate();
              }}
            >
              Try Again
            </button>
            <Link to="/accomplishments" className="btn btn-primary">
              Back to Accomplishments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Download certificate as PDF using html2canvas and jsPDF
  const downloadCertificate = async () => {
    const certElem = document.querySelector('.certificate-container');
    if (!certElem) {
      alert('Certificate view not found.');
      return;
    }
    const canvas = await html2canvas(certElem, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [certElem.offsetWidth, certElem.offsetHeight] });
    pdf.addImage(imgData, 'PNG', 0, 0, certElem.offsetWidth, certElem.offsetHeight);
    const safeTitle = (certificate?.courseTitle || 'certificate').replace(/[^a-z0-9]+/gi,'-').toLowerCase();
    pdf.save(`${safeTitle}-certificate.pdf`);
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <Link to="/accomplishments" className="btn btn-outline-secondary mb-3">
              &larr; Back to Accomplishments
            </Link>
            <h2>Certificate of Completion</h2>
            <p className="text-muted">
              Congratulations on completing the course!
            </p>
          </div>
          <button className="btn btn-primary" onClick={downloadCertificate} disabled={!certificate}>
            Download Certificate
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <CertificateView certificate={certificate} />
        </div>
      </div>
    </div>
  );
};

export default CertificateViewPage;

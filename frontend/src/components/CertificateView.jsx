import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import 'bootstrap/dist/css/bootstrap.min.css';

const CertificateView = ({ certificate }) => {
  const certificateRef = useRef();
  
  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
  });

  if (!certificate) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Course Completion Certificate</h5>
        {/* Print button removed, only Download in parent */}
      </div>
      
      <div className="card-body p-4">
        <div 
          ref={certificateRef} 
          className="certificate-container border border-2 p-5 text-center"
          style={{
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Certificate Header */}
          <div className="mb-4">
            <h2 className="mb-0" style={{ fontFamily: 'serif', color: '#2c3e50' }}>Certificate of Completion</h2>
            <p className="text-muted">This is to certify that</p>
          </div>
          
          {/* Student Name */}
          <h3 className="mb-4" style={{ fontFamily: 'cursive', color: '#2c3e50' }}>
            {certificate.studentName}
          </h3>
          
          {/* Certificate Text */}
          <p className="mb-4">
            has successfully completed the course
          </p>
          
          {/* Course Title */}
          <h4 className="mb-4" style={{ fontFamily: 'serif', color: '#2c3e50' }}>
            "{certificate.courseTitle}"
          </h4>
          
          {/* Issue Date */}
          <p className="mb-4">
            Issued on {new Date(certificate.issueDate).toLocaleDateString()}
          </p>
          
          {/* Instructor and Platform (moved into signature area below) */}

          {/* Certificate ID */}
          <div className="certificate-id mb-4">
            <small className="text-muted">Certificate ID: {certificate.uniqueCode}</small>
          </div>
          
          {/* Signature */}
          <div className="row mt-5">
            <div className="col-6 text-center">
              <p style={{ marginBottom: 8, fontWeight: 700 }}>{certificate.instructorName || 'Teacher Testing'}</p>
              <div className="signature-line" style={{ borderTop: '1px solid #2c3e50', width: '80%', margin: '0 auto' }}></div>
              <p style={{ marginTop: 8, color: '#6c757d' }}>Instructor</p>
            </div>
            <div className="col-6 text-center">
              <p style={{ marginBottom: 8, fontWeight: 700 }}>{certificate.platformName || 'LearnHub'}</p>
              <div className="signature-line" style={{ borderTop: '1px solid #2c3e50', width: '80%', margin: '0 auto' }}></div>
              <p style={{ marginTop: 8, color: '#6c757d' }}>Platform</p>
            </div>
          </div>
          
          {/* Watermark */}
          <div 
            className="watermark" 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              fontSize: '8rem',
              opacity: '0.05',
              color: '#000',
              fontWeight: 'bold',
              pointerEvents: 'none',
              zIndex: 0
            }}
          >
            CERTIFIED
          </div>
        </div>
      </div>
      
      <div className="card-footer bg-light">
        <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted" style={{ display: 'block', overflowWrap: 'anywhere' }}>
              This certificate can be verified at:{' '}
              <a href={`${window.location.origin}/verify-certificate/${certificate.uniqueCode}`} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all' }}>
                {window.location.origin}/verify-certificate/{certificate.uniqueCode}
              </a>
            </small>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;

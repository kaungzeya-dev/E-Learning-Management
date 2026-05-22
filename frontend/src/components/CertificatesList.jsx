import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CertificatesList = ({ certificates }) => {
  if (!certificates || certificates.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <div className="text-muted">
            <i className="bi bi-file-earmark-text" style={{ fontSize: '2rem' }}></i>
            <p className="mt-3">No certificates earned yet</p>
            <p className="small">Complete courses to earn certificates!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <h5 className="mb-0">Your Certificates</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Course</th>
                <th>Issue Date</th>
                <th>Certificate ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((certificate) => (
                <tr key={certificate.certificateId}>
                  <td>{certificate.courseTitle}</td>
                  <td>{new Date(certificate.issueDate).toLocaleDateString()}</td>
                  <td>
                    <span className="badge bg-light text-dark">
                      {certificate.uniqueCode}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to={`/certificate/${certificate.certificateId}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      View
                    </Link>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        // Create a shareable link
                        const shareUrl = `${window.location.origin}/verify-certificate/${certificate.uniqueCode}`;
                        navigator.clipboard.writeText(shareUrl);
                        alert('Certificate verification link copied to clipboard!');
                      }}
                    >
                      Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CertificatesList;

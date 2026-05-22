import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { certificateAPI } from '../../services/api.js';

const VerifyCertificate = () => {
  const { code } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCode, setSearchCode] = useState(code || '');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (code) {
      verifyCertificate(code);
    } else {
      setLoading(false);
    }
  }, [code]);

  const verifyCertificate = async (certCode) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await certificateAPI.verifyCertificate(certCode.trim());
      if (!data) throw new Error('Certificate not found or invalid');
      setCertificate(data);
      setVerified(true);
    } catch (err) {
      console.error('Error verifying certificate:', err);
      // Create a friendly, user-facing message based on error shape/status
      let friendly = 'An unexpected error occurred. Please try again later.';
      const resp = err && err.response ? err.response : null;
      if (resp && resp.status) {
        const status = resp.status;
        if (status === 404) {
          friendly = 'Certificate not found. Please check the certificate code and try again.';
        } else if (status === 400) {
          friendly = 'Invalid certificate code. Please verify the code format and try again.';
        } else if (status >= 500) {
          friendly = 'Server error while verifying the certificate. Please try again later.';
        } else {
          friendly = `Verification failed (code ${status}). Please try again.`;
        }
      } else if (err && err.message && err.message.toLowerCase().includes('network')) {
        friendly = 'Network error. Please check your connection and try again.';
      }
      setError(friendly);
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchCode.trim()) {
      verifyCertificate(searchCode.trim());
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h2>Certificate Verification</h2>
          <p className="text-muted">
            Verify the authenticity of a course completion certificate
          </p>
        </div>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter certificate code (e.g., CERT-ABC123XYZ)"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Verifying...
                      </>
                    ) : 'Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {loading && !error && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Verifying certificate...</p>
        </div>
      )}

      {error && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger">
              <h4 className="alert-heading">Verification Failed</h4>
              <p className="mb-2">{error}</p>
              <ul className="mb-0">
                <li>Double-check the certificate code you entered.</li>
                <li>Try again after a moment.</li>
                <li>If the problem persists, contact support.</li>
              </ul>
              <hr />
              <p className="mb-0 small text-muted">Need help? Email <a href="mailto:support@learnhub.example">support@learnhub.example</a></p>
            </div>
          </div>
        </div>
      )}

      {verified && certificate && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-success mb-4">
              <h4 className="alert-heading">Certificate Verified!</h4>
              <p>This certificate is valid and was issued by our platform.</p>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <p className="mb-1"><strong>Certificate ID:</strong> {certificate.uniqueCode}</p>
                <p className="mb-1"><strong>Student:</strong> {certificate.studentName || '—'}</p>
                <p className="mb-1"><strong>Course:</strong> {certificate.courseTitle || '—'}</p>
                <p className="mb-0"><strong>Issued:</strong> {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : '—'}</p>
                <hr />
                <p className="text-muted mb-0">The full certificate view is hidden for verification. Use the certificate ID to reference this verification.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;

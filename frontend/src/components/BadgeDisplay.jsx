import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BadgeDisplay = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <div className="text-muted">
            <i className="bi bi-award" style={{ fontSize: '2rem' }}></i>
            <p className="mt-3">No badges earned yet</p>
            <p className="small">Complete courses to earn badges!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <h5 className="mb-0">Your Badges</h5>
      </div>
      <div className="card-body">
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
          {badges.map((badge) => (
            <div key={badge.userBadgeId} className="col text-center">
              <div 
                className="badge-item p-3 rounded-3 mb-2" 
                style={{ 
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef'
                }}
              >
                <div className="badge-icon mb-2">
                  {badge.badgeIconUrl ? (
                    <img 
                      src={badge.badgeIconUrl} 
                      alt={badge.badgeName} 
                      style={{ width: '64px', height: '64px' }}
                    />
                  ) : (
                    <div 
                      className="placeholder-icon d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '64px', 
                        height: '64px', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '50%',
                        margin: '0 auto'
                      }}
                    >
                      <i className="bi bi-award" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
                    </div>
                  )}
                </div>
                <h6 className="badge-name">{badge.badgeName}</h6>
                <p className="badge-desc small text-muted">{badge.badgeDescription}</p>
                <div className="badge-date small text-muted">
                  Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeDisplay;

import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CourseProgressCard = ({ progress }) => {
  // Format percentage to 1 decimal place
  const formattedPercentage = progress.progressPercentage.toFixed(1);
  
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{progress.courseTitle}</h5>
          {progress.certificateIssued && (
            <span className="badge bg-success">Certificate Issued</span>
          )}
        </div>
        
        <div className="progress mb-3" style={{ height: '10px' }}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ 
              width: `${progress.progressPercentage}%`,
              backgroundColor: progress.progressPercentage >= 100 ? '#28a745' : '#007bff'
            }} 
            aria-valuenow={progress.progressPercentage} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
        
        <div className="d-flex justify-content-between">
          <span className="text-muted">Progress: {formattedPercentage}%</span>
          <span className="text-muted">
            {progress.completedModules} of {progress.totalModules} modules completed
          </span>
        </div>
        
        <div className="mt-3">
          <Link 
            to={`/course-player/${progress.courseId}`} 
            className="btn btn-primary btn-sm me-2"
          >
            Continue Learning
          </Link>
          
          {progress.certificateIssued && (
            <Link 
              to={`/certificates/${progress.courseId}`} 
              className="btn btn-outline-success btn-sm"
            >
              View Certificate
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseProgressCard;

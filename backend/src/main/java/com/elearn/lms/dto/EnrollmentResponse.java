package com.elearn.lms.dto;

import java.time.LocalDateTime;

public class EnrollmentResponse {
    
    private Long enrollmentId;
    private Long studentId;
    private Long courseId;
    private LocalDateTime enrollmentDate;
    private String completionStatus;

    // Constructors
    public EnrollmentResponse() {
    }

    public EnrollmentResponse(Long enrollmentId, Long studentId, Long courseId, 
                            LocalDateTime enrollmentDate, String completionStatus) {
        this.enrollmentId = enrollmentId;
        this.studentId = studentId;
        this.courseId = courseId;
        this.enrollmentDate = enrollmentDate;
        this.completionStatus = completionStatus;
    }

    // Getters and Setters
    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Long enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public LocalDateTime getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDateTime enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public String getCompletionStatus() {
        return completionStatus;
    }

    public void setCompletionStatus(String completionStatus) {
        this.completionStatus = completionStatus;
    }
}

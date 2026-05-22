package com.elearn.lms.dto;

import com.elearn.lms.entity.Certificate;
import java.time.LocalDateTime;

public class CertificateResponse {
    private Long certificateId;
    private Long enrollmentId;
    private Long studentId;
    private Long courseId;
    private String courseTitle;
    private String studentName;
    private LocalDateTime issueDate;
    private String uniqueCode;
    private String instructorName;
    private String platformName;

    // Constructors
    public CertificateResponse() {
    }

    public CertificateResponse(Long certificateId, Long enrollmentId, Long studentId, Long courseId,
                              String courseTitle, String studentName, LocalDateTime issueDate, String uniqueCode) {
        this.certificateId = certificateId;
        this.enrollmentId = enrollmentId;
        this.studentId = studentId;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.studentName = studentName;
        this.issueDate = issueDate;
        this.uniqueCode = uniqueCode;
    }

    public CertificateResponse(Certificate certificate) {
        this.certificateId = certificate.getCertificateId();
        this.enrollmentId = certificate.getEnrollmentId();
        this.studentId = certificate.getStudentId();
        this.courseId = certificate.getCourseId();
        this.issueDate = certificate.getIssueDate();
        this.uniqueCode = certificate.getUniqueCode();
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getPlatformName() {
        return platformName;
    }

    public void setPlatformName(String platformName) {
        this.platformName = platformName;
    }

    // Getters and Setters
    public Long getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(Long certificateId) {
        this.certificateId = certificateId;
    }

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

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public LocalDateTime getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDateTime issueDate) {
        this.issueDate = issueDate;
    }

    public String getUniqueCode() {
        return uniqueCode;
    }

    public void setUniqueCode(String uniqueCode) {
        this.uniqueCode = uniqueCode;
    }
}

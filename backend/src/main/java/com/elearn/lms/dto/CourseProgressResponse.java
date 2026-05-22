package com.elearn.lms.dto;

import java.util.List;

public class CourseProgressResponse {
    private Long courseId;
    private String courseTitle;
    private Long studentId;
    private int totalModules;
    private int completedModules;
    private double progressPercentage;
    private List<ModuleProgressResponse> moduleProgress;
    private boolean certificateEligible;
    private boolean certificateIssued;

    // Constructors
    public CourseProgressResponse() {
    }

    public CourseProgressResponse(Long courseId, String courseTitle, Long studentId, int totalModules, 
                                 int completedModules, double progressPercentage, 
                                 List<ModuleProgressResponse> moduleProgress, 
                                 boolean certificateEligible, boolean certificateIssued) {
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.studentId = studentId;
        this.totalModules = totalModules;
        this.completedModules = completedModules;
        this.progressPercentage = progressPercentage;
        this.moduleProgress = moduleProgress;
        this.certificateEligible = certificateEligible;
        this.certificateIssued = certificateIssued;
    }

    // Getters and Setters
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

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public int getTotalModules() {
        return totalModules;
    }

    public void setTotalModules(int totalModules) {
        this.totalModules = totalModules;
    }

    public int getCompletedModules() {
        return completedModules;
    }

    public void setCompletedModules(int completedModules) {
        this.completedModules = completedModules;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public List<ModuleProgressResponse> getModuleProgress() {
        return moduleProgress;
    }

    public void setModuleProgress(List<ModuleProgressResponse> moduleProgress) {
        this.moduleProgress = moduleProgress;
    }

    public boolean isCertificateEligible() {
        return certificateEligible;
    }

    public void setCertificateEligible(boolean certificateEligible) {
        this.certificateEligible = certificateEligible;
    }

    public boolean isCertificateIssued() {
        return certificateIssued;
    }

    public void setCertificateIssued(boolean certificateIssued) {
        this.certificateIssued = certificateIssued;
    }
}

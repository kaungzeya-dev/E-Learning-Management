package com.elearn.lms.dto;

public class AdminAnalyticsResponse {
    private Long totalStudents;
    private Long totalInstructors;
    private Long totalAdmins;
    private Long totalCourses;
    private Long publishedCourses;
    private Long draftCourses;
    private Long totalEnrollments;
    private Long completedEnrollments;
    private Long inProgressEnrollments;
    private Double averageCompletionRate;

    public AdminAnalyticsResponse() {
    }

    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Long getTotalInstructors() {
        return totalInstructors;
    }

    public void setTotalInstructors(Long totalInstructors) {
        this.totalInstructors = totalInstructors;
    }

    public Long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(Long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public Long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(Long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public Long getPublishedCourses() {
        return publishedCourses;
    }

    public void setPublishedCourses(Long publishedCourses) {
        this.publishedCourses = publishedCourses;
    }

    public Long getDraftCourses() {
        return draftCourses;
    }

    public void setDraftCourses(Long draftCourses) {
        this.draftCourses = draftCourses;
    }

    public Long getTotalEnrollments() {
        return totalEnrollments;
    }

    public void setTotalEnrollments(Long totalEnrollments) {
        this.totalEnrollments = totalEnrollments;
    }

    public Long getCompletedEnrollments() {
        return completedEnrollments;
    }

    public void setCompletedEnrollments(Long completedEnrollments) {
        this.completedEnrollments = completedEnrollments;
    }

    public Long getInProgressEnrollments() {
        return inProgressEnrollments;
    }

    public void setInProgressEnrollments(Long inProgressEnrollments) {
        this.inProgressEnrollments = inProgressEnrollments;
    }

    public Double getAverageCompletionRate() {
        return averageCompletionRate;
    }

    public void setAverageCompletionRate(Double averageCompletionRate) {
        this.averageCompletionRate = averageCompletionRate;
    }
}


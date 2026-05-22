package com.elearn.lms.dto;

import java.util.List;

public class InstructorAnalyticsResponse {
    private Long instructorId;
    private Long totalCourses;
    private Long publishedCourses;
    private Long draftCourses;
    private Long totalEnrollments;
    private Long completedEnrollments;
    private Long inProgressEnrollments;
    private Double averageCompletionRate;
    private List<CourseAnalytics> courseAnalytics;

    public InstructorAnalyticsResponse() {
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
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

    public List<CourseAnalytics> getCourseAnalytics() {
        return courseAnalytics;
    }

    public void setCourseAnalytics(List<CourseAnalytics> courseAnalytics) {
        this.courseAnalytics = courseAnalytics;
    }

    public static class CourseAnalytics {
        private Long courseId;
        private String courseTitle;
        private String status;
        private Long enrollmentCount;
        private Long completedCount;
        private Long inProgressCount;
        private Double completionRate;

        public CourseAnalytics() {
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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Long getEnrollmentCount() {
            return enrollmentCount;
        }

        public void setEnrollmentCount(Long enrollmentCount) {
            this.enrollmentCount = enrollmentCount;
        }

        public Long getCompletedCount() {
            return completedCount;
        }

        public void setCompletedCount(Long completedCount) {
            this.completedCount = completedCount;
        }

        public Long getInProgressCount() {
            return inProgressCount;
        }

        public void setInProgressCount(Long inProgressCount) {
            this.inProgressCount = inProgressCount;
        }

        public Double getCompletionRate() {
            return completionRate;
        }

        public void setCompletionRate(Double completionRate) {
            this.completionRate = completionRate;
        }
    }
}


package com.elearn.lms.dto;

import com.elearn.lms.entity.StudentProgress;
import java.time.LocalDateTime;

public class StudentProgressResponse {
    private Long progressId;
    private Long studentId;
    private Long contentId;
    private Long moduleId;
    private Long courseId;
    private LocalDateTime completedAt;

    // Constructors
    public StudentProgressResponse() {
    }

    public StudentProgressResponse(Long progressId, Long studentId, Long contentId, Long moduleId, Long courseId, LocalDateTime completedAt) {
        this.progressId = progressId;
        this.studentId = studentId;
        this.contentId = contentId;
        this.moduleId = moduleId;
        this.courseId = courseId;
        this.completedAt = completedAt;
    }

    public StudentProgressResponse(StudentProgress progress) {
        this.progressId = progress.getProgressId();
        this.studentId = progress.getStudentId();
        this.contentId = progress.getContentId();
        this.moduleId = progress.getModuleId();
        this.courseId = progress.getCourseId();
        this.completedAt = progress.getCompletedAt();
    }

    // Getters and Setters
    public Long getProgressId() {
        return progressId;
    }

    public void setProgressId(Long progressId) {
        this.progressId = progressId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getContentId() {
        return contentId;
    }

    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}

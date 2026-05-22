package com.elearn.lms.dto;

public class StudentProgressRequest {
    private Long studentId;
    private Long contentId;
    private Long moduleId;
    private Long courseId;

    // Constructors
    public StudentProgressRequest() {
    }

    public StudentProgressRequest(Long studentId, Long contentId, Long moduleId, Long courseId) {
        this.studentId = studentId;
        this.contentId = contentId;
        this.moduleId = moduleId;
        this.courseId = courseId;
    }

    // Getters and Setters
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
}

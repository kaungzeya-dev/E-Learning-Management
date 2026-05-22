package com.elearn.lms.dto;

import com.elearn.lms.entity.Course;
import java.time.LocalDateTime;

public class CourseResponse {

	private Long courseId;
	private Long categoryId;
	private Long instructorId;
	private String title;
	private String description;
	private String status;
	private String thumbnail;
	private String level;
	private String duration;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
	// Added category object to include name
	private CategoryNameDTO category;

	public CourseResponse() {
	}

	public CourseResponse(Course course) {
		this.courseId = course.getCourseId();
		this.categoryId = course.getCategoryId();
		this.instructorId = course.getInstructorId();
		this.title = course.getTitle();
		this.description = course.getDescription();
		this.status = course.getStatus();
		this.thumbnail = course.getThumbnail();
		this.level = course.getLevel();
		this.duration = course.getDuration();
		this.createdAt = course.getCreatedAt();
		this.updatedAt = course.getUpdatedAt();
	}

	public Long getCourseId() {
		return courseId;
	}

	public void setCourseId(Long courseId) {
		this.courseId = courseId;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public Long getInstructorId() {
		return instructorId;
	}

	public void setInstructorId(Long instructorId) {
		this.instructorId = instructorId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	// Color field removed as instructors may not be familiar with color codes

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}
	
	public CategoryNameDTO getCategory() {
		return category;
	}
	
	public void setCategory(CategoryNameDTO category) {
		this.category = category;
	}
}



package com.elearn.lms.dto;

import com.elearn.lms.entity.CourseContent;
import java.time.LocalDateTime;

public class CourseContentResponse {

	private Long contentId;
	private Long moduleId;
	private String title;
	private String contentType; // Video, Reading, Quiz
	private String contentUrl;
	private String filePath; // For uploaded files
	private Integer contentOrder;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public CourseContentResponse() {
	}

	public CourseContentResponse(CourseContent content) {
		this.contentId = content.getContentId();
		this.moduleId = content.getModuleId();
		this.title = content.getTitle();
		this.contentType = content.getContentType();
		this.contentUrl = content.getContentUrl();
		this.filePath = content.getFilePath();
		this.contentOrder = content.getContentOrder();
		this.createdAt = content.getCreatedAt();
		this.updatedAt = content.getUpdatedAt();
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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public String getContentUrl() {
		return contentUrl;
	}

	public void setContentUrl(String contentUrl) {
		this.contentUrl = contentUrl;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public Integer getContentOrder() {
		return contentOrder;
	}

	public void setContentOrder(Integer contentOrder) {
		this.contentOrder = contentOrder;
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
}


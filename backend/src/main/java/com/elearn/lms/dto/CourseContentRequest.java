package com.elearn.lms.dto;

public class CourseContentRequest {

	private Long moduleId;
	private String title;
	private String contentType; // Video, Reading, Quiz
	private String contentUrl;
	private String filePath; // For uploaded files
	private Integer contentOrder;

	public CourseContentRequest() {
	}

	public CourseContentRequest(Long moduleId, String title, String contentType, String contentUrl, Integer contentOrder) {
		this.moduleId = moduleId;
		this.title = title;
		this.contentType = contentType;
		this.contentUrl = contentUrl;
		this.contentOrder = contentOrder;
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
}


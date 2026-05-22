package com.elearn.lms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "COURSE_CONTENT")
public class CourseContent {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "content_id")
	private Long contentId;

	@Column(name = "module_id", nullable = false, insertable = false, updatable = false)
	private Long moduleId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "module_id", nullable = false)
	private CourseModule module;

	@Column(name = "title", nullable = false, length = 255)
	private String title;

	@Column(name = "content_type", nullable = false, length = 20)
	private String contentType; // Video, Reading, Quiz

	@Column(name = "content_url", length = 500)
	private String contentUrl;
	
	@Column(name = "file_path", length = 500)
	private String filePath; // For uploaded files (videos, PDFs, etc.)

	@Column(name = "content_order", nullable = false)
	private Integer contentOrder;

	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public CourseContent() {
	}

	public CourseContent(CourseModule module, String title, String contentType, String contentUrl, Integer contentOrder) {
		this.module = module;
		this.moduleId = module != null ? module.getModuleId() : null;
		this.title = title;
		this.contentType = contentType;
		this.contentUrl = contentUrl;
		this.contentOrder = contentOrder;
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

	public CourseModule getModule() {
		return module;
	}

	public void setModule(CourseModule module) {
		this.module = module;
		if (module != null) {
			this.moduleId = module.getModuleId();
		}
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


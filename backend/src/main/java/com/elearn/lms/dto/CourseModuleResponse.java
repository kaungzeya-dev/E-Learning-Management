package com.elearn.lms.dto;

import com.elearn.lms.entity.CourseModule;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class CourseModuleResponse {

	private Long moduleId;
	private Long courseId;
	private String title;
	private String description;
	private Integer moduleOrder;
	private List<CourseContentResponse> contents;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public CourseModuleResponse() {
	}

	public CourseModuleResponse(CourseModule module) {
		this.moduleId = module.getModuleId();
		this.courseId = module.getCourseId();
		this.title = module.getTitle();
		this.description = module.getDescription();
		this.moduleOrder = module.getModuleOrder();
		this.createdAt = module.getCreatedAt();
		this.updatedAt = module.getUpdatedAt();
		// Contents will be loaded separately if needed to avoid lazy loading issues
		this.contents = null;
	}

	public CourseModuleResponse(CourseModule module, boolean includeContents) {
		this.moduleId = module.getModuleId();
		this.courseId = module.getCourseId();
		this.title = module.getTitle();
		this.description = module.getDescription();
		this.moduleOrder = module.getModuleOrder();
		this.createdAt = module.getCreatedAt();
		this.updatedAt = module.getUpdatedAt();
		if (includeContents && module.getContents() != null) {
			this.contents = module.getContents().stream()
					.map(CourseContentResponse::new)
					.collect(Collectors.toList());
		} else {
			this.contents = null;
		}
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

	public Integer getModuleOrder() {
		return moduleOrder;
	}

	public void setModuleOrder(Integer moduleOrder) {
		this.moduleOrder = moduleOrder;
	}

	public List<CourseContentResponse> getContents() {
		return contents;
	}

	public void setContents(List<CourseContentResponse> contents) {
		this.contents = contents;
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


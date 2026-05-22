package com.elearn.lms.dto;

public class CourseModuleRequest {

	private Long courseId;
	private String title;
	private String description;
	private Integer moduleOrder;

	public CourseModuleRequest() {
	}

	public CourseModuleRequest(Long courseId, String title, String description, Integer moduleOrder) {
		this.courseId = courseId;
		this.title = title;
		this.description = description;
		this.moduleOrder = moduleOrder;
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
}


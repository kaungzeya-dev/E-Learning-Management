package com.elearn.lms.dto;

import com.elearn.lms.entity.CourseModule;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CourseModuleWithContentsResponse {

	private Long moduleId;
	private Long courseId;
	private String title;
	private String description;
	private Integer moduleOrder;
	private List<CourseContentResponse> videos;
	private List<CourseContentResponse> slides;
	private List<CourseContentResponse> quizzes;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public CourseModuleWithContentsResponse() {
		this.videos = new ArrayList<>();
		this.slides = new ArrayList<>();
		this.quizzes = new ArrayList<>();
	}

	public CourseModuleWithContentsResponse(CourseModule module) {
		this.moduleId = module.getModuleId();
		this.courseId = module.getCourseId();
		this.title = module.getTitle();
		this.description = module.getDescription();
		this.moduleOrder = module.getModuleOrder();
		this.createdAt = module.getCreatedAt();
		this.updatedAt = module.getUpdatedAt();

		// Organize contents by type
		this.videos = new ArrayList<>();
		this.slides = new ArrayList<>();
		this.quizzes = new ArrayList<>();

		if (module.getContents() != null) {
			List<CourseContentResponse> allContents = module.getContents().stream()
					.map(CourseContentResponse::new)
					.collect(Collectors.toList());

			for (CourseContentResponse content : allContents) {
				String contentType = content.getContentType();
				if ("Video".equalsIgnoreCase(contentType)) {
					this.videos.add(content);
				} else if ("Reading".equalsIgnoreCase(contentType)) {
					this.slides.add(content);
				} else if ("Quiz".equalsIgnoreCase(contentType)) {
					this.quizzes.add(content);
				}
			}
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

	public List<CourseContentResponse> getVideos() {
		return videos;
	}

	public void setVideos(List<CourseContentResponse> videos) {
		this.videos = videos;
	}

	public List<CourseContentResponse> getSlides() {
		return slides;
	}

	public void setSlides(List<CourseContentResponse> slides) {
		this.slides = slides;
	}

	public List<CourseContentResponse> getQuizzes() {
		return quizzes;
	}

	public void setQuizzes(List<CourseContentResponse> quizzes) {
		this.quizzes = quizzes;
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


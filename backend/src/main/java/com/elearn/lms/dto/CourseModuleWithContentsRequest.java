package com.elearn.lms.dto;

import java.util.ArrayList;
import java.util.List;

public class CourseModuleWithContentsRequest {

	private Long courseId;
	private String title;
	private String description;
	private Integer moduleOrder;
	private List<CourseContentRequest> videos;
	private List<CourseContentRequest> slides;
	private List<CourseContentRequest> quizzes;

	public CourseModuleWithContentsRequest() {
		this.videos = new ArrayList<>();
		this.slides = new ArrayList<>();
		this.quizzes = new ArrayList<>();
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

	public List<CourseContentRequest> getVideos() {
		return videos;
	}

	public void setVideos(List<CourseContentRequest> videos) {
		this.videos = videos;
	}

	public List<CourseContentRequest> getSlides() {
		return slides;
	}

	public void setSlides(List<CourseContentRequest> slides) {
		this.slides = slides;
	}

	public List<CourseContentRequest> getQuizzes() {
		return quizzes;
	}

	public void setQuizzes(List<CourseContentRequest> quizzes) {
		this.quizzes = quizzes;
	}
}


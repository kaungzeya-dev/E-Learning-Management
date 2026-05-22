package com.elearn.lms.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuizResponse {

	private Long quizId;
	private Long contentId;
	private String title;
	private Double maxScore;
	private List<QuizQuestionResponse> questions;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public QuizResponse() {
	}

	public Long getQuizId() {
		return quizId;
	}

	public void setQuizId(Long quizId) {
		this.quizId = quizId;
	}

	public Long getContentId() {
		return contentId;
	}

	public void setContentId(Long contentId) {
		this.contentId = contentId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Double getMaxScore() {
		return maxScore;
	}

	public void setMaxScore(Double maxScore) {
		this.maxScore = maxScore;
	}

	public List<QuizQuestionResponse> getQuestions() {
		return questions;
	}

	public void setQuestions(List<QuizQuestionResponse> questions) {
		this.questions = questions;
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


package com.elearn.lms.dto;

import java.util.List;

public class QuizRequest {

	private Long contentId;
	private String title;
	private Double maxScore;
	private List<QuizQuestionRequest> questions;

	public QuizRequest() {
	}

	public QuizRequest(Long contentId, String title, Double maxScore, List<QuizQuestionRequest> questions) {
		this.contentId = contentId;
		this.title = title;
		this.maxScore = maxScore;
		this.questions = questions;
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

	public List<QuizQuestionRequest> getQuestions() {
		return questions;
	}

	public void setQuestions(List<QuizQuestionRequest> questions) {
		this.questions = questions;
	}
}


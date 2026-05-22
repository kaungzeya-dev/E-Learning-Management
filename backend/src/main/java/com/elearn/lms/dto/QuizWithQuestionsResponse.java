package com.elearn.lms.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for quiz with questions (for students taking the quiz)
 * Note: correctAnswer is hidden in questions
 */
public class QuizWithQuestionsResponse {

	private Long quizId;
	private Long contentId;
	private String title;
	private Double maxScore;
	private List<QuizQuestionForStudentResponse> questions; // Questions without correct answers
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public QuizWithQuestionsResponse() {
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

	public List<QuizQuestionForStudentResponse> getQuestions() {
		return questions;
	}

	public void setQuestions(List<QuizQuestionForStudentResponse> questions) {
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

	// Inner class for questions without correct answers (for students)
	public static class QuizQuestionForStudentResponse {
		private Long questionId;
		private Long quizId;
		private String questionText;
		private List<String> options;

		public QuizQuestionForStudentResponse() {
		}

		public Long getQuestionId() {
			return questionId;
		}

		public void setQuestionId(Long questionId) {
			this.questionId = questionId;
		}

		public Long getQuizId() {
			return quizId;
		}

		public void setQuizId(Long quizId) {
			this.quizId = quizId;
		}

		public String getQuestionText() {
			return questionText;
		}

		public void setQuestionText(String questionText) {
			this.questionText = questionText;
		}

		public List<String> getOptions() {
			return options;
		}

		public void setOptions(List<String> options) {
			this.options = options;
		}
	}
}


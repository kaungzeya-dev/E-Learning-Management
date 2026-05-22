package com.elearn.lms.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class QuizAttemptResponse {

	private Long attemptId;
	private Long quizId;
	private Long studentId;
	private Double score;
	private Double maxScore;
	private Map<Long, QuizAnswerResult> answerResults; // questionId -> result (correct/incorrect, correct answer)
	private LocalDateTime attemptDate;

	public QuizAttemptResponse() {
	}

	public Long getAttemptId() {
		return attemptId;
	}

	public void setAttemptId(Long attemptId) {
		this.attemptId = attemptId;
	}

	public Long getQuizId() {
		return quizId;
	}

	public void setQuizId(Long quizId) {
		this.quizId = quizId;
	}

	public Long getStudentId() {
		return studentId;
	}

	public void setStudentId(Long studentId) {
		this.studentId = studentId;
	}

	public Double getScore() {
		return score;
	}

	public void setScore(Double score) {
		this.score = score;
	}

	public Double getMaxScore() {
		return maxScore;
	}

	public void setMaxScore(Double maxScore) {
		this.maxScore = maxScore;
	}

	public Map<Long, QuizAnswerResult> getAnswerResults() {
		return answerResults;
	}

	public void setAnswerResults(Map<Long, QuizAnswerResult> answerResults) {
		this.answerResults = answerResults;
	}

	public LocalDateTime getAttemptDate() {
		return attemptDate;
	}

	public void setAttemptDate(LocalDateTime attemptDate) {
		this.attemptDate = attemptDate;
	}

	// Inner class for answer results
	public static class QuizAnswerResult {
		private String selectedAnswer;
		private String correctAnswer;
		private Boolean isCorrect;

		public QuizAnswerResult() {
		}

		public QuizAnswerResult(String selectedAnswer, String correctAnswer, Boolean isCorrect) {
			this.selectedAnswer = selectedAnswer;
			this.correctAnswer = correctAnswer;
			this.isCorrect = isCorrect;
		}

		public String getSelectedAnswer() {
			return selectedAnswer;
		}

		public void setSelectedAnswer(String selectedAnswer) {
			this.selectedAnswer = selectedAnswer;
		}

		public String getCorrectAnswer() {
			return correctAnswer;
		}

		public void setCorrectAnswer(String correctAnswer) {
			this.correctAnswer = correctAnswer;
		}

		public Boolean getIsCorrect() {
			return isCorrect;
		}

		public void setIsCorrect(Boolean isCorrect) {
			this.isCorrect = isCorrect;
		}
	}
}


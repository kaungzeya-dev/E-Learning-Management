package com.elearn.lms.dto;

import java.util.Map;

public class QuizAttemptRequest {

	private Long quizId;
	private Long studentId;
	private Map<Long, String> answers; // questionId -> selected answer (index or letter)

	public QuizAttemptRequest() {
	}

	public QuizAttemptRequest(Long quizId, Long studentId, Map<Long, String> answers) {
		this.quizId = quizId;
		this.studentId = studentId;
		this.answers = answers;
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

	public Map<Long, String> getAnswers() {
		return answers;
	}

	public void setAnswers(Map<Long, String> answers) {
		this.answers = answers;
	}
}


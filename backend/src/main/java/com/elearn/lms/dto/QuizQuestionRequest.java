package com.elearn.lms.dto;

import java.util.List;

public class QuizQuestionRequest {

	private String questionText;
	private List<String> options; // List of options for MCQ
	private String correctAnswer; // Index (0-based) or letter (A, B, C, D) of correct option

	public QuizQuestionRequest() {
	}

	public QuizQuestionRequest(String questionText, List<String> options, String correctAnswer) {
		this.questionText = questionText;
		this.options = options;
		this.correctAnswer = correctAnswer;
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

	public String getCorrectAnswer() {
		return correctAnswer;
	}

	public void setCorrectAnswer(String correctAnswer) {
		this.correctAnswer = correctAnswer;
	}
}


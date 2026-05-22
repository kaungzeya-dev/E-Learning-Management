package com.elearn.lms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "QUIZ_ATTEMPTS")
public class QuizAttempt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "attempt_id")
	private Long attemptId;

	@Column(name = "quiz_id", nullable = false, insertable = false, updatable = false)
	private Long quizId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "quiz_id", nullable = false)
	private Quiz quiz;

	@Column(name = "student_id", nullable = false)
	private Long studentId;

	@Column(name = "score", nullable = false, columnDefinition = "DECIMAL(5,2)")
	private Double score;

	@Column(name = "attempt_date")
	private LocalDateTime attemptDate;

	@PrePersist
	protected void onCreate() {
		attemptDate = LocalDateTime.now();
	}

	public QuizAttempt() {
	}

	public QuizAttempt(Quiz quiz, Long studentId, Double score) {
		this.quiz = quiz;
		this.quizId = quiz != null ? quiz.getQuizId() : null;
		this.studentId = studentId;
		this.score = score;
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

	public Quiz getQuiz() {
		return quiz;
	}

	public void setQuiz(Quiz quiz) {
		this.quiz = quiz;
		if (quiz != null) {
			this.quizId = quiz.getQuizId();
		}
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

	public LocalDateTime getAttemptDate() {
		return attemptDate;
	}

	public void setAttemptDate(LocalDateTime attemptDate) {
		this.attemptDate = attemptDate;
	}
}


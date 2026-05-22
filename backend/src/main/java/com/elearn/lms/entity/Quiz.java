package com.elearn.lms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "QUIZZES")
public class Quiz {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "quiz_id")
	private Long quizId;

	@Column(name = "content_id", nullable = false, insertable = false, updatable = false)
	private Long contentId;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "content_id", nullable = false)
	private CourseContent content;

	@Column(name = "title", nullable = false, length = 255)
	private String title;

	@Column(name = "max_score", nullable = false, columnDefinition = "DECIMAL(5,2)")
	private Double maxScore;

	@OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("questionId ASC")
	private List<QuizQuestion> questions = new ArrayList<>();

	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public Quiz() {
	}

	public Quiz(CourseContent content, String title, Double maxScore) {
		this.content = content;
		this.contentId = content != null ? content.getContentId() : null;
		this.title = title;
		this.maxScore = maxScore;
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

	public CourseContent getContent() {
		return content;
	}

	public void setContent(CourseContent content) {
		this.content = content;
		if (content != null) {
			this.contentId = content.getContentId();
		}
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

	public List<QuizQuestion> getQuestions() {
		return questions;
	}

	public void setQuestions(List<QuizQuestion> questions) {
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


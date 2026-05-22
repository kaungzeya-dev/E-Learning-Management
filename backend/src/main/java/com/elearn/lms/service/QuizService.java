package com.elearn.lms.service;

import com.elearn.lms.dto.*;
import com.elearn.lms.entity.CourseContent;
import com.elearn.lms.entity.Quiz;
import com.elearn.lms.entity.QuizAttempt;
import com.elearn.lms.entity.QuizQuestion;
import com.elearn.lms.repository.CourseContentRepository;
import com.elearn.lms.repository.QuizAttemptRepository;
import com.elearn.lms.repository.QuizQuestionRepository;
import com.elearn.lms.repository.QuizRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

	private final QuizRepository quizRepository;
	private final QuizQuestionRepository quizQuestionRepository;
	private final QuizAttemptRepository quizAttemptRepository;
	private final CourseContentRepository courseContentRepository;
	private final ObjectMapper objectMapper;

	public QuizService(
			QuizRepository quizRepository,
			QuizQuestionRepository quizQuestionRepository,
			QuizAttemptRepository quizAttemptRepository,
			CourseContentRepository courseContentRepository) {
		this.quizRepository = quizRepository;
		this.quizQuestionRepository = quizQuestionRepository;
		this.quizAttemptRepository = quizAttemptRepository;
		this.courseContentRepository = courseContentRepository;
		this.objectMapper = new ObjectMapper();
	}

	/**
	 * Create a quiz with questions
	 */
	@Transactional
	public QuizResponse createQuiz(@NonNull QuizRequest request) {
		// Verify content exists and is of type Quiz
		CourseContent content = courseContentRepository.findById(request.getContentId())
				.orElseThrow(() -> new RuntimeException("Content not found with id: " + request.getContentId()));

		if (!"Quiz".equals(content.getContentType())) {
			throw new RuntimeException("Content must be of type 'Quiz'");
		}

		// Check if quiz already exists for this content
		if (quizRepository.findByContentId(request.getContentId()).isPresent()) {
			throw new RuntimeException("Quiz already exists for this content");
		}

		// Create quiz
		Quiz quiz = new Quiz();
		quiz.setContent(content);
		quiz.setTitle(request.getTitle() != null ? request.getTitle() : content.getTitle());
		quiz.setMaxScore(request.getMaxScore() != null ? request.getMaxScore() : 100.0);

		Quiz savedQuiz = quizRepository.save(quiz);

		// Add questions if provided
		if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
			for (QuizQuestionRequest questionRequest : request.getQuestions()) {
				QuizQuestion question = new QuizQuestion();
				question.setQuiz(savedQuiz);
				question.setQuestionText(questionRequest.getQuestionText());
				
				// Convert options list to JSON string
				if (questionRequest.getOptions() != null && !questionRequest.getOptions().isEmpty()) {
					try {
						String optionsJson = objectMapper.writeValueAsString(questionRequest.getOptions());
						question.setOptions(optionsJson);
					} catch (Exception e) {
						throw new RuntimeException("Failed to serialize options: " + e.getMessage());
					}
				}
				
				question.setCorrectAnswer(questionRequest.getCorrectAnswer());
				savedQuiz.getQuestions().add(question);
			}
			quizRepository.save(savedQuiz);
		}

		return mapToResponse(savedQuiz, true);
	}

	/**
	 * Get quiz by ID (for instructors - includes correct answers)
	 */
	public QuizResponse getQuizById(@NonNull Long quizId, boolean includeCorrectAnswers) {
		Quiz quiz = quizRepository.findById(quizId)
				.orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
		return mapToResponse(quiz, includeCorrectAnswers);
	}

	/**
	 * Get quiz by content ID (for instructors - includes correct answers)
	 */
	public QuizResponse getQuizByContentId(@NonNull Long contentId, boolean includeCorrectAnswers) {
		Quiz quiz = quizRepository.findByContentId(contentId)
				.orElseThrow(() -> new RuntimeException("Quiz not found for content id: " + contentId));
		return mapToResponse(quiz, includeCorrectAnswers);
	}

	/**
	 * Get quiz for student (without correct answers)
	 */
	public QuizWithQuestionsResponse getQuizForStudent(@NonNull Long quizId) {
		Quiz quiz = quizRepository.findById(quizId)
				.orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

		QuizWithQuestionsResponse response = new QuizWithQuestionsResponse();
		response.setQuizId(quiz.getQuizId());
		response.setContentId(quiz.getContentId());
		response.setTitle(quiz.getTitle());
		response.setMaxScore(quiz.getMaxScore());
		response.setCreatedAt(quiz.getCreatedAt());
		response.setUpdatedAt(quiz.getUpdatedAt());

		// Map questions without correct answers
		List<QuizWithQuestionsResponse.QuizQuestionForStudentResponse> questionResponses = 
				quiz.getQuestions().stream()
						.map(this::mapToQuestionForStudent)
						.collect(Collectors.toList());
		response.setQuestions(questionResponses);

		return response;
	}

	/**
	 * Submit quiz attempt and calculate score
	 */
	@Transactional
	public QuizAttemptResponse submitQuizAttempt(@NonNull QuizAttemptRequest request) {
		Quiz quiz = quizRepository.findById(request.getQuizId())
				.orElseThrow(() -> new RuntimeException("Quiz not found with id: " + request.getQuizId()));

		if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
			throw new RuntimeException("Answers cannot be empty");
		}

		// Calculate score
		int totalQuestions = quiz.getQuestions().size();
		int correctAnswers = 0;
		Map<Long, QuizAttemptResponse.QuizAnswerResult> answerResults = new HashMap<>();

		for (QuizQuestion question : quiz.getQuestions()) {
			String studentAnswer = request.getAnswers().get(question.getQuestionId());
			String correctAnswer = question.getCorrectAnswer();
			boolean isCorrect = false;

			if (studentAnswer != null) {
				// Normalize answers for comparison (handle both index and letter format)
				String normalizedStudent = normalizeAnswer(studentAnswer);
				String normalizedCorrect = normalizeAnswer(correctAnswer);
				isCorrect = normalizedStudent.equalsIgnoreCase(normalizedCorrect);
			}

			if (isCorrect) {
				correctAnswers++;
			}

			answerResults.put(question.getQuestionId(), 
					new QuizAttemptResponse.QuizAnswerResult(
							studentAnswer != null ? studentAnswer : "No answer",
							correctAnswer,
							isCorrect));
		}

		// Calculate score
		double score = totalQuestions > 0 
				? (double) correctAnswers / totalQuestions * quiz.getMaxScore() 
				: 0.0;

		// Create attempt record
		QuizAttempt attempt = new QuizAttempt();
		attempt.setQuiz(quiz);
		attempt.setStudentId(request.getStudentId());
		attempt.setScore(score);
		QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

		// Build response
		QuizAttemptResponse response = new QuizAttemptResponse();
		response.setAttemptId(savedAttempt.getAttemptId());
		response.setQuizId(quiz.getQuizId());
		response.setStudentId(request.getStudentId());
		response.setScore(score);
		response.setMaxScore(quiz.getMaxScore());
		response.setAnswerResults(answerResults);
		response.setAttemptDate(savedAttempt.getAttemptDate());

		return response;
	}

	/**
	 * Get all attempts for a quiz
	 */
	public List<QuizAttemptResponse> getQuizAttempts(@NonNull Long quizId) {
		List<QuizAttempt> attempts = quizAttemptRepository.findByQuizIdOrderByAttemptDateDesc(quizId);
		return attempts.stream()
				.map(this::mapToAttemptResponse)
				.collect(Collectors.toList());
	}

	/**
	 * Get all attempts for a student
	 */
	public List<QuizAttemptResponse> getStudentAttempts(@NonNull Long studentId) {
		List<QuizAttempt> attempts = quizAttemptRepository.findByStudentIdOrderByAttemptDateDesc(studentId);
		return attempts.stream()
				.map(this::mapToAttemptResponse)
				.collect(Collectors.toList());
	}

	/**
	 * Get attempts for a specific student and quiz
	 */
	public List<QuizAttemptResponse> getStudentQuizAttempts(@NonNull Long quizId, @NonNull Long studentId) {
		List<QuizAttempt> attempts = quizAttemptRepository.findByQuizIdAndStudentIdOrderByAttemptDateDesc(quizId, studentId);
		return attempts.stream()
				.map(this::mapToAttemptResponse)
				.collect(Collectors.toList());
	}

	/**
	 * Update quiz
	 */
	@Transactional
	public QuizResponse updateQuiz(@NonNull Long quizId, @NonNull QuizRequest request) {
		Quiz quiz = quizRepository.findById(quizId)
				.orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

		if (request.getTitle() != null && !request.getTitle().isEmpty()) {
			quiz.setTitle(request.getTitle());
		}

		if (request.getMaxScore() != null) {
			quiz.setMaxScore(request.getMaxScore());
		}

		// Update questions if provided
		if (request.getQuestions() != null) {
			// Clear existing questions
			quiz.getQuestions().clear();
			
			// Add new questions
			for (QuizQuestionRequest questionRequest : request.getQuestions()) {
				QuizQuestion question = new QuizQuestion();
				question.setQuiz(quiz);
				question.setQuestionText(questionRequest.getQuestionText());
				
				if (questionRequest.getOptions() != null && !questionRequest.getOptions().isEmpty()) {
					try {
						String optionsJson = objectMapper.writeValueAsString(questionRequest.getOptions());
						question.setOptions(optionsJson);
					} catch (Exception e) {
						throw new RuntimeException("Failed to serialize options: " + e.getMessage());
					}
				}
				
				question.setCorrectAnswer(questionRequest.getCorrectAnswer());
				quiz.getQuestions().add(question);
			}
		}

		Quiz updated = quizRepository.save(quiz);
		return mapToResponse(updated, true);
	}

	/**
	 * Delete quiz
	 */
	@Transactional
	public void deleteQuiz(@NonNull Long quizId) {
		if (!quizRepository.existsById(quizId)) {
			throw new RuntimeException("Quiz not found with id: " + quizId);
		}
		quizRepository.deleteById(quizId);
	}

	// Helper methods

	private QuizResponse mapToResponse(Quiz quiz, boolean includeCorrectAnswers) {
		QuizResponse response = new QuizResponse();
		response.setQuizId(quiz.getQuizId());
		response.setContentId(quiz.getContentId());
		response.setTitle(quiz.getTitle());
		response.setMaxScore(quiz.getMaxScore());
		response.setCreatedAt(quiz.getCreatedAt());
		response.setUpdatedAt(quiz.getUpdatedAt());

		List<QuizQuestionResponse> questionResponses = quiz.getQuestions().stream()
				.map(q -> mapToQuestionResponse(q, includeCorrectAnswers))
				.collect(Collectors.toList());
		response.setQuestions(questionResponses);

		return response;
	}

	private QuizQuestionResponse mapToQuestionResponse(QuizQuestion question, boolean includeCorrectAnswers) {
		QuizQuestionResponse response = new QuizQuestionResponse();
		response.setQuestionId(question.getQuestionId());
		response.setQuizId(question.getQuizId());
		response.setQuestionText(question.getQuestionText());
		response.setCreatedAt(question.getCreatedAt());
		response.setUpdatedAt(question.getUpdatedAt());

		// Parse options from JSON
		if (question.getOptions() != null && !question.getOptions().isEmpty()) {
			try {
				List<String> options = objectMapper.readValue(
						question.getOptions(), 
						new TypeReference<List<String>>() {});
				response.setOptions(options);
			} catch (Exception e) {
				response.setOptions(new ArrayList<>());
			}
		} else {
			response.setOptions(new ArrayList<>());
		}

		// Only include correct answer if requested (for instructors)
		if (includeCorrectAnswers) {
			response.setCorrectAnswer(question.getCorrectAnswer());
		}

		return response;
	}

	private QuizWithQuestionsResponse.QuizQuestionForStudentResponse mapToQuestionForStudent(QuizQuestion question) {
		QuizWithQuestionsResponse.QuizQuestionForStudentResponse response = 
				new QuizWithQuestionsResponse.QuizQuestionForStudentResponse();
		response.setQuestionId(question.getQuestionId());
		response.setQuizId(question.getQuizId());
		response.setQuestionText(question.getQuestionText());

		// Parse options from JSON
		if (question.getOptions() != null && !question.getOptions().isEmpty()) {
			try {
				List<String> options = objectMapper.readValue(
						question.getOptions(), 
						new TypeReference<List<String>>() {});
				response.setOptions(options);
			} catch (Exception e) {
				response.setOptions(new ArrayList<>());
			}
		} else {
			response.setOptions(new ArrayList<>());
		}

		return response;
	}

	private QuizAttemptResponse mapToAttemptResponse(QuizAttempt attempt) {
		QuizAttemptResponse response = new QuizAttemptResponse();
		response.setAttemptId(attempt.getAttemptId());
		response.setQuizId(attempt.getQuizId());
		response.setStudentId(attempt.getStudentId());
		response.setScore(attempt.getScore());
		response.setMaxScore(attempt.getQuiz().getMaxScore());
		response.setAttemptDate(attempt.getAttemptDate());
		// Note: answerResults would need to be stored separately or reconstructed
		// For now, we'll leave it null in the list view
		return response;
	}

	/**
	 * Normalize answer for comparison (handles both index "0", "1" and letter "A", "B" formats)
	 */
	private String normalizeAnswer(String answer) {
		if (answer == null) {
			return "";
		}
		answer = answer.trim().toUpperCase();
		// If it's a number, convert to letter (0->A, 1->B, etc.)
		try {
			int index = Integer.parseInt(answer);
			return String.valueOf((char) ('A' + index));
		} catch (NumberFormatException e) {
			// Already a letter or other format, return as is
			return answer;
		}
	}
}


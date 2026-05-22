package com.elearn.lms.controller;

import com.elearn.lms.dto.*;
import com.elearn.lms.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {

	@Autowired
	private QuizService quizService;

	/**
	 * Create a new quiz with questions
	 * POST /api/quizzes
	 */
	@PostMapping
	public ResponseEntity<?> createQuiz(@RequestBody QuizRequest request) {
		try {
			QuizResponse quiz = quizService.createQuiz(request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Quiz created successfully");
			response.put("data", quiz);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	/**
	 * Get quiz by ID (for instructors - includes correct answers)
	 * GET /api/quizzes/{id}?includeCorrectAnswers=true
	 */
	@GetMapping("/{id}")
	public ResponseEntity<?> getQuizById(
			@PathVariable @NonNull Long id,
			@RequestParam(value = "includeCorrectAnswers", defaultValue = "true") boolean includeCorrectAnswers) {
		try {
			QuizResponse quiz = quizService.getQuizById(id, includeCorrectAnswers);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("data", quiz);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}

	/**
	 * Get quiz by content ID (for instructors - includes correct answers)
	 * GET /api/quizzes/content/{contentId}?includeCorrectAnswers=true
	 */
	@GetMapping("/content/{contentId}")
	public ResponseEntity<?> getQuizByContentId(
			@PathVariable @NonNull Long contentId,
			@RequestParam(value = "includeCorrectAnswers", defaultValue = "true") boolean includeCorrectAnswers) {
		try {
			QuizResponse quiz = quizService.getQuizByContentId(contentId, includeCorrectAnswers);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("data", quiz);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}

	/**
	 * Get quiz for student (without correct answers)
	 * GET /api/quizzes/{id}/student
	 */
	@GetMapping("/{id}/student")
	public ResponseEntity<?> getQuizForStudent(@PathVariable @NonNull Long id) {
		try {
			QuizWithQuestionsResponse quiz = quizService.getQuizForStudent(id);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("data", quiz);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}

	/**
	 * Submit quiz attempt
	 * POST /api/quizzes/attempt
	 */
	@PostMapping("/attempt")
	public ResponseEntity<?> submitQuizAttempt(@RequestBody QuizAttemptRequest request) {
		try {
			QuizAttemptResponse attempt = quizService.submitQuizAttempt(request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Quiz submitted successfully");
			response.put("data", attempt);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	/**
	 * Get all attempts for a quiz
	 * GET /api/quizzes/{quizId}/attempts
	 */
	@GetMapping("/{quizId}/attempts")
	public ResponseEntity<?> getQuizAttempts(@PathVariable @NonNull Long quizId) {
		try {
			List<QuizAttemptResponse> attempts = quizService.getQuizAttempts(quizId);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", attempts.size());
			response.put("data", attempts);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	/**
	 * Get all attempts for a student
	 * GET /api/quizzes/student/{studentId}/attempts
	 */
	@GetMapping("/student/{studentId}/attempts")
	public ResponseEntity<?> getStudentAttempts(@PathVariable @NonNull Long studentId) {
		try {
			List<QuizAttemptResponse> attempts = quizService.getStudentAttempts(studentId);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", attempts.size());
			response.put("data", attempts);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	/**
	 * Get attempts for a specific student and quiz
	 * GET /api/quizzes/{quizId}/student/{studentId}/attempts
	 */
	@GetMapping("/{quizId}/student/{studentId}/attempts")
	public ResponseEntity<?> getStudentQuizAttempts(
			@PathVariable @NonNull Long quizId,
			@PathVariable @NonNull Long studentId) {
		try {
			List<QuizAttemptResponse> attempts = quizService.getStudentQuizAttempts(quizId, studentId);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", attempts.size());
			response.put("data", attempts);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	/**
	 * Update quiz
	 * PUT /api/quizzes/{id}
	 */
	@PutMapping("/{id}")
	public ResponseEntity<?> updateQuiz(@PathVariable @NonNull Long id, @RequestBody @NonNull QuizRequest request) {
		try {
			QuizResponse quiz = quizService.updateQuiz(id, request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Quiz updated successfully");
			response.put("data", quiz);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	/**
	 * Delete quiz
	 * DELETE /api/quizzes/{id}
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteQuiz(@PathVariable @NonNull Long id) {
		try {
			quizService.deleteQuiz(id);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Quiz deleted successfully");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}
}


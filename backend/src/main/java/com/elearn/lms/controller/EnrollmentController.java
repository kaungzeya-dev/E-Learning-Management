package com.elearn.lms.controller;

import com.elearn.lms.dto.EnrollmentRequest;
import com.elearn.lms.dto.EnrollmentResponse;
import com.elearn.lms.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    /**
     * Enroll a student in a course
     * POST /api/enrollments
     */
    @PostMapping
    public ResponseEntity<?> enrollStudent(@Valid @RequestBody EnrollmentRequest request) {
        try {
            EnrollmentResponse enrollment = enrollmentService.enrollStudent(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully enrolled in course");
            response.put("data", enrollment);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to enroll in course");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get all enrollments for a student
     * GET /api/enrollments/student/{studentId}
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getEnrollmentsByStudentId(@PathVariable @NonNull Long studentId) {
        try {
            List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByStudentId(studentId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", enrollments.size());
            response.put("data", enrollments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get all enrollments for a course
     * GET /api/enrollments/course/{courseId}
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getEnrollmentsByCourseId(@PathVariable @NonNull Long courseId) {
        try {
            List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByCourseId(courseId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", enrollments.size());
            response.put("data", enrollments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get a specific enrollment by ID
     * GET /api/enrollments/{enrollmentId}
     */
    @GetMapping("/{enrollmentId}")
    public ResponseEntity<?> getEnrollmentById(@PathVariable @NonNull Long enrollmentId) {
        try {
            EnrollmentResponse enrollment = enrollmentService.getEnrollmentById(enrollmentId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", enrollment);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch enrollment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Check if a student is enrolled in a course
     * GET /api/enrollments/check?studentId={studentId}&courseId={courseId}
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkEnrollment(
            @RequestParam @NonNull Long studentId,
            @RequestParam @NonNull Long courseId) {
        try {
            boolean isEnrolled = enrollmentService.isStudentEnrolled(studentId, courseId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isEnrolled", isEnrolled);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update enrollment completion status
     * PATCH /api/enrollments/{enrollmentId}/status
     */
    @PatchMapping("/{enrollmentId}/status")
    public ResponseEntity<?> updateCompletionStatus(
            @PathVariable @NonNull Long enrollmentId,
            @RequestParam @NonNull String status) {
        try {
            EnrollmentResponse enrollment = enrollmentService.updateCompletionStatus(enrollmentId, status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Enrollment status updated successfully");
            response.put("data", enrollment);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to update enrollment status");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Delete an enrollment (unenroll)
     * DELETE /api/enrollments/{enrollmentId}
     */
    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<?> deleteEnrollment(@PathVariable @NonNull Long enrollmentId) {
        try {
            enrollmentService.deleteEnrollment(enrollmentId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully unenrolled from course");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to unenroll from course");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

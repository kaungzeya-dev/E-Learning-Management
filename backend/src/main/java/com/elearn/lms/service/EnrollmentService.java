package com.elearn.lms.service;

import com.elearn.lms.dto.EnrollmentRequest;
import com.elearn.lms.dto.EnrollmentResponse;
import com.elearn.lms.entity.Enrollment;
import com.elearn.lms.repository.EnrollmentRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * Enroll a student in a course
     */
    public EnrollmentResponse enrollStudent(@NonNull EnrollmentRequest request) {
        // Check if already enrolled
        if (enrollmentRepository.existsByStudentIdAndCourseId(request.getStudentId(), request.getCourseId())) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(request.getStudentId());
        enrollment.setCourseId(request.getCourseId());

        Enrollment saved = enrollmentRepository.save(enrollment);
        return mapToResponse(saved);
    }

    /**
     * Get all enrollments for a student
     */
    public List<EnrollmentResponse> getEnrollmentsByStudentId(@NonNull Long studentId) {
        return enrollmentRepository.findByStudentId(studentId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get all enrollments for a course
     */
    public List<EnrollmentResponse> getEnrollmentsByCourseId(@NonNull Long courseId) {
        return enrollmentRepository.findByCourseId(courseId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get a specific enrollment
     */
    public EnrollmentResponse getEnrollmentById(@NonNull Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));
        return mapToResponse(enrollment);
    }

    /**
     * Check if a student is enrolled in a course
     */
    public boolean isStudentEnrolled(@NonNull Long studentId, @NonNull Long courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }

    /**
     * Update enrollment completion status
     */
    public EnrollmentResponse updateCompletionStatus(@NonNull Long enrollmentId, @NonNull String status) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));
        
        enrollment.setCompletionStatus(status);
        Enrollment updated = enrollmentRepository.save(enrollment);
        return mapToResponse(updated);
    }

    /**
     * Delete an enrollment (unenroll)
     */
    public void deleteEnrollment(@NonNull Long enrollmentId) {
        if (!enrollmentRepository.existsById(enrollmentId)) {
            throw new RuntimeException("Enrollment not found with id: " + enrollmentId);
        }
        enrollmentRepository.deleteById(enrollmentId);
    }

    /**
     * Map Enrollment entity to EnrollmentResponse DTO
     */
    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        return new EnrollmentResponse(
            enrollment.getEnrollmentId(),
            enrollment.getStudentId(),
            enrollment.getCourseId(),
            enrollment.getEnrollmentDate(),
            enrollment.getCompletionStatus()
        );
    }
}

package com.elearn.lms.repository;

import com.elearn.lms.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    // Find all enrollments for a specific student
    List<Enrollment> findByStudentId(Long studentId);
    
    // Find all enrollments for a specific course
    List<Enrollment> findByCourseId(Long courseId);
    
    // Check if a student is already enrolled in a course
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    // Check if enrollment exists
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}

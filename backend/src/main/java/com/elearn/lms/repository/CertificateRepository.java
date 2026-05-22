package com.elearn.lms.repository;

import com.elearn.lms.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    
    // Find all certificates for a specific student
    List<Certificate> findByStudentId(Long studentId);
    
    // Find all certificates for a specific course
    List<Certificate> findByCourseId(Long courseId);
    
    // Find a certificate by its unique code
    Optional<Certificate> findByUniqueCode(String uniqueCode);
    
    // Case-insensitive lookup for verification convenience
    Optional<Certificate> findByUniqueCodeIgnoreCase(String uniqueCode);
    
    // Check if a student has a certificate for a specific course
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    // Find a certificate for a specific student-course pair
    Optional<Certificate> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    // Find a certificate for a specific enrollment
    Optional<Certificate> findByEnrollmentId(Long enrollmentId);
}

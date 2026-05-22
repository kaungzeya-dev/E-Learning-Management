package com.elearn.lms.service;

import com.elearn.lms.dto.CertificateResponse;
import com.elearn.lms.entity.Certificate;
import com.elearn.lms.entity.Course;
import com.elearn.lms.entity.Enrollment;
import com.elearn.lms.repository.CertificateRepository;
import com.elearn.lms.repository.CourseRepository;
import com.elearn.lms.repository.EnrollmentRepository;
import com.elearn.lms.repository.StudentRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final com.elearn.lms.repository.InstructorRepository instructorRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final com.elearn.lms.service.BadgeService badgeService;
    private final StudentRepository studentRepository;

    public CertificateService(CertificateRepository certificateRepository,
                             CourseRepository courseRepository,
                             EnrollmentRepository enrollmentRepository,
                             com.elearn.lms.repository.InstructorRepository instructorRepository,
                             com.elearn.lms.service.BadgeService badgeService,
                             StudentRepository studentRepository) {
        this.certificateRepository = certificateRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.instructorRepository = instructorRepository;
        this.badgeService = badgeService;
        this.studentRepository = studentRepository;
    }

    /**
     * Generate a certificate for a student who completed a course
     */
    @Transactional
    public CertificateResponse generateCertificate(@NonNull Long studentId, @NonNull Long courseId) {
        // Short-circuit when the certificate was already issued
        Optional<Certificate> existingCert = certificateRepository.findByStudentIdAndCourseId(studentId, courseId);
        if (existingCert.isPresent()) {
            return createCertificateResponse(existingCert.get());
        }

        // Get enrollment
        Optional<Enrollment> enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
        if (enrollment.isEmpty()) {
            throw new RuntimeException("Student is not enrolled in this course");
        }

        // Create certificate
        Certificate certificate = new Certificate();
        certificate.setEnrollmentId(enrollment.get().getEnrollmentId());
        certificate.setStudentId(studentId);
        certificate.setCourseId(courseId);
        certificate.setUniqueCode("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Certificate saved = certificateRepository.save(certificate);

        // Update enrollment status to completed
        enrollment.get().setCompletionStatus("Completed");
        enrollmentRepository.save(enrollment.get());

        // Award badge for course completion
        try {
            badgeService.awardCourseBadge(studentId, courseId);
        } catch (Exception e) {
            // Log but don't fail certificate creation if badge fails
            System.err.println("Failed to award badge: " + e.getMessage());
        }

        return createCertificateResponse(saved);
    }

    /**
     * Check if a student has a certificate for a course
     */
    public boolean hasCertificate(@NonNull Long studentId, @NonNull Long courseId) {
        return certificateRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }

    /**
     * Get all certificates for a student
     */
    @Transactional(readOnly = true)
    public List<CertificateResponse> getStudentCertificates(@NonNull Long studentId) {
        return certificateRepository.findByStudentId(studentId)
            .stream()
            .map(this::createCertificateResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get a certificate by ID
     */
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateById(@NonNull Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
            .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + certificateId));
        return createCertificateResponse(certificate);
    }

    /**
     * Verify a certificate by its unique code
     */
    @Transactional(readOnly = true)
    public CertificateResponse verifyCertificate(@NonNull String uniqueCode) {
        // Try exact match first, then fall back to a case-insensitive lookup
        Optional<Certificate> certOpt = certificateRepository.findByUniqueCode(uniqueCode);
        if (certOpt.isEmpty()) {
            certOpt = certificateRepository.findByUniqueCodeIgnoreCase(uniqueCode.trim());
        }
        Certificate certificate = certOpt.orElseThrow(() -> new RuntimeException("Certificate not found with code: " + uniqueCode));
        return createCertificateResponse(certificate);
    }

    /**
     * Helper method to create certificate response with course and student details
     */
    private CertificateResponse createCertificateResponse(Certificate certificate) {
        Course course = courseRepository.findById(certificate.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + certificate.getCourseId()));
        
        CertificateResponse response = new CertificateResponse(certificate);
        response.setCourseTitle(course.getTitle());
        
        // Fetch instructor name if possible
        try {
            Long instrId = course.getInstructorId();
            instructorRepository.findById(instrId).ifPresent(instr -> {
                response.setInstructorName(instr.getFirstName() + " " + instr.getLastName());
            });
        } catch (Exception e) {
            // ignore
        }

        // Try to hydrate the response with the student's real name; fall back to the legacy label otherwise
        studentRepository.findById(certificate.getStudentId()).ifPresent(student -> {
            StringBuilder nameBuilder = new StringBuilder();
            if (student.getFirstName() != null && !student.getFirstName().isBlank()) {
                nameBuilder.append(student.getFirstName().trim());
            }
            if (student.getLastName() != null && !student.getLastName().isBlank()) {
                if (nameBuilder.length() > 0) {
                    nameBuilder.append(' ');
                }
                nameBuilder.append(student.getLastName().trim());
            }
            if (nameBuilder.length() > 0) {
                response.setStudentName(nameBuilder.toString());
            }
        });
        if (response.getStudentName() == null || response.getStudentName().isBlank()) {
            response.setStudentName("Student #" + certificate.getStudentId());
        }

        // Platform name
        response.setPlatformName("LearnHub");
        
        return response;
    }
}

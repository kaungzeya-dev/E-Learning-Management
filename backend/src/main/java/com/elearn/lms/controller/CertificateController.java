package com.elearn.lms.controller;

import com.elearn.lms.dto.CertificateResponse;
import com.elearn.lms.service.CertificateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    /**
     * Generate a certificate for a student who completed a course
     */
    @PostMapping("/generate/student/{studentId}/course/{courseId}")
    public ResponseEntity<CertificateResponse> generateCertificate(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        try {
            CertificateResponse response = certificateService.generateCertificate(studentId, courseId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Get all certificates for a student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CertificateResponse>> getStudentCertificates(@PathVariable Long studentId) {
        try {
            List<CertificateResponse> responses = certificateService.getStudentCertificates(studentId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Get a certificate by ID
     */
    @GetMapping("/{certificateId}")
    public ResponseEntity<CertificateResponse> getCertificateById(@PathVariable Long certificateId) {
        try {
            CertificateResponse response = certificateService.getCertificateById(certificateId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Verify a certificate by its unique code
     */
    @GetMapping("/verify/{uniqueCode}")
    public ResponseEntity<CertificateResponse> verifyCertificate(@PathVariable String uniqueCode) {
        try {
            CertificateResponse response = certificateService.verifyCertificate(uniqueCode);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}

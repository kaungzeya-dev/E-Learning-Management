package com.elearn.lms.controller;

import com.elearn.lms.dto.StudentLoginRequest;
import com.elearn.lms.dto.StudentLoginResponse;
import com.elearn.lms.dto.StudentResponse;
import com.elearn.lms.dto.StudentSignupRequest;
import com.elearn.lms.entity.Student;
import com.elearn.lms.security.JwtService;
import com.elearn.lms.dto.ForgotPasswordRequest;
import com.elearn.lms.dto.ResetPasswordRequest;
import com.elearn.lms.service.PasswordResetService;
import com.elearn.lms.service.StudentAuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/student")
public class StudentAuthController {

    private final StudentAuthService studentAuthService;
    private final JwtService jwtService;
    private final PasswordResetService passwordResetService;

    public StudentAuthController(StudentAuthService studentAuthService, JwtService jwtService, PasswordResetService passwordResetService) {
        this.studentAuthService = studentAuthService;
        this.jwtService = jwtService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody StudentSignupRequest request) {
        try {
            Student s = studentAuthService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Signup successful", "studentId", s.getId()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody StudentLoginRequest request) {
        return studentAuthService.authenticate(request)
                .<ResponseEntity<?>>map(s -> {
                    String token = jwtService.generateToken(s.getEmail(), Map.of("role", "STUDENT", "studentId", s.getId()));
                    return ResponseEntity.ok(new StudentLoginResponse(token, new StudentResponse(s)));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Invalid credentials")));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        System.out.println("Forgot password request: " + request.getEmail());
        passwordResetService.requestReset(request.getEmail(), "STUDENT");
        return ResponseEntity.ok(Map.of("message", "If the email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        boolean ok = passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        if (!ok) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid or expired token"));
        }
        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
    }
}



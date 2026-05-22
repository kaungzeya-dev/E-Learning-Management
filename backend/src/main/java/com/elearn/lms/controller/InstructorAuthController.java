package com.elearn.lms.controller;

import com.elearn.lms.dto.InstructorLoginRequest;
import com.elearn.lms.dto.InstructorLoginResponse;
import com.elearn.lms.dto.InstructorResponse;
import com.elearn.lms.dto.InstructorSignupRequest;
import com.elearn.lms.entity.Instructor;
import com.elearn.lms.security.JwtService;
import com.elearn.lms.dto.ForgotPasswordRequest;
import com.elearn.lms.dto.ResetPasswordRequest;
import com.elearn.lms.service.PasswordResetService;
import com.elearn.lms.service.InstructorAuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth/instructor")
public class InstructorAuthController {

    private static final Logger logger = LoggerFactory.getLogger(InstructorAuthController.class);
    private final InstructorAuthService instructorAuthService;
    private final JwtService jwtService;
    private final PasswordResetService passwordResetService;

    public InstructorAuthController(InstructorAuthService instructorAuthService, JwtService jwtService, PasswordResetService passwordResetService) {
        this.instructorAuthService = instructorAuthService;
        this.jwtService = jwtService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody InstructorSignupRequest request) {
        logger.info("Received signup request for email: {}", request.getEmail());
        logger.debug("Signup request - firstName: {}, lastName: {}, email: {}, bio: {}, expertise: {}", 
                request.getFirstName(), request.getLastName(), request.getEmail(), 
                request.getBio(), request.getExpertise());
        
        try {
            Instructor i = instructorAuthService.register(request);
            logger.info("Instructor registered successfully with ID: {}", i.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Signup successful", "instructorId", i.getId()));
        } catch (IllegalArgumentException ex) {
            logger.error("Registration failed: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        logger.error("Validation failed: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Validation failed", "errors", errors));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody InstructorLoginRequest request) {
        return instructorAuthService.authenticate(request)
                .<ResponseEntity<?>>map(i -> {
                    String token = jwtService.generateToken(i.getEmail(), Map.of("role", "INSTRUCTOR", "instructorId", i.getId()));
                    return ResponseEntity.ok(new InstructorLoginResponse(token, new InstructorResponse(i)));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Invalid credentials")));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestReset(request.getEmail(), "INSTRUCTOR");
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



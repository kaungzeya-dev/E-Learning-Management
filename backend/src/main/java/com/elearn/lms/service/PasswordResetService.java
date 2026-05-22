package com.elearn.lms.service;

import com.elearn.lms.entity.Instructor;
import com.elearn.lms.entity.PasswordResetToken;
import com.elearn.lms.entity.Student;
import com.elearn.lms.repository.InstructorRepository;
import com.elearn.lms.repository.PasswordResetTokenRepository;
import com.elearn.lms.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

	private final StudentRepository studentRepository;
	private final InstructorRepository instructorRepository;
	private final PasswordResetTokenRepository tokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final EmailService emailService;

	private static final Duration TOKEN_TTL = Duration.ofMinutes(30);

	public PasswordResetService(StudentRepository studentRepository,
	                            InstructorRepository instructorRepository,
	                            PasswordResetTokenRepository tokenRepository,
	                            PasswordEncoder passwordEncoder,
	                            EmailService emailService) {
		this.studentRepository = studentRepository;
		this.instructorRepository = instructorRepository;
		this.tokenRepository = tokenRepository;
		this.passwordEncoder = passwordEncoder;
		this.emailService = emailService;
	}

	@Transactional
	public void requestReset(String email, String role) {
		String normalizedRole = normalizeRole(role);

		boolean exists = switch (normalizedRole) {
			case "STUDENT" -> studentRepository.existsByEmail(email);
			case "INSTRUCTOR" -> instructorRepository.existsByEmail(email);
			default -> false;
		};

		// Always behave the same whether the email exists or not to prevent user enumeration
		if (exists) {
			// Cleanup old tokens for this email/role and expired tokens
			tokenRepository.deleteByEmailAndUserTypeOrExpiresAtBefore(email, normalizedRole, Instant.now());

			PasswordResetToken token = new PasswordResetToken();
			token.setEmail(email);
			token.setUserType(normalizedRole);
			token.setToken(UUID.randomUUID().toString().replace("-", ""));
			token.setExpiresAt(Instant.now().plus(TOKEN_TTL));
			tokenRepository.save(token);

			emailService.sendPasswordResetEmail(email, normalizedRole, token.getToken());
		}
		// If not exists, still return successfully (no-op)
	}

	@Transactional
	public boolean resetPassword(String tokenValue, String newPassword) {
		Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(tokenValue);
		if (tokenOpt.isEmpty()) return false;
		PasswordResetToken token = tokenOpt.get();
		if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) {
			return false;
		}

		switch (token.getUserType()) {
			case "STUDENT" -> {
				Student student = studentRepository.findByEmail(token.getEmail()).orElse(null);
				if (student == null) return false;
				student.setPasswordHash(passwordEncoder.encode(newPassword));
				studentRepository.save(student);
			}
			case "INSTRUCTOR" -> {
				Instructor instructor = instructorRepository.findByEmail(token.getEmail()).orElse(null);
				if (instructor == null) return false;
				instructor.setPasswordHash(passwordEncoder.encode(newPassword));
				instructorRepository.save(instructor);
			}
			default -> { return false; }
		}

		token.setUsed(true);
		tokenRepository.save(token);
		return true;
	}

	private String normalizeRole(String role) {
		if (role == null) return "";
		String r = role.trim().toUpperCase();
		if ("STUDENT".equals(r) || "INSTRUCTOR".equals(r)) return r;
		return "";
	}
}


package com.elearn.lms.repository;

import com.elearn.lms.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

	Optional<PasswordResetToken> findByToken(String token);

	long deleteByEmailAndUserTypeOrExpiresAtBefore(String email, String userType, Instant before);
}


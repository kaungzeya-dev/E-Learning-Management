package com.elearn.lms.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "PASSWORD_RESET_TOKENS", indexes = {
		@Index(name = "idx_prt_token", columnList = "token", unique = true),
		@Index(name = "idx_prt_email", columnList = "email")
})
public class PasswordResetToken {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "email", nullable = false, length = 255)
	private String email;

	@Column(name = "user_type", nullable = false, length = 32)
	private String userType; // STUDENT or INSTRUCTOR

	@Column(name = "token", nullable = false, unique = true, length = 100)
	private String token;

	@Column(name = "expires_at", nullable = false)
	private Instant expiresAt;

	@Column(name = "used", nullable = false)
	private boolean used = false;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }

	public String getUserType() { return userType; }
	public void setUserType(String userType) { this.userType = userType; }

	public String getToken() { return token; }
	public void setToken(String token) { this.token = token; }

	public Instant getExpiresAt() { return expiresAt; }
	public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

	public boolean isUsed() { return used; }
	public void setUsed(boolean used) { this.used = used; }
}


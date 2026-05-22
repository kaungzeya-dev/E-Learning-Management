package com.elearn.lms.service;

import com.elearn.lms.dto.InstructorLoginRequest;
import com.elearn.lms.dto.InstructorSignupRequest;
import com.elearn.lms.entity.Instructor;
import com.elearn.lms.repository.InstructorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class InstructorAuthService {

    private static final Logger logger = LoggerFactory.getLogger(InstructorAuthService.class);
    private final InstructorRepository instructorRepository;
    private final PasswordEncoder passwordEncoder;

    public InstructorAuthService(InstructorRepository instructorRepository, PasswordEncoder passwordEncoder) {
        this.instructorRepository = instructorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Instructor register(InstructorSignupRequest request) {
        logger.info("Registering instructor with email: {}", request.getEmail());
        
        if (instructorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        // Validate required fields
        if (request.getBio() == null || request.getBio().trim().isEmpty()) {
            throw new IllegalArgumentException("Bio is required and cannot be empty");
        }
        if (request.getExpertise() == null || request.getExpertise().trim().isEmpty()) {
            throw new IllegalArgumentException("Expertise is required and cannot be empty");
        }
        
        Instructor i = new Instructor();
        i.setFirstName(request.getFirstName());
        i.setLastName(request.getLastName());
        i.setEmail(request.getEmail());
        i.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        i.setBio(request.getBio().trim());
        i.setExpertise(request.getExpertise().trim());
        
        logger.debug("Saving instructor - bio: '{}', expertise: '{}'", i.getBio(), i.getExpertise());
        Instructor saved = instructorRepository.save(i);
        logger.info("Instructor saved with ID: {}, bio length: {}, expertise: {}", 
                saved.getId(), saved.getBio() != null ? saved.getBio().length() : 0, saved.getExpertise());
        return saved;
    }

    public Optional<Instructor> authenticate(InstructorLoginRequest request) {
        return instructorRepository.findByEmail(request.getEmail())
                .filter(i -> passwordEncoder.matches(request.getPassword(), i.getPasswordHash()));
    }
}



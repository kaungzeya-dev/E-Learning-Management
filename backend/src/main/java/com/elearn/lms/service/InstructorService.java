package com.elearn.lms.service;

import com.elearn.lms.dto.InstructorSignupRequest;
import com.elearn.lms.dto.InstructorUpdateRequest;
import com.elearn.lms.entity.Instructor;
import com.elearn.lms.repository.InstructorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InstructorService {

    private final InstructorRepository instructorRepository;
    private final PasswordEncoder passwordEncoder;

    public InstructorService(InstructorRepository instructorRepository, PasswordEncoder passwordEncoder) {
        this.instructorRepository = instructorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Instructor> findAll() { return instructorRepository.findAll(); }

    public Instructor findByIdOrThrow(Long id) { return instructorRepository.findById(id).orElseThrow(() -> new RuntimeException("Instructor not found")); }

    @Transactional
    public Instructor create(InstructorSignupRequest request) {
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
        return instructorRepository.save(i);
    }

    @Transactional
    public Instructor update(Long id, InstructorUpdateRequest request) {
        Instructor existing = findByIdOrThrow(id);
        // If email is changing and already taken by another, reject
        if (!existing.getEmail().equalsIgnoreCase(request.getEmail())
                && instructorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());
        existing.setEmail(request.getEmail());
        existing.setBio(request.getBio().trim());
        existing.setExpertise(request.getExpertise().trim());
        return instructorRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) { instructorRepository.deleteById(id); }
    
    // Password change method removed
}



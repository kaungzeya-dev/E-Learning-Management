package com.elearn.lms.service;

import com.elearn.lms.dto.StudentSignupRequest;
import com.elearn.lms.dto.StudentUpdateRequest;
import com.elearn.lms.entity.Student;
import com.elearn.lms.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Student> findAll() { return studentRepository.findAll(); }

    public Student findByIdOrThrow(Long id) { return studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found")); }

    @Transactional
    public Student create(StudentSignupRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) throw new IllegalArgumentException("Email already registered");
        Student s = new Student();
        s.setFirstName(request.getFirstName());
        s.setLastName(request.getLastName());
        s.setEmail(request.getEmail());
        s.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        return studentRepository.save(s);
    }

    @Transactional
    public Student update(Long id, StudentUpdateRequest request) {
        Student existing = findByIdOrThrow(id);
        // If email is changing and already taken by another, reject
        if (!existing.getEmail().equalsIgnoreCase(request.getEmail())
                && studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());
        existing.setEmail(request.getEmail());
        return studentRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) { studentRepository.deleteById(id); }
    
    // Password change method removed
}



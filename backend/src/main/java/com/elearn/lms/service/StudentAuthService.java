package com.elearn.lms.service;

import com.elearn.lms.dto.StudentLoginRequest;
import com.elearn.lms.dto.StudentSignupRequest;
import com.elearn.lms.entity.Student;
import com.elearn.lms.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class StudentAuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentAuthService(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Student register(StudentSignupRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        Student s = new Student();
        s.setFirstName(request.getFirstName());
        s.setLastName(request.getLastName());
        s.setEmail(request.getEmail());
        s.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        return studentRepository.save(s);
    }

    public Optional<Student> authenticate(StudentLoginRequest request) {
        return studentRepository.findByEmail(request.getEmail())
                .filter(s -> passwordEncoder.matches(request.getPassword(), s.getPasswordHash()));
    }
}



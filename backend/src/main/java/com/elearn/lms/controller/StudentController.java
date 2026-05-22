package com.elearn.lms.controller;

import com.elearn.lms.dto.StudentSignupRequest;
import com.elearn.lms.dto.StudentUpdateRequest;
import com.elearn.lms.entity.Student;
import com.elearn.lms.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> list() { return studentService.findAll(); }

    @GetMapping("/{id}")
    public Student get(@PathVariable Long id) { return studentService.findByIdOrThrow(id); }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody StudentSignupRequest request) {
        try {
            Student s = studentService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(s);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody StudentUpdateRequest request) {
        try {
            Student updated = studentService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    // Password change endpoint removed
}



package com.elearn.lms.controller;

import com.elearn.lms.dto.CourseProgressResponse;
import com.elearn.lms.dto.StudentProgressRequest;
import com.elearn.lms.dto.StudentProgressResponse;
import com.elearn.lms.service.StudentProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class StudentProgressController {

    private final StudentProgressService studentProgressService;

    public StudentProgressController(StudentProgressService studentProgressService) {
        this.studentProgressService = studentProgressService;
    }

    /**
     * Mark a content as completed
     */
    @PostMapping("/mark-completed")
    public ResponseEntity<StudentProgressResponse> markContentAsCompleted(@RequestBody StudentProgressRequest request) {
        try {
            StudentProgressResponse response = studentProgressService.markContentAsCompleted(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Get course progress for a student
     */
    @GetMapping("/course/{courseId}/student/{studentId}")
    public ResponseEntity<CourseProgressResponse> getCourseProgress(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        try {
            CourseProgressResponse response = studentProgressService.getCourseProgress(studentId, courseId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Get all course progress for a student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CourseProgressResponse>> getAllCourseProgressForStudent(
            @PathVariable Long studentId) {
        try {
            List<CourseProgressResponse> responses = studentProgressService.getAllCourseProgressForStudent(studentId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}

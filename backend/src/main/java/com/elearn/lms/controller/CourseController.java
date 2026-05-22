package com.elearn.lms.controller;

import com.elearn.lms.dto.CourseRequest;
import com.elearn.lms.dto.CourseResponse;
import com.elearn.lms.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

	@Autowired
	private CourseService courseService;

	@PostMapping
	public ResponseEntity<?> createCourse(@RequestBody CourseRequest request) {
		try {
			CourseResponse course = courseService.createCourse(request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course created successfully");
			response.put("data", course);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	@GetMapping
	public ResponseEntity<?> getAllCourses() {
		try {
			List<CourseResponse> courses = courseService.getAllCourses();
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", courses.size());
			response.put("data", courses);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getCourseById(@PathVariable @NonNull Long id) {
		try {
			CourseResponse course = courseService.getCourseById(id);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("data", course);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}

	@GetMapping("/instructor/{instructorId}")
	public ResponseEntity<?> getCoursesByInstructor(@PathVariable @NonNull Long instructorId) {
		try {
			List<CourseResponse> courses = courseService.getCoursesByInstructor(instructorId);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", courses.size());
			response.put("data", courses);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<?> getCoursesByStatus(@PathVariable String status) {
		try {
			List<CourseResponse> courses = courseService.getCoursesByStatus(status);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", courses.size());
			response.put("data", courses);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateCourse(@PathVariable @NonNull Long id, @RequestBody @NonNull CourseRequest request) {
		try {
			CourseResponse course = courseService.updateCourse(id, request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course updated successfully");
			response.put("data", course);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteCourse(@PathVariable @NonNull Long id) {
		try {
			courseService.deleteCourse(id);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course deleted successfully");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}
}

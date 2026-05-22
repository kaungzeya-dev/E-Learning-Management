package com.elearn.lms.controller;

import com.elearn.lms.dto.CourseModuleRequest;
import com.elearn.lms.dto.CourseModuleResponse;
import com.elearn.lms.dto.CourseModuleWithContentsRequest;
import com.elearn.lms.dto.CourseModuleWithContentsResponse;
import com.elearn.lms.service.CourseModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/course-modules")
@CrossOrigin(origins = "*")
public class CourseModuleController {

	@Autowired
	private CourseModuleService courseModuleService;

	@PostMapping
	public ResponseEntity<?> createModule(@RequestBody CourseModuleRequest request) {
		try {
			CourseModuleResponse module = courseModuleService.createModule(request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course module created successfully");
			response.put("data", module);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	@PostMapping("/with-contents")
	public ResponseEntity<?> createModuleWithContents(@RequestBody CourseModuleWithContentsRequest request) {
		try {
			CourseModuleWithContentsResponse module = courseModuleService.createModuleWithContents(request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course module with contents created successfully");
			response.put("data", module);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	@GetMapping
	public ResponseEntity<?> getAllModules() {
		try {
			List<CourseModuleWithContentsResponse> modules = courseModuleService.getAllModules();
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", modules.size());
			response.put("data", modules);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getModuleById(@PathVariable @NonNull Long id) {
		try {
			CourseModuleWithContentsResponse module = courseModuleService.getModuleById(id);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("data", module);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}

	@GetMapping("/course/{courseId}")
	public ResponseEntity<?> getModulesByCourseId(@PathVariable @NonNull Long courseId) {
		try {
			List<CourseModuleWithContentsResponse> modules = courseModuleService.getModulesByCourseId(courseId);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", modules.size());
			response.put("data", modules);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateModule(@PathVariable @NonNull Long id, @RequestBody @NonNull CourseModuleRequest request) {
		try {
			CourseModuleResponse module = courseModuleService.updateModule(id, request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course module updated successfully");
			response.put("data", module);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteModule(@PathVariable @NonNull Long id) {
		try {
			courseModuleService.deleteModule(id);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course module deleted successfully");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}
}


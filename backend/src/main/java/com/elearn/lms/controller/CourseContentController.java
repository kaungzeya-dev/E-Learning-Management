package com.elearn.lms.controller;

import com.elearn.lms.dto.CourseContentRequest;
import com.elearn.lms.dto.CourseContentResponse;
import com.elearn.lms.service.CourseContentService;
import com.elearn.lms.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/course-contents")
@CrossOrigin(origins = "*")
public class CourseContentController {

	@Autowired
	private CourseContentService courseContentService;

	@Autowired
	private FileStorageService fileStorageService;

	@PostMapping("/upload")
	public ResponseEntity<?> uploadFile(
			@RequestParam("file") MultipartFile file,
			@RequestParam("moduleId") Long moduleId,
			@RequestParam("title") String title,
			@RequestParam("contentType") String contentType,
			@RequestParam(value = "contentOrder", required = false) Integer contentOrder) {
		try {
			// Store the file
			String filePath = fileStorageService.storeFile(file, contentType);
			
			// Create content record
			CourseContentRequest request = new CourseContentRequest();
			request.setModuleId(moduleId);
			request.setTitle(title);
			request.setContentType(contentType);
			request.setFilePath(filePath);
			request.setContentOrder(contentOrder);
			
			CourseContentResponse content = courseContentService.createContent(request);
			
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "File uploaded successfully");
			response.put("data", content);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	@GetMapping("/files/{contentType}/{fileName:.+}")
	public ResponseEntity<Resource> downloadFile(
			@PathVariable String contentType,
			@PathVariable String fileName,
			HttpServletRequest request) {
		try {
			// Load file as Resource
			Resource resource = fileStorageService.loadFileAsResource(contentType + "/" + fileName);

			// Try to determine file's content type
			String contentTypeHeader = null;
			try {
				contentTypeHeader = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
			} catch (IOException ex) {
				// Could not determine file type
			}

			// Fallback to the default content type if type could not be determined
			if (contentTypeHeader == null) {
				contentTypeHeader = "application/octet-stream";
			}

			return ResponseEntity.ok()
					.contentType(MediaType.parseMediaType(contentTypeHeader))
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
					.body(resource);
		} catch (Exception e) {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping
	public ResponseEntity<?> createContent(@RequestBody CourseContentRequest request) {
		try {
			CourseContentResponse content = courseContentService.createContent(request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course content created successfully");
			response.put("data", content);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	@GetMapping
	public ResponseEntity<?> getAllContents() {
		try {
			List<CourseContentResponse> contents = courseContentService.getAllContents();
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", contents.size());
			response.put("data", contents);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getContentById(@PathVariable @NonNull Long id) {
		try {
			CourseContentResponse content = courseContentService.getContentById(id);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("data", content);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}

	@GetMapping("/module/{moduleId}")
	public ResponseEntity<?> getContentsByModuleId(@PathVariable @NonNull Long moduleId) {
		try {
			List<CourseContentResponse> contents = courseContentService.getContentsByModuleId(moduleId);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", contents.size());
			response.put("data", contents);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@GetMapping("/type/{contentType}")
	public ResponseEntity<?> getContentsByType(@PathVariable @NonNull String contentType) {
		try {
			List<CourseContentResponse> contents = courseContentService.getContentsByType(contentType);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", contents.size());
			response.put("data", contents);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@GetMapping("/module/{moduleId}/type/{contentType}")
	public ResponseEntity<?> getContentsByModuleIdAndType(@PathVariable @NonNull Long moduleId, @PathVariable @NonNull String contentType) {
		try {
			List<CourseContentResponse> contents = courseContentService.getContentsByModuleIdAndType(moduleId, contentType);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("count", contents.size());
			response.put("data", contents);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateContent(@PathVariable @NonNull Long id, @RequestBody @NonNull CourseContentRequest request) {
		try {
			CourseContentResponse content = courseContentService.updateContent(id, request);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course content updated successfully");
			response.put("data", content);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteContent(@PathVariable @NonNull Long id) {
		try {
			courseContentService.deleteContent(id);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Course content deleted successfully");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}
	}
}


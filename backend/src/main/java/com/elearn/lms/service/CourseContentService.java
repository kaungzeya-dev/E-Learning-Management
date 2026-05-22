package com.elearn.lms.service;

import com.elearn.lms.dto.CourseContentRequest;
import com.elearn.lms.dto.CourseContentResponse;
import com.elearn.lms.entity.CourseContent;
import com.elearn.lms.entity.CourseModule;
import com.elearn.lms.repository.CourseContentRepository;
import com.elearn.lms.repository.CourseModuleRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseContentService {

	private final CourseContentRepository courseContentRepository;
	private final CourseModuleRepository courseModuleRepository;

	public CourseContentService(CourseContentRepository courseContentRepository, CourseModuleRepository courseModuleRepository) {
		this.courseContentRepository = courseContentRepository;
		this.courseModuleRepository = courseModuleRepository;
	}

	public CourseContentResponse createContent(@NonNull CourseContentRequest request) {
		CourseModule module = courseModuleRepository.findById(request.getModuleId())
				.orElseThrow(() -> new RuntimeException("Module not found with id: " + request.getModuleId()));

		// Validate content type
		String contentType = request.getContentType();
		if (contentType == null || (!contentType.equals("Video") && !contentType.equals("Reading") && !contentType.equals("Quiz"))) {
			throw new RuntimeException("Invalid content type. Must be 'Video', 'Reading', or 'Quiz'");
		}

		CourseContent content = new CourseContent();
		content.setModule(module);
		content.setTitle(request.getTitle());
		content.setContentType(contentType);
		content.setContentUrl(request.getContentUrl());
		content.setFilePath(request.getFilePath());
		content.setContentOrder(request.getContentOrder() != null ? request.getContentOrder() : 0);

		CourseContent saved = courseContentRepository.save(content);
		return new CourseContentResponse(saved);
	}

	public List<CourseContentResponse> getAllContents() {
		return courseContentRepository.findAll()
				.stream()
				.map(CourseContentResponse::new)
				.collect(Collectors.toList());
	}

	public CourseContentResponse getContentById(@NonNull Long id) {
		CourseContent content = courseContentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Content not found with id: " + id));
		return new CourseContentResponse(content);
	}

	public List<CourseContentResponse> getContentsByModuleId(@NonNull Long moduleId) {
		return courseContentRepository.findByModuleIdOrderByContentOrderAsc(moduleId)
				.stream()
				.map(CourseContentResponse::new)
				.collect(Collectors.toList());
	}

	public List<CourseContentResponse> getContentsByType(@NonNull String contentType) {
		return courseContentRepository.findByContentType(contentType)
				.stream()
				.map(CourseContentResponse::new)
				.collect(Collectors.toList());
	}

	public List<CourseContentResponse> getContentsByModuleIdAndType(@NonNull Long moduleId, @NonNull String contentType) {
		return courseContentRepository.findByModuleIdAndContentType(moduleId, contentType)
				.stream()
				.map(CourseContentResponse::new)
				.collect(Collectors.toList());
	}

	public CourseContentResponse updateContent(@NonNull Long id, @NonNull CourseContentRequest request) {
		CourseContent content = courseContentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Content not found with id: " + id));

		if (request.getModuleId() != null && !request.getModuleId().equals(content.getModuleId())) {
			CourseModule module = courseModuleRepository.findById(request.getModuleId())
					.orElseThrow(() -> new RuntimeException("Module not found with id: " + request.getModuleId()));
			content.setModule(module);
		}

		if (request.getTitle() != null && !request.getTitle().isEmpty()) {
			content.setTitle(request.getTitle());
		}

		if (request.getContentType() != null && !request.getContentType().isEmpty()) {
			String contentType = request.getContentType();
			if (!contentType.equals("Video") && !contentType.equals("Reading") && !contentType.equals("Quiz")) {
				throw new RuntimeException("Invalid content type. Must be 'Video', 'Reading', or 'Quiz'");
			}
			content.setContentType(contentType);
		}

		if (request.getContentUrl() != null) {
			content.setContentUrl(request.getContentUrl());
		}

		if (request.getFilePath() != null) {
			content.setFilePath(request.getFilePath());
		}

		if (request.getContentOrder() != null) {
			content.setContentOrder(request.getContentOrder());
		}

		CourseContent updated = courseContentRepository.save(content);
		return new CourseContentResponse(updated);
	}

	public void deleteContent(@NonNull Long id) {
		if (!courseContentRepository.existsById(id)) {
			throw new RuntimeException("Content not found with id: " + id);
		}
		courseContentRepository.deleteById(id);
	}
}


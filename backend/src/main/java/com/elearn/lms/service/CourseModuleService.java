package com.elearn.lms.service;

import com.elearn.lms.dto.CourseContentRequest;
import com.elearn.lms.dto.CourseModuleRequest;
import com.elearn.lms.dto.CourseModuleResponse;
import com.elearn.lms.dto.CourseModuleWithContentsRequest;
import com.elearn.lms.dto.CourseModuleWithContentsResponse;
import com.elearn.lms.entity.Course;
import com.elearn.lms.entity.CourseContent;
import com.elearn.lms.entity.CourseModule;
import com.elearn.lms.repository.CourseModuleRepository;
import com.elearn.lms.repository.CourseRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseModuleService {

	private final CourseModuleRepository courseModuleRepository;
	private final CourseRepository courseRepository;

	public CourseModuleService(CourseModuleRepository courseModuleRepository, CourseRepository courseRepository) {
		this.courseModuleRepository = courseModuleRepository;
		this.courseRepository = courseRepository;
	}

	public CourseModuleResponse createModule(@NonNull CourseModuleRequest request) {
		Course course = courseRepository.findById(request.getCourseId())
				.orElseThrow(() -> new RuntimeException("Course not found with id: " + request.getCourseId()));

		CourseModule module = new CourseModule();
		module.setCourse(course);
		module.setTitle(request.getTitle());
		module.setDescription(request.getDescription());
		module.setModuleOrder(request.getModuleOrder() != null ? request.getModuleOrder() : 0);

		CourseModule saved = courseModuleRepository.save(module);
		return new CourseModuleResponse(saved);
	}

	@Transactional(readOnly = true)
	public List<CourseModuleWithContentsResponse> getAllModules() {
		List<CourseModule> modules = courseModuleRepository.findAll();
		// Force loading of contents for each module within transaction
		modules.forEach(module -> module.getContents().size());
		return modules.stream()
				.map(CourseModuleWithContentsResponse::new)
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public CourseModuleWithContentsResponse getModuleById(@NonNull Long id) {
		CourseModule module = courseModuleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Module not found with id: " + id));
		// Force loading of contents within transaction
		module.getContents().size(); // Trigger lazy loading
		return new CourseModuleWithContentsResponse(module);
	}

	@Transactional
	public CourseModuleWithContentsResponse createModuleWithContents(@NonNull CourseModuleWithContentsRequest request) {
		// Create the module first
		Course course = courseRepository.findById(request.getCourseId())
				.orElseThrow(() -> new RuntimeException("Course not found with id: " + request.getCourseId()));

		CourseModule module = new CourseModule();
		module.setCourse(course);
		module.setTitle(request.getTitle());
		module.setDescription(request.getDescription());
		module.setModuleOrder(request.getModuleOrder() != null ? request.getModuleOrder() : 0);

		// Track content order across all content types
		int contentOrder = 1;

		// Add videos
		if (request.getVideos() != null && !request.getVideos().isEmpty()) {
			for (CourseContentRequest videoRequest : request.getVideos()) {
				CourseContent video = new CourseContent();
				video.setModule(module);
				video.setTitle(videoRequest.getTitle());
				video.setContentType("Video");
				video.setContentUrl(videoRequest.getContentUrl());
				video.setContentOrder(videoRequest.getContentOrder() != null ? videoRequest.getContentOrder() : contentOrder++);
				module.getContents().add(video);
			}
		}

		// Add slides (Reading type)
		if (request.getSlides() != null && !request.getSlides().isEmpty()) {
			for (CourseContentRequest slideRequest : request.getSlides()) {
				CourseContent slide = new CourseContent();
				slide.setModule(module);
				slide.setTitle(slideRequest.getTitle());
				slide.setContentType("Reading");
				slide.setContentUrl(slideRequest.getContentUrl());
				slide.setContentOrder(slideRequest.getContentOrder() != null ? slideRequest.getContentOrder() : contentOrder++);
				module.getContents().add(slide);
			}
		}

		// Add quizzes
		if (request.getQuizzes() != null && !request.getQuizzes().isEmpty()) {
			for (CourseContentRequest quizRequest : request.getQuizzes()) {
				CourseContent quiz = new CourseContent();
				quiz.setModule(module);
				quiz.setTitle(quizRequest.getTitle());
				quiz.setContentType("Quiz");
				quiz.setContentUrl(quizRequest.getContentUrl());
				quiz.setContentOrder(quizRequest.getContentOrder() != null ? quizRequest.getContentOrder() : contentOrder++);
				module.getContents().add(quiz);
			}
		}

		// Save module - cascade will persist all contents
		CourseModule savedModule = courseModuleRepository.save(module);
		
		// Force load contents to ensure they're loaded for the response
		savedModule.getContents().size();
		
		return new CourseModuleWithContentsResponse(savedModule);
	}

	@Transactional(readOnly = true)
	public List<CourseModuleWithContentsResponse> getModulesByCourseId(@NonNull Long courseId) {
		List<CourseModule> modules = courseModuleRepository.findByCourseIdOrderByModuleOrderAsc(courseId);
		// Force loading of contents for each module within transaction
		modules.forEach(module -> module.getContents().size());
		return modules.stream()
				.map(CourseModuleWithContentsResponse::new)
				.collect(Collectors.toList());
	}

	public CourseModuleResponse updateModule(@NonNull Long id, @NonNull CourseModuleRequest request) {
		CourseModule module = courseModuleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Module not found with id: " + id));

		if (request.getCourseId() != null && !request.getCourseId().equals(module.getCourseId())) {
			Course course = courseRepository.findById(request.getCourseId())
					.orElseThrow(() -> new RuntimeException("Course not found with id: " + request.getCourseId()));
			module.setCourse(course);
		}

		if (request.getTitle() != null && !request.getTitle().isEmpty()) {
			module.setTitle(request.getTitle());
		}

		if (request.getDescription() != null) {
			module.setDescription(request.getDescription());
		}

		if (request.getModuleOrder() != null) {
			module.setModuleOrder(request.getModuleOrder());
		}

		CourseModule updated = courseModuleRepository.save(module);
		return new CourseModuleResponse(updated);
	}

	public void deleteModule(@NonNull Long id) {
		if (!courseModuleRepository.existsById(id)) {
			throw new RuntimeException("Module not found with id: " + id);
		}
		courseModuleRepository.deleteById(id);
	}
}


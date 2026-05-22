package com.elearn.lms.service;

import com.elearn.lms.dto.CategoryNameDTO;
import com.elearn.lms.dto.CourseRequest;
import com.elearn.lms.dto.CourseResponse;
import com.elearn.lms.entity.Category;
import com.elearn.lms.entity.Course;
import com.elearn.lms.repository.CategoryRepository;
import com.elearn.lms.repository.CourseRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

	private final CourseRepository courseRepository;
	private final CategoryRepository categoryRepository;

	public CourseService(CourseRepository courseRepository, CategoryRepository categoryRepository) {
		this.courseRepository = courseRepository;
		this.categoryRepository = categoryRepository;
	}

	public CourseResponse createCourse(@NonNull CourseRequest request) {
		Course course = new Course();
		course.setCategoryId(request.getCategoryId());
		course.setInstructorId(request.getInstructorId());
		course.setTitle(request.getTitle());
		course.setDescription(request.getDescription());
		course.setStatus(request.getStatus() != null ? request.getStatus() : "Draft");
		course.setThumbnail(request.getThumbnail() != null ? request.getThumbnail() : "");
		course.setLevel(request.getLevel() != null ? request.getLevel() : "Beginner");
		course.setDuration(request.getDuration() != null ? request.getDuration() : "6 weeks");

		Course saved = courseRepository.save(course);
		CourseResponse response = new CourseResponse(saved);
		addCategoryInfo(response);
		return response;
	}

	public List<CourseResponse> getAllCourses() {
		return courseRepository.findAll()
			.stream()
			.map(course -> {
				CourseResponse response = new CourseResponse(course);
				// Add category information
				addCategoryInfo(response);
				return response;
			})
			.collect(Collectors.toList());
	}
	
	/**
	 * Helper method to add category information to a CourseResponse
	 * @param response CourseResponse to update
	 */
	private void addCategoryInfo(CourseResponse response) {
		if (response.getCategoryId() != null) {
			Optional<Category> categoryOpt = categoryRepository.findById(response.getCategoryId());
			if (categoryOpt.isPresent()) {
				Category category = categoryOpt.get();
				response.setCategory(new CategoryNameDTO(category.getName()));
			}
		}
	}

	public CourseResponse getCourseById(@NonNull Long id) {
		Course course = courseRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
		CourseResponse response = new CourseResponse(course);
		addCategoryInfo(response);
		return response;
	}

	public List<CourseResponse> getCoursesByInstructor(@NonNull Long instructorId) {
		return courseRepository.findByInstructorId(instructorId)
			.stream()
			.map(course -> {
				CourseResponse response = new CourseResponse(course);
				addCategoryInfo(response);
				return response;
			})
			.collect(Collectors.toList());
	}

	public List<CourseResponse> getCoursesByStatus(@NonNull String status) {
		return courseRepository.findByStatus(status)
			.stream()
			.map(course -> {
				CourseResponse response = new CourseResponse(course);
				addCategoryInfo(response);
				return response;
			})
			.collect(Collectors.toList());
	}

	public CourseResponse updateCourse(@NonNull Long id, @NonNull CourseRequest request) {
		Course course = courseRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

		course.setCategoryId(request.getCategoryId());
		course.setInstructorId(request.getInstructorId());
		course.setTitle(request.getTitle());
		course.setDescription(request.getDescription());
		if (request.getStatus() != null && !request.getStatus().isEmpty()) {
			course.setStatus(request.getStatus());
		}
		if (request.getThumbnail() != null) {
			course.setThumbnail(request.getThumbnail());
		}
		if (request.getLevel() != null) {
			course.setLevel(request.getLevel());
		}
		if (request.getDuration() != null) {
			course.setDuration(request.getDuration());
		}

		Course updated = courseRepository.save(course);
		CourseResponse response = new CourseResponse(updated);
		addCategoryInfo(response);
		return response;
	}

	public void deleteCourse(@NonNull Long id) {
		if (!courseRepository.existsById(id)) {
			throw new RuntimeException("Course not found with id: " + id);
		}
		courseRepository.deleteById(id);
	}
}



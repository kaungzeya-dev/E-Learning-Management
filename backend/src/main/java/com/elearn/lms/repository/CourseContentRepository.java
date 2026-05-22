package com.elearn.lms.repository;

import com.elearn.lms.entity.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseContentRepository extends JpaRepository<CourseContent, Long> {

	List<CourseContent> findByModuleIdOrderByContentOrderAsc(Long moduleId);

	List<CourseContent> findByModule_ModuleId(Long moduleId);
	
	List<CourseContent> findByModuleId(Long moduleId);

	List<CourseContent> findByContentType(String contentType);

	List<CourseContent> findByModuleIdAndContentType(Long moduleId, String contentType);
}


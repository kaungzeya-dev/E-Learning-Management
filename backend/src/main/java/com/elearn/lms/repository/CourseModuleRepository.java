package com.elearn.lms.repository;

import com.elearn.lms.entity.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {

	List<CourseModule> findByCourseIdOrderByModuleOrderAsc(Long courseId);

	List<CourseModule> findByCourse_CourseId(Long courseId);
}


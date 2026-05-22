package com.elearn.lms.repository;

import com.elearn.lms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

	List<Course> findByStatus(String status);

	List<Course> findByInstructorId(Long instructorId);
}



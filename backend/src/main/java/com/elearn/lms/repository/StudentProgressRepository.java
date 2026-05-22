package com.elearn.lms.repository;

import com.elearn.lms.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {
    
    // Find all progress entries for a specific student
    List<StudentProgress> findByStudentId(Long studentId);
    
    // Find all progress entries for a specific course
    List<StudentProgress> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    // Find all progress entries for a specific module
    List<StudentProgress> findByStudentIdAndModuleId(Long studentId, Long moduleId);
    
    // Check if a content has been completed by a student
    boolean existsByStudentIdAndContentId(Long studentId, Long contentId);
    
    // Find a specific progress entry
    Optional<StudentProgress> findByStudentIdAndContentId(Long studentId, Long contentId);
    
    // Count completed content items for a student in a course
    @Query("SELECT COUNT(sp) FROM StudentProgress sp WHERE sp.studentId = :studentId AND sp.courseId = :courseId")
    Long countCompletedContentByCourse(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
    
    // Count completed content items for a student in a module
    @Query("SELECT COUNT(sp) FROM StudentProgress sp WHERE sp.studentId = :studentId AND sp.moduleId = :moduleId")
    Long countCompletedContentByModule(@Param("studentId") Long studentId, @Param("moduleId") Long moduleId);
}

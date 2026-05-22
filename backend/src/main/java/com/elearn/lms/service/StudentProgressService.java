package com.elearn.lms.service;

import com.elearn.lms.dto.CourseProgressResponse;
import com.elearn.lms.dto.ModuleProgressResponse;
import com.elearn.lms.dto.StudentProgressRequest;
import com.elearn.lms.dto.StudentProgressResponse;
import com.elearn.lms.entity.Course;
import com.elearn.lms.entity.CourseContent;
import com.elearn.lms.entity.CourseModule;
import com.elearn.lms.entity.StudentProgress;
import com.elearn.lms.repository.CourseContentRepository;
import com.elearn.lms.repository.CourseModuleRepository;
import com.elearn.lms.repository.CourseRepository;
import com.elearn.lms.repository.StudentProgressRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StudentProgressService {

    private final StudentProgressRepository studentProgressRepository;
    private final CourseRepository courseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final CourseContentRepository courseContentRepository;
    private final BadgeService badgeService;
    private final CertificateService certificateService;

    public StudentProgressService(StudentProgressRepository studentProgressRepository,
                                 CourseRepository courseRepository,
                                 CourseModuleRepository courseModuleRepository,
                                 CourseContentRepository courseContentRepository,
                                 BadgeService badgeService,
                                 CertificateService certificateService) {
        this.studentProgressRepository = studentProgressRepository;
        this.courseRepository = courseRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.courseContentRepository = courseContentRepository;
        this.badgeService = badgeService;
        this.certificateService = certificateService;
    }

    /**
     * Mark a content as completed by a student
     */
    @Transactional
    public StudentProgressResponse markContentAsCompleted(@NonNull StudentProgressRequest request) {
        // Check if already completed
        if (studentProgressRepository.existsByStudentIdAndContentId(request.getStudentId(), request.getContentId())) {
            throw new RuntimeException("Content already marked as completed");
        }

        // Create progress entry
        StudentProgress progress = new StudentProgress();
        progress.setStudentId(request.getStudentId());
        progress.setContentId(request.getContentId());
        progress.setModuleId(request.getModuleId());
        progress.setCourseId(request.getCourseId());

        StudentProgress saved = studentProgressRepository.save(progress);
        
        // Check if module is completed
        checkAndUpdateModuleCompletion(request.getStudentId(), request.getModuleId(), request.getCourseId());
        
        return new StudentProgressResponse(saved);
    }

    /**
     * Check if a module is completed and update course progress
     */
    private void checkAndUpdateModuleCompletion(Long studentId, Long moduleId, Long courseId) {
        // Get all content for the module
        List<CourseContent> moduleContents = courseContentRepository.findByModuleId(moduleId);
        
        // Get completed content for the module
        List<StudentProgress> completedContents = studentProgressRepository.findByStudentIdAndModuleId(studentId, moduleId);
        
        // Check if all content is completed
        boolean moduleCompleted = completedContents.size() == moduleContents.size();
        
        if (moduleCompleted) {
            // Check if course is completed
            checkAndUpdateCourseCompletion(studentId, courseId);
        }
    }

    /**
     * Check if a course is completed and award badges/certificates
     */
    private void checkAndUpdateCourseCompletion(Long studentId, Long courseId) {
        // Get course progress
        CourseProgressResponse progress = getCourseProgress(studentId, courseId);
        
        // Check if course is completed (100%)
        if (progress.getProgressPercentage() >= 100.0) {
            // Award completion badge
            badgeService.awardCourseBadge(studentId, courseId);
            
            // Generate certificate
            certificateService.generateCertificate(studentId, courseId);
        }
    }

    /**
     * Get progress for a specific course
     */
    @Transactional(readOnly = true)
    public CourseProgressResponse getCourseProgress(@NonNull Long studentId, @NonNull Long courseId) {
        // Get course details
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        // Get all modules for the course
        List<CourseModule> modules = courseModuleRepository.findByCourseIdOrderByModuleOrderAsc(courseId);
        
        // Get all completed content for the student in this course
        List<StudentProgress> completedProgress = studentProgressRepository.findByStudentIdAndCourseId(studentId, courseId);
        
        // Map of completed content IDs
        Map<Long, StudentProgress> completedContentMap = completedProgress.stream()
            .collect(Collectors.toMap(StudentProgress::getContentId, progress -> progress));
        
        // Calculate module progress
        List<ModuleProgressResponse> moduleProgressList = new ArrayList<>();
        int completedModules = 0;
        
        for (CourseModule module : modules) {
            // Get all content for this module
            List<CourseContent> moduleContents = courseContentRepository.findByModuleId(module.getModuleId());
            
            // Count completed content
            int totalContents = moduleContents.size();
            int completedContents = 0;
            List<Long> completedContentIds = new ArrayList<>();
            
            for (CourseContent content : moduleContents) {
                if (completedContentMap.containsKey(content.getContentId())) {
                    completedContents++;
                    completedContentIds.add(content.getContentId());
                }
            }
            
            // Calculate module progress percentage
            double moduleProgressPercentage = totalContents > 0 
                ? ((double) completedContents / totalContents) * 100 
                : 0;
            
            // Create module progress response
            ModuleProgressResponse moduleProgress = new ModuleProgressResponse(
                module.getModuleId(),
                module.getTitle(),
                totalContents,
                completedContents,
                moduleProgressPercentage,
                completedContentIds
            );
            
            moduleProgressList.add(moduleProgress);
            
            // Check if module is completed
            if (totalContents > 0 && completedContents == totalContents) {
                completedModules++;
            }
        }
        
        // Calculate overall course progress
        int totalModules = modules.size();
        double progressPercentage = totalModules > 0 
            ? ((double) completedModules / totalModules) * 100 
            : 0;
        
        // Check if certificate is eligible and issued
        boolean certificateEligible = progressPercentage >= 100.0;
        boolean certificateIssued = certificateService.hasCertificate(studentId, courseId);
        
        // Create course progress response
        return new CourseProgressResponse(
            courseId,
            course.getTitle(),
            studentId,
            totalModules,
            completedModules,
            progressPercentage,
            moduleProgressList,
            certificateEligible,
            certificateIssued
        );
    }

    /**
     * Get all course progress for a student
     */
    @Transactional(readOnly = true)
    public List<CourseProgressResponse> getAllCourseProgressForStudent(@NonNull Long studentId) {
        // Get all courses the student is enrolled in
        List<Long> enrolledCourseIds = studentProgressRepository.findByStudentId(studentId).stream()
            .map(StudentProgress::getCourseId)
            .distinct()
            .collect(Collectors.toList());
        
        // Get progress for each course
        List<CourseProgressResponse> progressList = new ArrayList<>();
        for (Long courseId : enrolledCourseIds) {
            progressList.add(getCourseProgress(studentId, courseId));
        }
        
        return progressList;
    }
}

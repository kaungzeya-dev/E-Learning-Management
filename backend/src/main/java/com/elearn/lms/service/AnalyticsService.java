package com.elearn.lms.service;

import com.elearn.lms.dto.AdminAnalyticsResponse;
import com.elearn.lms.dto.CourseResponse;
import com.elearn.lms.dto.EnrollmentResponse;
import com.elearn.lms.dto.InstructorAnalyticsResponse;
import com.elearn.lms.entity.Enrollment;
import com.elearn.lms.repository.EnrollmentRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final StudentService studentService;
    private final InstructorService instructorService;
    private final AdminService adminService;
    private final EnrollmentRepository enrollmentRepository;

    public AnalyticsService(
            CourseService courseService,
            EnrollmentService enrollmentService,
            StudentService studentService,
            InstructorService instructorService,
            AdminService adminService,
            EnrollmentRepository enrollmentRepository) {
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
        this.studentService = studentService;
        this.instructorService = instructorService;
        this.adminService = adminService;
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * Get analytics for an instructor
     */
    public InstructorAnalyticsResponse getInstructorAnalytics(@NonNull Long instructorId) {
        InstructorAnalyticsResponse analytics = new InstructorAnalyticsResponse();
        analytics.setInstructorId(instructorId);

        // Get all courses for the instructor
        List<CourseResponse> courses = courseService.getCoursesByInstructor(instructorId);
        
        long totalCourses = courses.size();
        long publishedCourses = courses.stream()
            .filter(c -> "Published".equals(c.getStatus()))
            .count();
        long draftCourses = totalCourses - publishedCourses;

        analytics.setTotalCourses(totalCourses);
        analytics.setPublishedCourses(publishedCourses);
        analytics.setDraftCourses(draftCourses);

        // Get enrollments for all courses
        long totalEnrollments = 0;
        long completedEnrollments = 0;
        long inProgressEnrollments = 0;
        List<InstructorAnalyticsResponse.CourseAnalytics> courseAnalyticsList = new ArrayList<>();

        for (CourseResponse course : courses) {
            List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByCourseId(course.getCourseId());
            
            long enrollmentCount = enrollments.size();
            long completedCount = enrollments.stream()
                .filter(e -> "Completed".equals(e.getCompletionStatus()))
                .count();
            long inProgressCount = enrollmentCount - completedCount;

            totalEnrollments += enrollmentCount;
            completedEnrollments += completedCount;
            inProgressEnrollments += inProgressCount;

            // Calculate completion rate for this course
            double completionRate = enrollmentCount > 0 
                ? (double) completedCount / enrollmentCount * 100.0 
                : 0.0;

            InstructorAnalyticsResponse.CourseAnalytics courseAnalytics = new InstructorAnalyticsResponse.CourseAnalytics();
            courseAnalytics.setCourseId(course.getCourseId());
            courseAnalytics.setCourseTitle(course.getTitle());
            courseAnalytics.setStatus(course.getStatus());
            courseAnalytics.setEnrollmentCount(enrollmentCount);
            courseAnalytics.setCompletedCount(completedCount);
            courseAnalytics.setInProgressCount(inProgressCount);
            courseAnalytics.setCompletionRate(Math.round(completionRate * 100.0) / 100.0); // Round to 2 decimal places

            courseAnalyticsList.add(courseAnalytics);
        }

        analytics.setTotalEnrollments(totalEnrollments);
        analytics.setCompletedEnrollments(completedEnrollments);
        analytics.setInProgressEnrollments(inProgressEnrollments);

        // Calculate average completion rate
        double averageCompletionRate = totalEnrollments > 0 
            ? (double) completedEnrollments / totalEnrollments * 100.0 
            : 0.0;
        analytics.setAverageCompletionRate(Math.round(averageCompletionRate * 100.0) / 100.0);

        analytics.setCourseAnalytics(courseAnalyticsList);

        return analytics;
    }

    /**
     * Get analytics for admin (system-wide statistics)
     */
    public AdminAnalyticsResponse getAdminAnalytics() {
        AdminAnalyticsResponse analytics = new AdminAnalyticsResponse();

        // Get counts for users
        long totalStudents = studentService.findAll().size();
        long totalInstructors = instructorService.findAll().size();
        long totalAdmins = adminService.getAllAdmins().size();

        analytics.setTotalStudents(totalStudents);
        analytics.setTotalInstructors(totalInstructors);
        analytics.setTotalAdmins(totalAdmins);

        // Get course statistics
        List<CourseResponse> allCourses = courseService.getAllCourses();
        long totalCourses = allCourses.size();
        long publishedCourses = allCourses.stream()
            .filter(c -> "Published".equals(c.getStatus()))
            .count();
        long draftCourses = totalCourses - publishedCourses;

        analytics.setTotalCourses(totalCourses);
        analytics.setPublishedCourses(publishedCourses);
        analytics.setDraftCourses(draftCourses);

        // Get enrollment statistics
        List<Enrollment> allEnrollments = enrollmentRepository.findAll();
        long totalEnrollments = allEnrollments.size();
        long completedEnrollments = allEnrollments.stream()
            .filter(e -> "Completed".equals(e.getCompletionStatus()))
            .count();
        long inProgressEnrollments = totalEnrollments - completedEnrollments;

        analytics.setTotalEnrollments(totalEnrollments);
        analytics.setCompletedEnrollments(completedEnrollments);
        analytics.setInProgressEnrollments(inProgressEnrollments);

        // Calculate average completion rate
        double averageCompletionRate = totalEnrollments > 0 
            ? (double) completedEnrollments / totalEnrollments * 100.0 
            : 0.0;
        analytics.setAverageCompletionRate(Math.round(averageCompletionRate * 100.0) / 100.0);

        return analytics;
    }
}


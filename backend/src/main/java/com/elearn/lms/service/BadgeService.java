package com.elearn.lms.service;

import com.elearn.lms.dto.BadgeRequest;
import com.elearn.lms.dto.BadgeResponse;
import com.elearn.lms.dto.UserBadgeResponse;
import com.elearn.lms.entity.Badge;
import com.elearn.lms.entity.Course;
import com.elearn.lms.entity.UserBadge;
import com.elearn.lms.repository.BadgeRepository;
import com.elearn.lms.repository.CourseRepository;
import com.elearn.lms.repository.UserBadgeRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final CourseRepository courseRepository;

    public BadgeService(BadgeRepository badgeRepository, 
                       UserBadgeRepository userBadgeRepository,
                       CourseRepository courseRepository) {
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Create a new badge
     */
    public BadgeResponse createBadge(@NonNull BadgeRequest request) {
        Badge badge = new Badge();
        badge.setName(request.getName());
        badge.setDescription(request.getDescription());
        badge.setIconUrl(request.getIconUrl());

        Badge saved = badgeRepository.save(badge);
        return new BadgeResponse(saved);
    }

    /**
     * Get all badges
     */
    public List<BadgeResponse> getAllBadges() {
        return badgeRepository.findAll()
            .stream()
            .map(BadgeResponse::new)
            .collect(Collectors.toList());
    }

    /**
     * Get a badge by ID
     */
    public BadgeResponse getBadgeById(@NonNull Long badgeId) {
        Badge badge = badgeRepository.findById(badgeId)
            .orElseThrow(() -> new RuntimeException("Badge not found with id: " + badgeId));
        return new BadgeResponse(badge);
    }

    /**
     * Award a badge to a student for completing a course
     */
    @Transactional
    public UserBadgeResponse awardCourseBadge(@NonNull Long studentId, @NonNull Long courseId) {
        // Get course details
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        // Find or create course completion badge
        String badgeName = "Course Completion: " + course.getTitle();
        Badge badge = badgeRepository.findByName(badgeName)
            .orElseGet(() -> {
                Badge newBadge = new Badge();
                newBadge.setName(badgeName);
                newBadge.setDescription("Awarded for completing the course: " + course.getTitle());
                newBadge.setIconUrl("/badges/course-completion.png");
                return badgeRepository.save(newBadge);
            });
        
        // Check if student already has this badge
        if (userBadgeRepository.existsByStudentIdAndBadgeId(studentId, badge.getBadgeId())) {
            Optional<UserBadge> existingBadge = userBadgeRepository.findByStudentIdAndBadgeId(studentId, badge.getBadgeId());
            return existingBadge.map(userBadge -> {
                UserBadgeResponse response = new UserBadgeResponse(userBadge);
                response.setBadgeName(badge.getName());
                response.setBadgeDescription(badge.getDescription());
                response.setBadgeIconUrl(badge.getIconUrl());
                return response;
            }).orElseThrow(() -> new RuntimeException("Error retrieving existing badge"));
        }
        
        // Award badge to student
        UserBadge userBadge = new UserBadge();
        userBadge.setStudentId(studentId);
        userBadge.setBadgeId(badge.getBadgeId());
        
        UserBadge saved = userBadgeRepository.save(userBadge);
        
        // Create response with badge details
        UserBadgeResponse response = new UserBadgeResponse(saved);
        response.setBadgeName(badge.getName());
        response.setBadgeDescription(badge.getDescription());
        response.setBadgeIconUrl(badge.getIconUrl());
        
        return response;
    }

    /**
     * Get all badges for a student
     */
    @Transactional(readOnly = true)
    public List<UserBadgeResponse> getStudentBadges(@NonNull Long studentId) {
        List<UserBadge> userBadges = userBadgeRepository.findByStudentId(studentId);
        List<UserBadgeResponse> responses = new ArrayList<>();
        
        for (UserBadge userBadge : userBadges) {
            Badge badge = badgeRepository.findById(userBadge.getBadgeId())
                .orElseThrow(() -> new RuntimeException("Badge not found with id: " + userBadge.getBadgeId()));
            
            UserBadgeResponse response = new UserBadgeResponse(userBadge);
            response.setBadgeName(badge.getName());
            response.setBadgeDescription(badge.getDescription());
            response.setBadgeIconUrl(badge.getIconUrl());
            
            responses.add(response);
        }
        
        return responses;
    }
}

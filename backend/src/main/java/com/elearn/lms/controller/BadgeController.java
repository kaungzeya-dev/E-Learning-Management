package com.elearn.lms.controller;

import com.elearn.lms.dto.BadgeRequest;
import com.elearn.lms.dto.BadgeResponse;
import com.elearn.lms.dto.UserBadgeResponse;
import com.elearn.lms.service.BadgeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
@CrossOrigin(origins = "*")
public class BadgeController {

    private final BadgeService badgeService;

    public BadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    /**
     * Create a new badge
     */
    @PostMapping
    public ResponseEntity<BadgeResponse> createBadge(@RequestBody BadgeRequest request) {
        try {
            BadgeResponse response = badgeService.createBadge(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Get all badges
     */
    @GetMapping
    public ResponseEntity<List<BadgeResponse>> getAllBadges() {
        try {
            List<BadgeResponse> responses = badgeService.getAllBadges();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get a badge by ID
     */
    @GetMapping("/{badgeId}")
    public ResponseEntity<BadgeResponse> getBadgeById(@PathVariable Long badgeId) {
        try {
            BadgeResponse response = badgeService.getBadgeById(badgeId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Award a badge to a student for completing a course
     */
    @PostMapping("/award/student/{studentId}/course/{courseId}")
    public ResponseEntity<UserBadgeResponse> awardCourseBadge(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        try {
            UserBadgeResponse response = badgeService.awardCourseBadge(studentId, courseId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Get all badges for a student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<UserBadgeResponse>> getStudentBadges(@PathVariable Long studentId) {
        try {
            List<UserBadgeResponse> responses = badgeService.getStudentBadges(studentId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}

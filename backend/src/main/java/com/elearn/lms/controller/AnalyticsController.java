package com.elearn.lms.controller;

import com.elearn.lms.dto.AdminAnalyticsResponse;
import com.elearn.lms.dto.InstructorAnalyticsResponse;
import com.elearn.lms.service.AnalyticsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Get analytics for an instructor
     * GET /api/analytics/instructor/{instructorId}
     */
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<?> getInstructorAnalytics(@PathVariable @NonNull Long instructorId) {
        try {
            InstructorAnalyticsResponse analytics = analyticsService.getInstructorAnalytics(instructorId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", analytics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get analytics for admin (system-wide statistics)
     * GET /api/analytics/admin
     */
    @GetMapping("/admin")
    public ResponseEntity<?> getAdminAnalytics() {
        try {
            AdminAnalyticsResponse analytics = analyticsService.getAdminAnalytics();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", analytics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}


package com.elearn.lms.dto;

import com.elearn.lms.entity.UserBadge;
import java.time.LocalDateTime;

public class UserBadgeResponse {
    private Long userBadgeId;
    private Long studentId;
    private Long badgeId;
    private String badgeName;
    private String badgeDescription;
    private String badgeIconUrl;
    private LocalDateTime earnedAt;

    // Constructors
    public UserBadgeResponse() {
    }

    public UserBadgeResponse(Long userBadgeId, Long studentId, Long badgeId, String badgeName, 
                            String badgeDescription, String badgeIconUrl, LocalDateTime earnedAt) {
        this.userBadgeId = userBadgeId;
        this.studentId = studentId;
        this.badgeId = badgeId;
        this.badgeName = badgeName;
        this.badgeDescription = badgeDescription;
        this.badgeIconUrl = badgeIconUrl;
        this.earnedAt = earnedAt;
    }

    public UserBadgeResponse(UserBadge userBadge) {
        this.userBadgeId = userBadge.getUserBadgeId();
        this.studentId = userBadge.getStudentId();
        this.badgeId = userBadge.getBadgeId();
        this.earnedAt = userBadge.getEarnedAt();
    }

    // Getters and Setters
    public Long getUserBadgeId() {
        return userBadgeId;
    }

    public void setUserBadgeId(Long userBadgeId) {
        this.userBadgeId = userBadgeId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getBadgeId() {
        return badgeId;
    }

    public void setBadgeId(Long badgeId) {
        this.badgeId = badgeId;
    }

    public String getBadgeName() {
        return badgeName;
    }

    public void setBadgeName(String badgeName) {
        this.badgeName = badgeName;
    }

    public String getBadgeDescription() {
        return badgeDescription;
    }

    public void setBadgeDescription(String badgeDescription) {
        this.badgeDescription = badgeDescription;
    }

    public String getBadgeIconUrl() {
        return badgeIconUrl;
    }

    public void setBadgeIconUrl(String badgeIconUrl) {
        this.badgeIconUrl = badgeIconUrl;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }
}

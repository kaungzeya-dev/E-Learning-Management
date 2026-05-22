package com.elearn.lms.dto;

import com.elearn.lms.entity.Badge;
import java.time.LocalDateTime;

public class BadgeResponse {
    private Long badgeId;
    private String name;
    private String description;
    private String iconUrl;
    private LocalDateTime createdAt;

    // Constructors
    public BadgeResponse() {
    }

    public BadgeResponse(Long badgeId, String name, String description, String iconUrl, LocalDateTime createdAt) {
        this.badgeId = badgeId;
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
        this.createdAt = createdAt;
    }

    public BadgeResponse(Badge badge) {
        this.badgeId = badge.getBadgeId();
        this.name = badge.getName();
        this.description = badge.getDescription();
        this.iconUrl = badge.getIconUrl();
        this.createdAt = badge.getCreatedAt();
    }

    // Getters and Setters
    public Long getBadgeId() {
        return badgeId;
    }

    public void setBadgeId(Long badgeId) {
        this.badgeId = badgeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

package com.elearn.lms.dto;

import com.elearn.lms.entity.Admin;
import java.time.LocalDateTime;

public class AdminResponse {

    private Long adminId;
    private String firstName;
    private String lastName;
    private String email;
    private String permissions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public AdminResponse() {
    }

    public AdminResponse(Admin admin) {
        this.adminId = admin.getAdminId();
        this.firstName = admin.getFirstName();
        this.lastName = admin.getLastName();
        this.email = admin.getEmail();
        this.permissions = admin.getPermissions();
        this.createdAt = admin.getCreatedAt();
        this.updatedAt = admin.getUpdatedAt();
    }

    // Getters and Setters
    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPermissions() {
        return permissions;
    }

    public void setPermissions(String permissions) {
        this.permissions = permissions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
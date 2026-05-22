package com.elearn.lms.dto;

import java.util.List;

public class ModuleProgressResponse {
    private Long moduleId;
    private String moduleTitle;
    private int totalContents;
    private int completedContents;
    private double progressPercentage;
    private List<Long> completedContentIds;

    // Constructors
    public ModuleProgressResponse() {
    }

    public ModuleProgressResponse(Long moduleId, String moduleTitle, int totalContents, 
                                 int completedContents, double progressPercentage, 
                                 List<Long> completedContentIds) {
        this.moduleId = moduleId;
        this.moduleTitle = moduleTitle;
        this.totalContents = totalContents;
        this.completedContents = completedContents;
        this.progressPercentage = progressPercentage;
        this.completedContentIds = completedContentIds;
    }

    // Getters and Setters
    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleTitle() {
        return moduleTitle;
    }

    public void setModuleTitle(String moduleTitle) {
        this.moduleTitle = moduleTitle;
    }

    public int getTotalContents() {
        return totalContents;
    }

    public void setTotalContents(int totalContents) {
        this.totalContents = totalContents;
    }

    public int getCompletedContents() {
        return completedContents;
    }

    public void setCompletedContents(int completedContents) {
        this.completedContents = completedContents;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public List<Long> getCompletedContentIds() {
        return completedContentIds;
    }

    public void setCompletedContentIds(List<Long> completedContentIds) {
        this.completedContentIds = completedContentIds;
    }
}

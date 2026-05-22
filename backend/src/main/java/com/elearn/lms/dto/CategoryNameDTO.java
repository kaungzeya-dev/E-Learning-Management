package com.elearn.lms.dto;

/**
 * Simple DTO to transfer category name information
 */
public class CategoryNameDTO {
    private String name;
    
    public CategoryNameDTO() {
    }
    
    public CategoryNameDTO(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}

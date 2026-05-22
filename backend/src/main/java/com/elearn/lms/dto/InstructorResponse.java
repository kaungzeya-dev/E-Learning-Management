package com.elearn.lms.dto;

import com.elearn.lms.entity.Instructor;

public class InstructorResponse {
    private Long instructorId;
    private String firstName;
    private String lastName;
    private String email;
    private String bio;
    private String expertise;

    public InstructorResponse() {}

    public InstructorResponse(Instructor i) {
        this.instructorId = i.getId();
        this.firstName = i.getFirstName();
        this.lastName = i.getLastName();
        this.email = i.getEmail();
        this.bio = i.getBio();
        this.expertise = i.getExpertise();
    }

    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }
}



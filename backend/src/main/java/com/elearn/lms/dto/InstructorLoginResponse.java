package com.elearn.lms.dto;

public class InstructorLoginResponse {
    private String token;
    private InstructorResponse instructor;

    public InstructorLoginResponse() {}

    public InstructorLoginResponse(String token, InstructorResponse instructor) {
        this.token = token;
        this.instructor = instructor;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public InstructorResponse getInstructor() { return instructor; }
    public void setInstructor(InstructorResponse instructor) { this.instructor = instructor; }
}



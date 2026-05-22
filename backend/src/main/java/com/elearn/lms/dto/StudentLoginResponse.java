package com.elearn.lms.dto;

public class StudentLoginResponse {
    private String token;
    private StudentResponse student;

    public StudentLoginResponse() {}

    public StudentLoginResponse(String token, StudentResponse student) {
        this.token = token;
        this.student = student;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public StudentResponse getStudent() { return student; }
    public void setStudent(StudentResponse student) { this.student = student; }
}



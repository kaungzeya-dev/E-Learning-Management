package com.elearn.lms.dto;

import com.elearn.lms.entity.Student;

public class StudentResponse {
    private Long studentId;
    private String firstName;
    private String lastName;
    private String email;

    public StudentResponse() {}

    public StudentResponse(Student s) {
        this.studentId = s.getId();
        this.firstName = s.getFirstName();
        this.lastName = s.getLastName();
        this.email = s.getEmail();
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}



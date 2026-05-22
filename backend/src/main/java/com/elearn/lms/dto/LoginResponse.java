package com.elearn.lms.dto;

public class LoginResponse {
    private String token;
    private AdminResponse admin;

    public LoginResponse() {}

    public LoginResponse(String token, AdminResponse admin) {
        this.token = token;
        this.admin = admin;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public AdminResponse getAdmin() { return admin; }
    public void setAdmin(AdminResponse admin) { this.admin = admin; }
}



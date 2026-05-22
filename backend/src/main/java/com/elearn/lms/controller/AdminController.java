package com.elearn.lms.controller;

import com.elearn.lms.dto.AdminRequest;
import com.elearn.lms.dto.AdminResponse;
import com.elearn.lms.dto.LoginRequest;
import com.elearn.lms.dto.LoginResponse;
import com.elearn.lms.security.JwtService;
import com.elearn.lms.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private JwtService jwtService;

    // Create new admin
    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody AdminRequest request) {
        try {
            AdminResponse admin = adminService.createAdmin(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin created successfully");
            response.put("data", admin);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Admin login -> returns JWT token
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            var admin = adminService.authenticate(request.getEmail(), request.getPassword());
            var token = jwtService.generateToken(admin.getEmail(), Map.of("role", "ADMIN", "adminId", admin.getAdminId()));
            return ResponseEntity.ok(new LoginResponse(token, new AdminResponse(admin)));
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    // Get all admins
    @GetMapping
    public ResponseEntity<?> getAllAdmins() {
        try {
            List<AdminResponse> admins = adminService.getAllAdmins();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", admins.size());
            response.put("data", admins);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Get admin by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable @NonNull Long id) {
        try {
            AdminResponse admin = adminService.getAdminById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", admin);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    // Get admin by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getAdminByEmail(@PathVariable String email) {
        try {
            AdminResponse admin = adminService.getAdminByEmail(email);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", admin);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    // Update admin
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable @NonNull Long id, @RequestBody @NonNull AdminRequest request) {
        try {
            AdminResponse admin = adminService.updateAdmin(id, request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin updated successfully");
            response.put("data", admin);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Delete admin
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable @NonNull Long id) {
        try {
            adminService.deleteAdmin(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
}
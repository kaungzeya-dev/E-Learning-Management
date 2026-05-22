package com.elearn.lms.service;

import com.elearn.lms.dto.AdminRequest;
import com.elearn.lms.dto.AdminResponse;
import com.elearn.lms.entity.Admin;
import com.elearn.lms.repository.AdminRepository;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Create new admin
    public AdminResponse createAdmin(AdminRequest request) {
        // Check if email already exists
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // Create admin entity
        Admin admin = new Admin();
        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setEmail(request.getEmail());
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        admin.setPermissions(request.getPermissions());

        // Save admin
        Admin savedAdmin = adminRepository.save(admin);

        return new AdminResponse(savedAdmin);
    }

    // Get all admins
    public List<AdminResponse> getAllAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(AdminResponse::new)
                .collect(Collectors.toList());
    }

    // Get admin by ID
    public AdminResponse getAdminById(@NonNull Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        return new AdminResponse(admin);
    }

    // Get admin by email
    public AdminResponse getAdminByEmail(String email) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found with email: " + email));
        return new AdminResponse(admin);
    }

    // Update admin
    public AdminResponse updateAdmin(@NonNull Long id, @NonNull AdminRequest request) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));

        // Check if email is being changed and if it already exists
        if (!admin.getEmail().equals(request.getEmail()) &&
                adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        admin.setPermissions(request.getPermissions());

        Admin updatedAdmin = adminRepository.save(admin);
        return new AdminResponse(updatedAdmin);
    }

    // Delete admin
    public void deleteAdmin(@NonNull Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found with id: " + id);
        }
        adminRepository.deleteById(id);
    }

    public Admin authenticate(String email, String rawPassword) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(rawPassword, admin.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        return admin;
    }
}
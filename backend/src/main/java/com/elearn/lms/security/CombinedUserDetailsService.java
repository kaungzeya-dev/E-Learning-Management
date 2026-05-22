package com.elearn.lms.security;

import com.elearn.lms.entity.Admin;
import com.elearn.lms.entity.Student;
import com.elearn.lms.entity.Instructor;
import com.elearn.lms.repository.AdminRepository;
import com.elearn.lms.repository.StudentRepository;
import com.elearn.lms.repository.InstructorRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@Primary
public class CombinedUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;

    public CombinedUserDetailsService(AdminRepository adminRepository,
                                      StudentRepository studentRepository,
                                      InstructorRepository instructorRepository) {
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.instructorRepository = instructorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByEmail(email).orElse(null);
        if (admin != null) {
            Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
            return new User(admin.getEmail(), admin.getPasswordHash(), authorities);
        }
        Student student = studentRepository.findByEmail(email).orElse(null);
        if (student != null) {
            Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_STUDENT"));
            return new User(student.getEmail(), student.getPasswordHash(), authorities);
        }
        Instructor instructor = instructorRepository.findByEmail(email).orElse(null);
        if (instructor != null) {
            Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_INSTRUCTOR"));
            return new User(instructor.getEmail(), instructor.getPasswordHash(), authorities);
        }
        throw new UsernameNotFoundException("User not found: " + email);
    }
}



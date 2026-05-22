package com.elearn.lms.repository;

import com.elearn.lms.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    
    // Find all badges for a specific student
    List<UserBadge> findByStudentId(Long studentId);
    
    // Check if a student has a specific badge
    boolean existsByStudentIdAndBadgeId(Long studentId, Long badgeId);
    
    // Find a specific user badge
    Optional<UserBadge> findByStudentIdAndBadgeId(Long studentId, Long badgeId);
}

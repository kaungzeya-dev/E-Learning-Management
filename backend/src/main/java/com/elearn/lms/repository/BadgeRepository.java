package com.elearn.lms.repository;

import com.elearn.lms.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    
    // Find a badge by its name
    Optional<Badge> findByName(String name);
}

package com.elearn.lms.repository;

import com.elearn.lms.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
	
	Optional<Quiz> findByContentId(Long contentId);
	
	List<Quiz> findByContent_ContentId(Long contentId);
}


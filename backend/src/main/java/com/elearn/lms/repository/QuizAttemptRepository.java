package com.elearn.lms.repository;

import com.elearn.lms.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
	
	List<QuizAttempt> findByQuizIdOrderByAttemptDateDesc(Long quizId);
	
	List<QuizAttempt> findByStudentIdOrderByAttemptDateDesc(Long studentId);
	
	List<QuizAttempt> findByQuizIdAndStudentIdOrderByAttemptDateDesc(Long quizId, Long studentId);
}


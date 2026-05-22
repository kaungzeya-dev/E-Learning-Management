package com.elearn.lms.repository;

import com.elearn.lms.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
	
	List<QuizQuestion> findByQuizIdOrderByQuestionIdAsc(Long quizId);
	
	List<QuizQuestion> findByQuiz_QuizId(Long quizId);
}


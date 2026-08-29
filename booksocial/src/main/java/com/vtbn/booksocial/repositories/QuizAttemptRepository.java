package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.QuizAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Integer> {
    boolean existsByQuizIdAndUserId(int quizId, int userId);
    boolean existsByQuizId(int quizId);
    QuizAttempt findById(int id);
    List<QuizAttempt> findByQuizIdAndUserId(int quizId, int userId);
    Page<QuizAttempt> findByUserId(int userId, Pageable pageable);
}
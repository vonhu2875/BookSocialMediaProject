package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.QuizAttempt;
import com.vtbn.booksocial.entities.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Integer> {
    List<UserAnswer> findByQuizAttemptId(int id);
}
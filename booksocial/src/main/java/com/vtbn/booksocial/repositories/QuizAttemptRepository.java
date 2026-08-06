package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizAttemptRepository
        extends JpaRepository<QuizAttempt, Integer> {
}
package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAnswerRepository
        extends JpaRepository<UserAnswer, Integer> {
}
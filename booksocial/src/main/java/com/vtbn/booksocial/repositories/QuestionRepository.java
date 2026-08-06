package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
}

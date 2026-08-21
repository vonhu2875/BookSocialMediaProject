package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.AIChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIChatHistoryRepository extends JpaRepository<AIChatHistory, Integer> {

}

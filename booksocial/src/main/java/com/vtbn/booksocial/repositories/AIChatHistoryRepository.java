package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.AIChatHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIChatHistoryRepository extends JpaRepository<AIChatHistory, Integer> {
    Page<AIChatHistory> findByUserIdAndChapterIdOrderByCreatedDateAsc(int userId, int chapterId, Pageable pageable);
    void deleteByUserIdAndChapterId(int userId, int chapterId);
}

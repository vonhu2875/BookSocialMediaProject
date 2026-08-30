package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.AIChatHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIChatHistoryRepository extends JpaRepository<AIChatHistory, Integer> {
    Page<AIChatHistory> findByUserIdAndChapterIdOrderByCreatedDateAsc(int userId, int chapterId, Pageable pageable);
    void deleteByUserIdAndChapterId(int userId, int chapterId);

    Page<AIChatHistory> findByUserIdAndBookIdAndChapterIsNullOrderByCreatedDateAsc(int userId, int bookId, Pageable pageable);
    List<AIChatHistory> findTop6ByUserIdAndChapterIdOrderByCreatedDateDesc(int userId, int chapterId);
    List<AIChatHistory> findTop6ByUserIdAndBookIdAndChapterIsNullOrderByCreatedDateDesc(int userId, int bookId);

    void deleteByUserIdAndBookIdAndChapterIsNull(int userId, int bookId);
}

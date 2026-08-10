package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Chapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
    Page<Chapter> findByBookId(int id, Pageable pageable);
    boolean existsByBookIdAndChapterNumber(int bookId, int chapterNumber);
    boolean existsByBookIdAndChapterNumberAndIdNot(int bookId, int chapterNumber, int chapterId);
    Chapter findById(int id);
}

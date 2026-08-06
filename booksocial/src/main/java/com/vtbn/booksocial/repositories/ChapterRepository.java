package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
    Set<Chapter> findByBookId(int bookId);
}

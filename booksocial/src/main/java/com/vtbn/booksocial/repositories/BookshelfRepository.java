package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Bookshelf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookshelfRepository extends JpaRepository<Bookshelf, Integer> {
    List<Bookshelf> findAllByLastReadChapter_Id(int chapterId);
    boolean existsByUserIdAndBookId(int userId, int bookId);
    Bookshelf findByUserIdAndBookId(int userId, int bookId);
    List<Bookshelf> findByUserId(int userId);
    List<Bookshelf>findByUserIdAndIsFavoriteTrue(int userId);
}

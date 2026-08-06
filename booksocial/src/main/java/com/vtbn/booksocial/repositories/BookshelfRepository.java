package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Bookshelf;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookshelfRepository extends JpaRepository<Bookshelf, Integer> {
    Bookshelf findByUserIdAndBookId(int userId, int bookId);
}

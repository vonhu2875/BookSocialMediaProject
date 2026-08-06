package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Book;
import com.vtbn.booksocial.enums.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface BookRepository extends JpaRepository<Book, Integer> {
    Set<Book> findByStatus(BookStatus status);
    Set<Book> findByTitle(String title);
}

package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Book;
import com.vtbn.booksocial.enums.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Set;

public interface BookRepository extends JpaRepository<Book, Integer>, JpaSpecificationExecutor<Book> {
    Page<Book> findAllByStatus(BookStatus status,
                            Pageable pageable);
    Set<Book> findByTitle(String title);
    boolean existsByTitleAndAuthor_Username(String title, String username);

    Book findById(int id);
    Page<Book> findAllByAuthor_Username(String username, Pageable pageable);
}

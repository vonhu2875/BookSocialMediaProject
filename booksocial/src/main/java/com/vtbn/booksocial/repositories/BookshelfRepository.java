package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Bookshelf;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookshelfRepository extends JpaRepository<Bookshelf, Integer> {
    List<Bookshelf> findAllByLastReadChapter_Id(int chapterId);
}

package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByChapterIdOrderByCreatedDateAsc(int chapterId);
    Comment findById(int id);
}

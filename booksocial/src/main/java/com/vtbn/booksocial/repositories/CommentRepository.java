package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    Set<Comment> findByChapterId(int chapterId);
}

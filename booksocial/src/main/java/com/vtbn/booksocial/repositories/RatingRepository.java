package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    Rating findByUserIdAndBookId(int userId, int bookId);
}

package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    List<Rating> findByBookIdOrderByCreatedDateDesc(int bookId);
    Rating findByBookIdAndUserId(int bookId, int userId);
    boolean existsByBookIdAndUserId(int bookId, int userId);
    Rating findById(int id);
//    Ko tối ưu nếu có nhiều lượt rating
//    List<Rating> findByBookId(int bookId);
    @Query("""
            SELECT AVG(r.star)
            FROM Rating r
            WHERE r.book.id = :bookId
            """)
    Double getAverageStar(@Param("bookId") int bookId);
    long countByBookId(int bookId);
    long countByBookIdAndStar(int bookId, int star);
}

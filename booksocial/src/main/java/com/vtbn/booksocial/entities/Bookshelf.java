package com.vtbn.booksocial.entities;

import com.vtbn.booksocial.enums.BookshelfStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bookshelfs", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "book_id"})})
public class Bookshelf{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Enumerated(EnumType.STRING)
    private BookshelfStatus status;
    @Column(nullable = false)
    private boolean isFavorite;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_read_chapter_id")
    private Chapter lastReadChapter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="book_id")
    private Book book;
}

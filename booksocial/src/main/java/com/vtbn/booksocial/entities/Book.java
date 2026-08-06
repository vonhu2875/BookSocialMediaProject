package com.vtbn.booksocial.entities;

import com.vtbn.booksocial.enums.BookLanguage;
import com.vtbn.booksocial.enums.BookStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "books")
public class Book extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String title;
    private String description;
    private String coverImage;
    @Enumerated(EnumType.STRING)
    private BookLanguage language;
    @Column(nullable = false)
    private int totalChapters;
    @Column(nullable = false)
    private int viewCount;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookStatus status;
    private Instant approvedAt;

//    orphan xóa luôn cả chapters dưới db nếu xóa
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Chapter> chapters;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @OneToMany(mappedBy = "book",fetch = FetchType.LAZY)
    private Set<Bookshelf> bookShelfs;

    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY)
    private Set<Rating> ratings;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "book_cate",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "cate_id"))
    private Set<Category> categories;
}

package com.vtbn.booksocial.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="chapters", uniqueConstraints = {@UniqueConstraint(columnNames = {"book_id", "chapter_number"})})
public class Chapter extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private int chapterNumber;
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(columnDefinition = "TEXT")
    private String summary;
    private String fileUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    @OneToMany(mappedBy = "chapter", fetch = FetchType.LAZY,  cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<Comment> comments;

    @OneToMany(mappedBy = "chapter", fetch = FetchType.LAZY,  cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<AIChatHistory> aiChatHistories;

    @OneToMany(mappedBy = "chapter", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<Quiz> quizzes;
}

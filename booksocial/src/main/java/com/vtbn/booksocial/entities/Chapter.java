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
@Table(name="chapters")
public class Chapter extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private int chapterNumber;
    @Column(nullable = false)
    private String title;
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @OneToMany(mappedBy = "chapter", fetch = FetchType.LAZY)
    private Set<Comment> comments;

    @OneToMany(mappedBy = "chapter", fetch = FetchType.LAZY)
    private Set<AIChatHistory> aiChatHistories;

    @OneToMany(mappedBy = "chapter", fetch = FetchType.LAZY)
    private Set<Quiz> quizzes;
}

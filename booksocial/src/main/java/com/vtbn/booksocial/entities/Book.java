package com.vtbn.booksocial.entities;

import com.vtbn.booksocial.enums.BookLanguage;
import com.vtbn.booksocial.enums.BookStatus;
import com.vtbn.booksocial.enums.FileType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

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
    private String fileUrl;
    @Enumerated(EnumType.STRING)
    private FileType fileType;
    private String coverImage;
    @Enumerated(EnumType.STRING)
    private BookLanguage language;
    @Column(nullable = false)
    private int totalChapters;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookStatus status;
    private Instant approvedAt;
}

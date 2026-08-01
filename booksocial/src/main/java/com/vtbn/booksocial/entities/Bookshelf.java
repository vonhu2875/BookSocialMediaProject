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
@Table(name = "bookshelfs")
public class Bookshelf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Enumerated(EnumType.STRING)
    private BookshelfStatus status;
    private Chapter lastReadChapter;
}

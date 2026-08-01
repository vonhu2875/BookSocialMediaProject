package com.vtbn.booksocial.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String content;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    @Column(nullable = false)
    private String correctAnswer;
}

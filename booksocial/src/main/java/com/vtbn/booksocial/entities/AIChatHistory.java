package com.vtbn.booksocial.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ai_chat_histories")
public class AIChatHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String question;
    private String answer;
    private String sourceReference;
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdDate;
}

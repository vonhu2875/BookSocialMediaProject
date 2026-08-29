package com.vtbn.booksocial.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptResponse {
    private int id;
    private int score;
    private Instant submittedAt;
    private int quizId;
}

package com.vtbn.booksocial.dto.response;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptDetailResponse {
    private int id;
    private int score;
    private Instant submittedAt;
    private List<UserAnswerResponse> userAnswerResponses;
}

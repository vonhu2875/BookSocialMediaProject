package com.vtbn.booksocial.dto.request;

import jakarta.validation.Valid;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptRequest {
    @Valid
    private List<UserAnswerRequest> userAnswerRequests;
}

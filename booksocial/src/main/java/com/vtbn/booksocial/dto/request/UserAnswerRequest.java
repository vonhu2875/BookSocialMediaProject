package com.vtbn.booksocial.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAnswerRequest {
    private int questionId;
    @NotBlank
    private String selectedAnswer;
}

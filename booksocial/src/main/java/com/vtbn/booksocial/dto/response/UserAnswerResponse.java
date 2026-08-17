package com.vtbn.booksocial.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAnswerResponse {
    private int questionId;
    private String selectedAnswer;
    private String correctAnswer;
    private boolean correct;
}

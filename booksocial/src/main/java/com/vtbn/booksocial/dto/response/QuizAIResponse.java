package com.vtbn.booksocial.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAIResponse {
    private List<QuestionAIResponse> questions;
}

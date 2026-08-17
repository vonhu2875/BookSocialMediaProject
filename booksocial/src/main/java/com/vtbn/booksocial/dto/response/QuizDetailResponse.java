package com.vtbn.booksocial.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDetailResponse {
    private int id;
    private String summary;
    private List<QuestionResponse> questions;
}

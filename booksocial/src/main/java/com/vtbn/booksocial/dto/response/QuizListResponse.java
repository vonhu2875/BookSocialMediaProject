package com.vtbn.booksocial.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizListResponse {
    private int id;
    private String summary;
}

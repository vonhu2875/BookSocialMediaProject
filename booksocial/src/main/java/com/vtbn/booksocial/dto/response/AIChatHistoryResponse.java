package com.vtbn.booksocial.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIChatHistoryResponse {
    private int id;
    private String question;
    private String answer;
    private String sourceReference;
    private Instant createdDate;
}

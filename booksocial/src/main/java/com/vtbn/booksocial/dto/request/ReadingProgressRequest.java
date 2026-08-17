package com.vtbn.booksocial.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingProgressRequest {
    private int chapterId;
}


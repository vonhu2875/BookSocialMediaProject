package com.vtbn.booksocial.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterListResponse {
    private int id;
    private int chapterNumber;
    private String title;
}

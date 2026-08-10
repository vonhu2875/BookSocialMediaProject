package com.vtbn.booksocial.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterDetailResponse {
    private int id;
    private int chapterNumber;
    private String title;
    private String content;
    private String summary;
    private int bookId;
}

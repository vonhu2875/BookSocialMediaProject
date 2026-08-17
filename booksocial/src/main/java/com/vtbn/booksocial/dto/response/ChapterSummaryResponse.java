package com.vtbn.booksocial.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterSummaryResponse {
    private int chapterId;
    private int chapterNumber;
    private String title;
    private String summary;
}

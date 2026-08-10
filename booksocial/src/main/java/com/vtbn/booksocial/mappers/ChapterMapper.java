package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.request.ChapterRequest;
import com.vtbn.booksocial.dto.response.ChapterDetailResponse;
import com.vtbn.booksocial.dto.response.ChapterListResponse;
import com.vtbn.booksocial.entities.Chapter;
import com.vtbn.booksocial.services.ChapterFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChapterMapper {

    public Chapter toChapter(ChapterRequest request) {
        return Chapter.builder()
                .title(request.getTitle())
                .chapterNumber(request.getChapterNumber())
                .build();
    }

    public ChapterListResponse toChapterListResponse(Chapter chapter) {
        return ChapterListResponse.builder()
                .title(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .build();
    }

    public ChapterDetailResponse toChapterDetailResponse(Chapter chapter) {
        return ChapterDetailResponse.builder()
                .title(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .content(chapter.getContent())
                .summary(chapter.getSummary())
                .bookId(chapter.getBook().getId())
                .build();
    }
}

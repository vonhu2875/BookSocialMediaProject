package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.request.ChapterRequest;
import com.vtbn.booksocial.dto.response.ChapterDetailResponse;
import com.vtbn.booksocial.dto.response.ChapterListResponse;
import com.vtbn.booksocial.dto.response.ChapterSummaryResponse;
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
                .id(chapter.getId())
                .title(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .build();
    }

    public ChapterDetailResponse toChapterDetailResponse(Chapter chapter) {
        return ChapterDetailResponse.builder()
                .id(chapter.getId())
                .title(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .content(chapter.getContent())
                .summary(chapter.getSummary())
                .bookId(chapter.getBook().getId())
                .build();
    }
    public ChapterSummaryResponse toChapterSummaryResponse(Chapter chapter) {
        return ChapterSummaryResponse.builder()
                .chapterId(chapter.getId())
                .chapterNumber(chapter.getChapterNumber())
                .title(chapter.getTitle())
                .summary(chapter.getSummary())
                .build();
    }
}

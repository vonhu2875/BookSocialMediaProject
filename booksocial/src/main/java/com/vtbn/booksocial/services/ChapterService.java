package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.ChapterRequest;
import com.vtbn.booksocial.dto.request.ChatRequest;
import com.vtbn.booksocial.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ChapterService {
    ChapterDetailResponse createChapter(Authentication authentication, int bookId, ChapterRequest request);
    Page<ChapterListResponse> getChapters(int bookId, Pageable pageable);
    ChapterDetailResponse getChapter(int chapterId);
    ChapterDetailResponse updateChapter(Authentication authentication, int chapterId, ChapterRequest request);
    void deleteChapter(Authentication authentication, int chapterId);
    ChapterSummaryResponse summaryChapter(Authentication authentication, int chapterId);
}

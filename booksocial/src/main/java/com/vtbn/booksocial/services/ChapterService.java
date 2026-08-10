package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.ChapterRequest;
import com.vtbn.booksocial.dto.response.ChapterDetailResponse;
import com.vtbn.booksocial.dto.response.ChapterListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

public interface ChapterService {
    ChapterDetailResponse createChapter(Authentication authentication, int bookId, ChapterRequest request);
    Page<ChapterListResponse> getChapters(int bookId, Pageable pageable);
    ChapterDetailResponse getChapter(int chapterId);
    ChapterDetailResponse updateChapter(Authentication authentication, int chapterId, ChapterRequest request);
    void deleteChapter(Authentication authentication, int chapterId);

}

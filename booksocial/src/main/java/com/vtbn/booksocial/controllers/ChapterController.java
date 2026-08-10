package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.ChapterRequest;
import com.vtbn.booksocial.dto.request.CommentRequest;
import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.ChapterDetailResponse;
import com.vtbn.booksocial.dto.response.CommentDetailResponse;
import com.vtbn.booksocial.dto.response.CommentListResponse;
import com.vtbn.booksocial.services.ChapterService;
import com.vtbn.booksocial.services.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("chapters")
public class ChapterController {
    private final ChapterService chapterService;
    private final CommentService commentService;

    @GetMapping("/{chapterId}")
    public ApiResponse<ChapterDetailResponse> getChapter(@PathVariable int chapterId) {
        ChapterDetailResponse chapter = chapterService.getChapter(chapterId);
        return ApiResponse.<ChapterDetailResponse>builder().result(chapter).build();
    }
    @PutMapping("/{chapterId}")
    public ApiResponse<ChapterDetailResponse> updateChapter(Authentication authentication, @PathVariable int chapterId, @ModelAttribute ChapterRequest request) {
        ChapterDetailResponse response = chapterService.updateChapter( authentication,chapterId,request);
        return ApiResponse.<ChapterDetailResponse>builder().result(response).build();
    }
    @DeleteMapping("/{chapterId}")
    public ApiResponse<Void> deleteChapter(Authentication authentication,@PathVariable int chapterId) {
        chapterService.deleteChapter(authentication, chapterId);
        return ApiResponse.<Void>builder().message("Delete chapter success").build();
    }

    //COMMENT
    @PostMapping("/{chapterId}/comments")
    public ApiResponse<CommentDetailResponse> createComment(Authentication authentication, @PathVariable int chapterId, @Valid @RequestBody CommentRequest request) {
        CommentDetailResponse commentDetailResponse = commentService.createComment(authentication, chapterId, request);
        return ApiResponse.<CommentDetailResponse>builder().result(commentDetailResponse).build();
    }

    @GetMapping("/{chapterId}/comments")
    public ApiResponse<List<CommentListResponse>> getComments(@PathVariable int chapterId) {
        List<CommentListResponse> responses = commentService.getCommentsByChapter(chapterId);

        return ApiResponse.<List<CommentListResponse>>builder().result(responses).build();
    }
}

package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.ChapterRequest;
import com.vtbn.booksocial.dto.request.ChatRequest;
import com.vtbn.booksocial.dto.request.CommentRequest;
import com.vtbn.booksocial.dto.response.*;
import com.vtbn.booksocial.services.ChapterService;
import com.vtbn.booksocial.services.CommentService;
import com.vtbn.booksocial.services.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("chapters")
public class ChapterController {
    private final ChapterService chapterService;
    private final CommentService commentService;
    private final QuizService quizService;
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
    public ApiResponse<Page<CommentListResponse>> getComments(@PathVariable int chapterId, Pageable pageable) {
        Page<CommentListResponse> responses = commentService.getCommentsByChapter(chapterId, pageable);

        return ApiResponse.<Page<CommentListResponse>>builder().result(responses).build();
    }

    @PostMapping("/{chapterId}/summary")
    public ApiResponse<ChapterSummaryResponse> summarizeChapter(Authentication authentication,@PathVariable int chapterId) {
        ChapterSummaryResponse response = chapterService.summaryChapter(authentication, chapterId);
        return ApiResponse.<ChapterSummaryResponse>builder().result(response).build();
    }

    //Quizz
    @PostMapping("/{chapterId}/quizzes")
    public ApiResponse<QuizDetailResponse> generateQuiz(@PathVariable int chapterId) {
        QuizDetailResponse quizDetailResponse = quizService.generateQuiz(chapterId);
        return ApiResponse.<QuizDetailResponse>builder().result(quizDetailResponse).build();
    }

    @PostMapping("/{chapterId}/quizzes/start")
    public ApiResponse<QuizDetailResponse> startQuiz(Authentication authentication,@PathVariable int chapterId) {
        QuizDetailResponse response = quizService.startQuiz(authentication, chapterId);
        return ApiResponse.<QuizDetailResponse>builder().result(response).build();
    }

    @GetMapping("/{chapterId}/quizzes")
    public ApiResponse<List<QuizListResponse>> getQuizzesByChapter(@PathVariable int chapterId) {
        List<QuizListResponse> responses = quizService.getQuizzesByChapter(chapterId);
        return ApiResponse.<List<QuizListResponse>>builder().result(responses).build();
    }
    //CHATBOT
    @PostMapping("/{chapterId}/chat")
    public ApiResponse<ChatResponse> chatWithChapter(Authentication authentication,@PathVariable int chapterId,@Valid @RequestBody ChatRequest chatRequest) {
        ChatResponse response = chapterService.chatWithChapter(authentication,chapterId,chatRequest);
        return ApiResponse.<ChatResponse>builder().result(response).build();
    }

    @GetMapping("/{chapterId}/chat/history")
    public ApiResponse<Page<AIChatHistoryResponse>> getAIChatHistory(Authentication authentication, @PathVariable int chapterId, Pageable pageable) {
        Page<AIChatHistoryResponse> aiChatHistoryResponses = chapterService.getChatHistory(authentication, chapterId, pageable);
        return ApiResponse.<Page<AIChatHistoryResponse>>builder().result(aiChatHistoryResponses).build();
    }

    @DeleteMapping("/{chapterId}/chat/history")
    public ApiResponse<Void> deleteAIChatHistory(Authentication authentication, @PathVariable int chapterId) {
        chapterService.deleteChatHistory(authentication, chapterId);
        return ApiResponse.<Void>builder().message("delete ai chat history success").build();
    }

}

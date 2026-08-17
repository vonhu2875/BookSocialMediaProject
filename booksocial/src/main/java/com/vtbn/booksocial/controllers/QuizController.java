package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.QuizAttemptRequest;
import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.QuizAttemptDetailResponse;
import com.vtbn.booksocial.dto.response.QuizAttemptResponse;
import com.vtbn.booksocial.dto.response.QuizDetailResponse;
import com.vtbn.booksocial.services.QuizAttemptService;
import com.vtbn.booksocial.services.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("quizzes")
public class QuizController {
    private final QuizService quizService;
    private final QuizAttemptService quizAttemptService;
    @GetMapping("/{quizId}")
    public ApiResponse<QuizDetailResponse> getQuiz(@PathVariable int quizId) {
        QuizDetailResponse response = quizService.getQuiz(quizId);
        return ApiResponse.<QuizDetailResponse>builder().result(response).build();
    }
    @DeleteMapping("/{quizId}")
    public ApiResponse<Void> deleteQuiz(@PathVariable int quizId) {
        quizService.deleteQuiz(quizId);
        return ApiResponse.<Void>builder().message("Delete quiz success").build();
    }
    @PostMapping("/{quizId}/attempts")
    public ApiResponse<QuizAttemptDetailResponse> submitQuiz(
            Authentication authentication,
            @PathVariable int quizId,
            @Valid @RequestBody QuizAttemptRequest request) {

        QuizAttemptDetailResponse response = quizAttemptService.submitQuiz(authentication,quizId,request);

        return ApiResponse.<QuizAttemptDetailResponse>builder().result(response).build();
    }
    @GetMapping("/{quizId}/attempts")
    public ApiResponse<List<QuizAttemptResponse>> getAttemptsByQuiz(
            Authentication authentication,
            @PathVariable int quizId) {

        List<QuizAttemptResponse> responses = quizAttemptService.getAttempts(authentication,quizId);
        return ApiResponse.<List<QuizAttemptResponse>>builder().result(responses).build();
    }
}

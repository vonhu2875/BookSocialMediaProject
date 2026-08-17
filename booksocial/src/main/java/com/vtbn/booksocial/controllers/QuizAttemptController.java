package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.QuizAttemptDetailResponse;
import com.vtbn.booksocial.services.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/quiz-attempts")
@RequiredArgsConstructor
public class QuizAttemptController {
    private final QuizAttemptService quizAttemptService;
    @GetMapping("/{attemptId}")
    public ApiResponse<QuizAttemptDetailResponse> getAttemptDetail(Authentication authentication,@PathVariable int attemptId) {
        QuizAttemptDetailResponse response = quizAttemptService.getAttemptDetail(authentication, attemptId);
        return ApiResponse.<QuizAttemptDetailResponse>builder().result(response).build();
    }
}

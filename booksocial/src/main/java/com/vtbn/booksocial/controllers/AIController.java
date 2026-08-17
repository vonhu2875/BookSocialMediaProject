package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.QuizAIResponse;
import com.vtbn.booksocial.services.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test-ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/quiz")
    public ApiResponse<QuizAIResponse> testGenerateQuiz(
            @RequestBody String summary
    ) {
        QuizAIResponse response = aiService.generateQuiz(summary);

        return ApiResponse.<QuizAIResponse>builder()
                .result(response)
                .build();
    }
}

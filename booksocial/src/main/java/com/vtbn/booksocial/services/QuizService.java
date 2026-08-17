package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.response.QuizDetailResponse;
import com.vtbn.booksocial.dto.response.QuizListResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface QuizService {
    QuizDetailResponse generateQuiz(int chapterId);
    QuizDetailResponse getQuiz(int quizId);
    QuizDetailResponse startQuiz(Authentication authentication, int chapterId);
    List<QuizListResponse> getQuizzesByChapter(int chapterId);
    void deleteQuiz(int quizId);
}

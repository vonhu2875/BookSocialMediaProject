package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.QuizAttemptRequest;
import com.vtbn.booksocial.dto.response.QuizAttemptDetailResponse;
import com.vtbn.booksocial.dto.response.QuizAttemptResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface QuizAttemptService {
    QuizAttemptDetailResponse submitQuiz(Authentication authentication,int quizId, QuizAttemptRequest request);
    QuizAttemptDetailResponse getAttemptDetail(Authentication authentication,int attemptId);
    List<QuizAttemptResponse> getAttempts(Authentication authentication, int quizId);
    Page<QuizAttemptResponse> getMyAttempts(Authentication authentication, Pageable pageable);
}

package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.response.QuizAttemptDetailResponse;
import com.vtbn.booksocial.dto.response.QuizAttemptResponse;
import com.vtbn.booksocial.entities.Quiz;
import com.vtbn.booksocial.entities.QuizAttempt;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.entities.UserAnswer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class QuizAttemptMapper {
    private final UserAnswerMapper userAnswerMapper;

    // Tạo QuizAttempt Entity
    public QuizAttempt toQuizAttempt(
            Quiz quiz,
            User user,
            int score,
            List<UserAnswer> userAnswers) {

        return QuizAttempt.builder()
                .quiz(quiz)
                .user(user)
                .score(score)
                .submittedAt(Instant.now())
                .userAnswers(userAnswers)
                .build();
    }

    // QuizAttempt Entity → Response
    public QuizAttemptResponse toQuizAttemptResponse(
            QuizAttempt quizAttempt) {

        return QuizAttemptResponse.builder()
                .id(quizAttempt.getId())
                .score(quizAttempt.getScore())
                .submittedAt(quizAttempt.getSubmittedAt())
                .quizId(quizAttempt.getQuiz().getId())
                .build();
    }

    // QuizAttempt Entity -> Detail Response
    public QuizAttemptDetailResponse toQuizAttemptDetailResponse(
            QuizAttempt quizAttempt) {

        return QuizAttemptDetailResponse.builder()
                .id(quizAttempt.getId())
                .score(quizAttempt.getScore())
                .submittedAt(quizAttempt.getSubmittedAt())
                .userAnswerResponses(
                        quizAttempt.getUserAnswers()
                                .stream()
                                .map(userAnswerMapper::toUserAnswerResponse)
                                .toList()
                )
                .quiz(quizAttempt.getQuiz().getId())
                .build();
    }
}

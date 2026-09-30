package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.QuizAttemptRequest;
import com.vtbn.booksocial.dto.request.UserAnswerRequest;
import com.vtbn.booksocial.dto.response.QuizAttemptDetailResponse;
import com.vtbn.booksocial.dto.response.QuizAttemptResponse;
import com.vtbn.booksocial.entities.Question;
import com.vtbn.booksocial.entities.Quiz;
import com.vtbn.booksocial.entities.QuizAttempt;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.entities.UserAnswer;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.QuizAttemptMapper;
import com.vtbn.booksocial.mappers.UserAnswerMapper;
import com.vtbn.booksocial.repositories.*;
import com.vtbn.booksocial.services.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizAttemptServiceImpl implements QuizAttemptService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    private final UserAnswerMapper userAnswerMapper;
    private final QuizAttemptMapper quizAttemptMapper;
    private final UserAnswerRepository userAnswerRepository;
    @Override
    @Transactional
    public QuizAttemptDetailResponse submitQuiz(Authentication authentication, int quizId, QuizAttemptRequest request) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Quiz quiz = quizRepository.findById(quizId);
        if (quiz == null) {
            throw new AppException(ErrorCode.QUIZ_NOT_FOUND);
        }

        List<Question> questions = questionRepository.findByQuizId(quizId);

        if (questions == null || questions.isEmpty()) {
            throw new AppException(ErrorCode.QUIZ_HAS_NO_QUESTIONS);
        }

        if (request == null || request.getUserAnswerRequests() == null || request.getUserAnswerRequests().isEmpty()) {
            throw new AppException(ErrorCode.ANSWER_REQUIRED);
        }
        List<UserAnswerRequest> answerRequests = request.getUserAnswerRequests();
        if (answerRequests.size() != questions.size()) {
            throw new AppException(ErrorCode.ANSWER_NOT_COMPLETE);
        }
        long distinctQuestionCount = answerRequests.stream()
                .map(UserAnswerRequest::getQuestionId)
                .distinct()
                .count();

        if (distinctQuestionCount != answerRequests.size()) {
            throw new AppException(ErrorCode.DUPLICATE_QUESTION);
        }
        List<UserAnswer> userAnswers = new ArrayList<>();
        int score = 0;

        for (UserAnswerRequest answerRequest : answerRequests) {
            String selectedAnswer = answerRequest.getSelectedAnswer();

            if (selectedAnswer == null || selectedAnswer.isBlank()) {
                throw new AppException(ErrorCode.ANSWER_REQUIRED);
            }

            selectedAnswer = selectedAnswer.trim().toUpperCase();
            if (!selectedAnswer.matches("[ABCD]")) {
                throw new AppException(ErrorCode.INVALID_ANSWER);
            }
            Question question = questions.stream()
                    .filter(q -> q.getId() == answerRequest.getQuestionId())
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_IN_QUIZ));

            boolean correct = question.getCorrectAnswer().equalsIgnoreCase(selectedAnswer);

            if (correct) {
                score++;
            }

            UserAnswer userAnswer = userAnswerMapper.toUserAnswer(selectedAnswer, question, correct);
            userAnswers.add(userAnswer);
        }
        QuizAttempt quizAttempt =
                quizAttemptMapper.toQuizAttempt(
                        quiz,
                        user,
                        score,
                        userAnswers
                );
        for (UserAnswer userAnswer : userAnswers) {
            userAnswer.setQuizAttempt(quizAttempt);
        }
        QuizAttempt savedAttempt = quizAttemptRepository.save(quizAttempt);
        userAnswerRepository.saveAll(userAnswers);
        return quizAttemptMapper.toQuizAttemptDetailResponse(savedAttempt);
    }

    @Override
    public QuizAttemptDetailResponse getAttemptDetail(Authentication authentication, int attemptId) {
        QuizAttempt quizAttempt = quizAttemptRepository.findById(attemptId);
        if(quizAttempt == null)
            throw new AppException(ErrorCode.QUIZ_ATTEMPT_NOT_FOUND);
        User user = userRepository.findByUsername(authentication.getName());

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        if (quizAttempt.getUser().getId() != user.getId()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return quizAttemptMapper.toQuizAttemptDetailResponse(quizAttempt);
    }

    @Override
    public List<QuizAttemptResponse> getAttempts(Authentication authentication, int quizId) {
        Quiz quiz = quizRepository.findById(quizId);

        if (quiz == null) {
            throw new AppException(ErrorCode.QUIZ_NOT_FOUND);
        }

        User user = userRepository.findByUsername(authentication.getName());

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        List<QuizAttempt> attempts =
                quizAttemptRepository.findByQuizIdAndUserId(
                        quizId,
                        user.getId()
                );
        return attempts.stream()
                .map(quizAttemptMapper::toQuizAttemptResponse)
                .toList();
    }

    @Override
    public Page<QuizAttemptResponse> getMyAttempts(Authentication authentication, Pageable pageable) {
        User user = userRepository.findByUsername(authentication.getName());
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Page<QuizAttempt> attempts = quizAttemptRepository.findByUserId(user.getId(), pageable);
        return attempts.map(quizAttemptMapper::toQuizAttemptResponse);
    }
}
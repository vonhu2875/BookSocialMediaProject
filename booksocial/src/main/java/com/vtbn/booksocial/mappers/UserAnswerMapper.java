package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.response.UserAnswerResponse;
import com.vtbn.booksocial.entities.Question;
import com.vtbn.booksocial.entities.UserAnswer;
import org.springframework.stereotype.Component;

@Component
public class UserAnswerMapper {
    public UserAnswer toUserAnswer(String selectedAnswer, Question question, boolean correct) {
        return UserAnswer.builder()
                .selectedAnswer(selectedAnswer)
                .isCorrect(correct)
                .question(question)
                .build();
    }

    public UserAnswerResponse toUserAnswerResponse(UserAnswer userAnswer) {
        Question question = userAnswer.getQuestion();
        return UserAnswerResponse.builder()
                .questionId(question.getId())
                .selectedAnswer(userAnswer.getSelectedAnswer())
                .correctAnswer(question.getCorrectAnswer())
                .correct(userAnswer.isCorrect())
                .build();
    }
}

package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.response.QuestionAIResponse;
import com.vtbn.booksocial.dto.response.QuestionResponse;
import com.vtbn.booksocial.entities.Question;
import com.vtbn.booksocial.entities.Quiz;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {
    // Question Entity → Response cho người dùng
    public QuestionResponse toQuestionResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .content(question.getContent())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .build();
    }
    // AI Response → Question Entity
    public Question toQuestion(QuestionAIResponse response,Quiz quiz) {
        return Question.builder()
                .content(response.getContent())
                .optionA(response.getOptionA())
                .optionB(response.getOptionB())
                .optionC(response.getOptionC())
                .optionD(response.getOptionD())
                .correctAnswer(response.getCorrectAnswer())
                .quiz(quiz)
                .build();
    }
}

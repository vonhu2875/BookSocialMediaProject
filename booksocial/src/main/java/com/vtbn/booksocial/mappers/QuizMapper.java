package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.response.QuizDetailResponse;
import com.vtbn.booksocial.dto.response.QuizListResponse;
import com.vtbn.booksocial.entities.Chapter;
import com.vtbn.booksocial.entities.Question;
import com.vtbn.booksocial.entities.Quiz;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

//Chuyển QuestionAIResponse -> Question
@Component
@RequiredArgsConstructor
public class QuizMapper {
    private final QuestionMapper questionMapper;

    public Quiz toQuiz(String summary, Chapter chapter){
        return Quiz.builder().summary(summary).chapter(chapter).build();
    }

    public QuizListResponse toQuizListResponse(Quiz quiz) {
        return QuizListResponse.builder().id(quiz.getId()).summary(quiz.getSummary()).build();
    }

    public QuizDetailResponse toQuizDetailResponse(Quiz quiz, List<Question>questions) {
        return QuizDetailResponse.builder().id(quiz.getId()).summary(quiz.getSummary())
                .questions(questions.stream().map(questionMapper::toQuestionResponse).toList())
                .chapterId(quiz.getChapter().getId())
                .chapterTitle(quiz.getChapter().getTitle())
                .bookTitle(quiz.getChapter().getBook().getTitle())
                .build();
    }
}

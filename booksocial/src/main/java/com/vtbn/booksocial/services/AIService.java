package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.response.QuizAIResponse;

public interface AIService {
    String summaryChapter(String content);
    QuizAIResponse generateQuiz(String summary);
    String chatWithChapter(String content, String question);
}

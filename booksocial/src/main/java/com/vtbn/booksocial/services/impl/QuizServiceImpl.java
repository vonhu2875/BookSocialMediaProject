package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.response.QuestionAIResponse;
import com.vtbn.booksocial.dto.response.QuizAIResponse;
import com.vtbn.booksocial.dto.response.QuizDetailResponse;
import com.vtbn.booksocial.dto.response.QuizListResponse;
import com.vtbn.booksocial.entities.Chapter;
import com.vtbn.booksocial.entities.Question;
import com.vtbn.booksocial.entities.Quiz;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.QuestionMapper;
import com.vtbn.booksocial.mappers.QuizMapper;
import com.vtbn.booksocial.repositories.*;
import com.vtbn.booksocial.services.AIService;
import com.vtbn.booksocial.services.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {
    private final ChapterRepository chapterRepository;
    private  final AIService aiService;
    private final QuestionMapper questionMapper;
    private final QuizRepository quizRepository;
    private final QuizMapper quizMapper;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    @Override
    @Transactional
    public QuizDetailResponse generateQuiz(int chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId);
        if (chapter == null) {
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        }
        //Lấy summary
        String summary = chapter.getSummary();
        //Nếu chưa có summary => tự động tạo bằng AI
        if (summary == null || summary.isBlank()) {
            summary = aiService.summaryChapter(chapter.getContent());
            if (summary == null || summary.isBlank()) {
                throw new AppException(ErrorCode.GENERATE_SUMMARY_FAILED);
            }
            // Lưu summary vào Chapter
            chapter.setSummary(summary);
            chapterRepository.save(chapter);
        }
        //Dùng summary để Gemini sinh Quiz
        QuizAIResponse aiResponse = aiService.generateQuiz(summary);

        if (aiResponse == null || aiResponse.getQuestions() == null || aiResponse.getQuestions().isEmpty()) {
            throw new AppException(ErrorCode.GENERATE_QUIZ_FAILED);
        }
        //Tạo quiz
        Quiz quiz = quizMapper.toQuiz(summary, chapter);
        //Lưu Quiz
        quizRepository.save(quiz);

        // Tạo questions
        List<Question> questions = new ArrayList<>();
        for (QuestionAIResponse questionResponse : aiResponse.getQuestions()) {
            Question question = questionMapper.toQuestion(questionResponse, quiz);
            questions.add(question);
        }
        //Lưu toàn bộ Questions
        questionRepository.saveAll(questions);
        //Trả quiz và questions
        return quizMapper.toQuizDetailResponse(quiz, questions);
    }

    @Override
    public QuizDetailResponse getQuiz(int quizId) {
        Quiz quiz = quizRepository.findById(quizId);
        if(quiz == null)
            throw new AppException(ErrorCode.QUIZ_NOT_FOUND);

        List<Question> questions = questionRepository.findByQuizId(quizId);
        return quizMapper.toQuizDetailResponse(quiz, questions);
    }

    @Override
    public QuizDetailResponse startQuiz(Authentication authentication, int chapterId) {
        //Lấy user hiện tại
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        //Kiểm tra chapter
        Chapter chapter = chapterRepository.findById(chapterId);

        if (chapter == null) {
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        }

        //Lấy tất cả quiz của chapter
        List<Quiz> quizzes = quizRepository.findByChapterId(chapterId);

        //Tìm quiz mà user chưa từng làm
        for (Quiz quiz : quizzes) {
            boolean hasAttempted = quizAttemptRepository.existsByQuizIdAndUserId(quiz.getId(),user.getId());

            // User chưa từng làm quiz này
            if (!hasAttempted) {
                List<Question> questions = questionRepository.findByQuizId(quiz.getId());
                return quizMapper.toQuizDetailResponse(quiz,questions);
            }
        }
        //Nếu không còn quiz nào chưa làm tạo một quiz mới bằng AI
        return generateQuiz(chapterId);
    }

    @Override
    public List<QuizListResponse> getQuizzesByChapter(int chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId);
        if(chapter == null)
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        List<Quiz> quizzes = quizRepository.findByChapterId(chapterId);
        return quizzes.stream().map(quizMapper::toQuizListResponse).toList();
    }

    @Override
    @Transactional
    public void deleteQuiz(int quizId) {
        Quiz quiz = quizRepository.findById(quizId);
        if (quiz == null) {
            throw new AppException(ErrorCode.QUIZ_NOT_FOUND);
        }
        boolean hasAttempt = quizAttemptRepository.existsByQuizId(quizId);
        if (hasAttempt) {
            throw new AppException(ErrorCode.QUIZ_ALREADY_ATTEMPTED);
        }
        quizRepository.delete(quiz);
    }
}
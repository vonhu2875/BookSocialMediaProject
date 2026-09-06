package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.ChatTurn;
import com.vtbn.booksocial.dto.request.ChatRequest;
import com.vtbn.booksocial.dto.response.AIChatHistoryResponse;
import com.vtbn.booksocial.dto.response.ChatResponse;
import com.vtbn.booksocial.entities.AIChatHistory;
import com.vtbn.booksocial.entities.Book;
import com.vtbn.booksocial.entities.Chapter;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.AIChatHistoryMapper;
import com.vtbn.booksocial.repositories.AIChatHistoryRepository;
import com.vtbn.booksocial.repositories.BookRepository;
import com.vtbn.booksocial.repositories.ChapterRepository;
import com.vtbn.booksocial.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl {

    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;
    private final BookRepository bookRepository;
    private final AIChatHistoryRepository aiChatHistoryRepository;
    private final AIChatHistoryMapper aiChatHistoryMapper;
    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    private static final String SYSTEM_PROMPT_TEMPLATE = """
            Bạn là trợ lý đọc sách thông minh. Bạn CHỈ được trả lời dựa trên các đoạn trích
            được hệ thống truy xuất và chèn vào ngữ cảnh của tin nhắn bên dưới.

            QUY TẮC BẮT BUỘC:
            - Nếu ngữ cảnh không chứa thông tin liên quan, hãy trả lời: "Nội dung này chưa đề cập đến vấn đề bạn hỏi."
            - Trả lời bằng tiếng Việt, ngắn gọn, đúng trọng tâm.

            LỊCH SỬ HỘI THOẠI GẦN ĐÂY:
            %s
            """;

    @Transactional
    public ChatResponse chatWithChapter(Authentication authentication, int chapterId, ChatRequest request) {
        User user = getCurrentUser(authentication);
        Chapter chapter = chapterRepository.findById(chapterId);
        if (chapter == null)
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);

        List<ChatTurn> history = getRecentHistory(user.getId(), chapterId, null);
        String filterExpression = "chapterId == " + chapterId;

        String answer = askWithRag(request.getQuestion(), history, filterExpression);

        AIChatHistory historyEntity = AIChatHistory.builder()
                .question(request.getQuestion())
                .answer(answer)
                .sourceReference("CHAPTER: " + chapterId)
                .user(user)
                .chapter(chapter)
                .book(chapter.getBook())
                .build();
        aiChatHistoryRepository.save(historyEntity);

        return ChatResponse.builder().question(request.getQuestion()).answer(answer).build();
    }

    @Transactional
    public ChatResponse chatWithBook(Authentication authentication, int bookId, ChatRequest request) {
        User user = getCurrentUser(authentication);
        Book book = bookRepository.findById(bookId);
        if (book == null) throw new AppException(ErrorCode.BOOK_NOT_FOUND);

        List<ChatTurn> history = getRecentHistory(user.getId(), null, bookId);
        // Lọc tất cả chunks thuộc bookId này (xuyên suốt các chương)
        String filterExpression = "bookId == " + bookId;

        String answer = askWithRag(request.getQuestion(), history, filterExpression);

        AIChatHistory historyEntity = AIChatHistory.builder()
                .question(request.getQuestion())
                .answer(answer)
                .sourceReference("BOOK: " + bookId)
                .user(user)
                .chapter(null) // Cấp độ Sách -> Chapter để null
                .book(book)
                .build();
        aiChatHistoryRepository.save(historyEntity);

        return ChatResponse.builder().question(request.getQuestion()).answer(answer).build();
    }

    // ================== LỊCH SỬ CHAT CẤP SÁCH ==================
    public Page<AIChatHistoryResponse> getBookChatHistory(Authentication authentication, int bookId, Pageable pageable) {
        User user = getCurrentUser(authentication);
        Page<AIChatHistory> aiChatHistories = aiChatHistoryRepository
                .findByUserIdAndBookIdAndChapterIsNullOrderByCreatedDateAsc(user.getId(), bookId, pageable);
        return aiChatHistories.map(aiChatHistoryMapper::toChatHistoryResponse);
    }

    @Transactional
    public void deleteBookChatHistory(Authentication authentication, int bookId) {
        User user = getCurrentUser(authentication);
        aiChatHistoryRepository.deleteByUserIdAndBookIdAndChapterIsNull(user.getId(), bookId);
    }

    // ================== HÀM LÕI RAG CHUNG ==================
    private String askWithRag(String question, List<ChatTurn> history, String filterExpression) {
        QuestionAnswerAdvisor qaAdvisor = QuestionAnswerAdvisor.builder(vectorStore)
                .searchRequest(SearchRequest.builder()
                        .topK(5)
                        .similarityThreshold(0.5)
                        .filterExpression(filterExpression)
                        .build())
                .build();

        String systemPrompt = SYSTEM_PROMPT_TEMPLATE.formatted(formatHistory(history));

        String answer = chatClient.prompt()
                .system(systemPrompt)
                .user(question)
                .advisors(qaAdvisor)
                .call()
                .content();

        if (answer == null || answer.isBlank()) {
            throw new AppException(ErrorCode.AI_CHAT_FAILED);
        }
        return answer.trim();
    }

    private User getCurrentUser(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName());
        if (user == null) throw new AppException(ErrorCode.USER_NOT_FOUND);
        return user;
    }

    private List<ChatTurn> getRecentHistory(int userId, Integer chapterId, Integer bookId) {
        List<AIChatHistory> recentDesc = chapterId != null
                ? aiChatHistoryRepository.findTop6ByUserIdAndChapterIdOrderByCreatedDateDesc(userId, chapterId)
                : aiChatHistoryRepository.findTop6ByUserIdAndBookIdAndChapterIsNullOrderByCreatedDateDesc(userId, bookId);

        if (recentDesc.isEmpty())
            return Collections.emptyList();
        return recentDesc.reversed().stream()
                .map(h -> new ChatTurn(h.getQuestion(), h.getAnswer()))
                .toList();
    }

    private String formatHistory(List<ChatTurn> history) {
        if (history == null || history.isEmpty()) return "(Chưa có lịch sử)";
        StringBuilder sb = new StringBuilder();
        for (ChatTurn turn : history) {
            sb.append("Người dùng: ").append(turn.question()).append("\n");
            sb.append("Trợ lý: ").append(turn.answer()).append("\n");
        }
        return sb.toString();
    }
}
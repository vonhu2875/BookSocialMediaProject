package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.ChatRequest;
import com.vtbn.booksocial.dto.response.AIChatHistoryResponse;
import com.vtbn.booksocial.dto.response.ChatResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

public interface ChatService {
    //Chapter
    ChatResponse chatWithChapter(Authentication authentication, int chapterId, ChatRequest request);
    Page<AIChatHistoryResponse> getChatHistory(Authentication authentication, int chapterId, Pageable pageable);
    void deleteChatHistory(Authentication authentication, int chapterId);
    //Book
    ChatResponse chatWithBook(Authentication authentication, int bookId, ChatRequest request);
    Page<AIChatHistoryResponse> getBookChatHistory(Authentication authentication, int bookId, Pageable pageable);
    void deleteBookChatHistory(Authentication authentication, int bookId);

}

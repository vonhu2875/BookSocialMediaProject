package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.response.AIChatHistoryResponse;
import com.vtbn.booksocial.entities.AIChatHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AIChatHistoryMapper {
    public AIChatHistoryResponse toChatHistoryResponse(AIChatHistory aiChatHistory) {
        return AIChatHistoryResponse.builder()
                .id(aiChatHistory.getId())
                .answer(aiChatHistory.getAnswer())
                .question(aiChatHistory.getQuestion())
                .sourceReference(aiChatHistory.getSourceReference())
                .createdDate(aiChatHistory.getCreatedDate())
                .build();
    }
}

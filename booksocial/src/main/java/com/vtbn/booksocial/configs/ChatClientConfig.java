package com.vtbn.booksocial.configs;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//Spring AI sử dụng ChatClient như một Fluent API để tương tác với Gemini và chèn các Advisor RAG tự động.
@Configuration
public class ChatClientConfig {
    @Bean
    public ChatClient chatClient(ChatClient.Builder chatClientBuilder) {
        return chatClientBuilder.build();
    }
}

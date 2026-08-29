package com.vtbn.booksocial.services.impl;


import com.vtbn.booksocial.dto.response.QuizAIResponse;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.services.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.converter.BeanOutputConverter;
//import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiAIServiceImpl implements AIService {
    private final ChatModel chatModel;
//    private final EmbeddingModel embeddingModel;
    @Override
    public String summaryChapter(String content) {
        String prompt = """
                Hãy tóm tắt nội dung chương sách dưới đây.

                Yêu cầu:
                - Tóm tắt bằng tiếng Việt.
                - Giữ lại các ý chính và kiến thức quan trọng.
                - Không tự thêm thông tin không có trong nội dung.
                - Trình bày rõ ràng, dễ đọc.
                - Không cần mở đầu bằng các câu như "Dưới đây là bản tóm tắt".

                Nội dung chương:
                %s
                """.formatted(content);
        return chatModel.call(prompt);
    }

    @Override
    public QuizAIResponse generateQuiz(String summary) {
        BeanOutputConverter<QuizAIResponse> converter = new BeanOutputConverter<>(QuizAIResponse.class);

        String prompt = """
            Bạn là một hệ thống tạo câu hỏi trắc nghiệm để giúp người dùng
            ôn tập nội dung chương sách.

            Hãy dựa hoàn toàn vào nội dung tóm tắt được cung cấp bên dưới.

            Yêu cầu:
            - Tạo 10 câu hỏi trắc nghiệm.
            - Mỗi câu hỏi có đúng 4 đáp án: A, B, C, D.
            - Chỉ có một đáp án đúng.
            - correctAnswer chỉ được phép là A, B, C hoặc D.
            - Câu hỏi phải dựa trên nội dung được cung cấp.
            - Không được tự thêm kiến thức không có trong nội dung.
            - Câu hỏi và đáp án phải bằng tiếng Việt.
            - Không lặp lại câu hỏi.

            Nội dung tóm tắt chương:
            %s

            %s
            """.formatted(summary, converter.getFormat());

        String response = chatModel.call(prompt);
        if (response == null || response.isBlank()) {
            throw new AppException(ErrorCode.GENERATE_QUIZ_FAILED);
        }

        return converter.convert(response);
    }

    @Override
    public String chatWithChapter(String content, String question) {
        String prompt = """
            Bạn là trợ lý AI hỗ trợ người dùng tìm hiểu nội dung chương sách.

            Hãy trả lời câu hỏi dựa hoàn toàn vào nội dung chương được cung cấp.

            Yêu cầu:
            - Trả lời bằng tiếng Việt.
            - Chỉ sử dụng thông tin có trong nội dung chương.
            - Không tự thêm thông tin không có trong nội dung.
            - Nếu nội dung chương không đủ thông tin để trả lời,
              hãy nói rõ rằng nội dung chương không cung cấp thông tin này.
            - Trả lời rõ ràng, dễ hiểu và đúng trọng tâm.

            Nội dung chương:
            %s

            Câu hỏi của người dùng:
            %s
            """.formatted(content, question);

        String response = chatModel.call(prompt);

        if (response == null || response.isBlank()) {
            throw new AppException(ErrorCode.AI_CHAT_FAILED);
        }
        return response;
    }
}

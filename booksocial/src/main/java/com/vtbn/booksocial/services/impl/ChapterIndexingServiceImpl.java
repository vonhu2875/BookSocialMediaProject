package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.entities.Chapter;
import com.vtbn.booksocial.services.ChapterIndexingService;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChapterIndexingServiceImpl implements ChapterIndexingService {
    private final VectorStore vectorStore;
    // Tự động cắt văn bản thành các chunk nhỏ vừa vặn với context window
    // Sửa dòng bị lỗi thành:
    //800 (chunkSize): Kích thước tối đa mỗi đoạn chunk (tính theo số Token).
    //
    //350 (minChunkSizeChars): Độ dài tối thiểu tính theo ký tự để không bị cắt vụn văn bản.
    //
    //5 (minChunkLengthToEmbed): Số lượng từ tối thiểu của chunk để tiến hành tạo Vector Embedding.
    //
    //1000 (maxNumChunks): Số lượng chunk tối đa tạo ra từ 1 tài liệu.
    private final TokenTextSplitter splitter = TokenTextSplitter.builder()
            .withChunkSize(800)
            .withMinChunkSizeChars(350)
            .withMinChunkLengthToEmbed(5)
            .withMaxNumChunks(1000)
            .build();
    @Override
    public void indexChapter(Chapter chapter) {
        // Xóa vector cũ của chương này trước để tránh trùng lặp khi tác giả cập nhật
        removeChapterIndex(chapter.getId());
        if (chapter.getContent() == null || chapter.getContent().isBlank()) {
            return;
        }
        Document sourceDocument = new Document(chapter.getContent(), buildMetadata(chapter));
        List<Document> chunks = splitter.apply(List.of(sourceDocument));
        vectorStore.accept(chunks);
        log.info("Đã index chương id={} thành {} chunks vào Vector Store", chapter.getId(), chunks.size());
    }

    @Override
    public void removeChapterIndex(int chapterId) {
        vectorStore.delete("chapterId == " + chapterId);
    }

    private Map<String, Object> buildMetadata(Chapter chapter) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("chapterId", chapter.getId());
        metadata.put("bookId", chapter.getBook().getId());
        metadata.put("chapterNumber", chapter.getChapterNumber());
        metadata.put("chapterTitle", chapter.getTitle());
        metadata.put("bookTitle", chapter.getBook().getTitle());
        return metadata;
    }
}

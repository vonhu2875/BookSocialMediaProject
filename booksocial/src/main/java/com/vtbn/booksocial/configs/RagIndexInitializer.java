package com.vtbn.booksocial.configs;

import com.vtbn.booksocial.entities.Chapter;
import com.vtbn.booksocial.repositories.ChapterRepository;
import com.vtbn.booksocial.services.ChapterIndexingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

//Những chương sách đã có sẵn trong CSDL PostgreSQL từ trước sẽ chưa có Vector Embedding. Component này sẽ chạy 1 lần duy nhất khi khởi động ứng dụng để quét và index toàn bộ dữ liệu cũ.
@Component
@RequiredArgsConstructor
@Slf4j

public class RagIndexInitializer {
    private final ChapterRepository chapterRepository;
    private final ChapterIndexingService chapterIndexingService;
    private final JdbcTemplate jdbcTemplate;
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void reindexIfEmpty() {
        Integer existingChunks = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM vector_store", Integer.class);

        if (existingChunks != null && existingChunks > 0) {
            log.info("Vector Store đã có {} chunks. Bỏ qua re-index.", existingChunks);
            return;
        }

        List<Chapter> chapters = chapterRepository.findAll();
        log.info("Bắt đầu index lại {} chương vào Vector Store...", chapters.size());

        for (Chapter chapter : chapters) {
            try {
                chapterIndexingService.indexChapter(chapter);
            } catch (Exception e) {
                log.error("Lỗi index chương id={}: {}", chapter.getId(), e.getMessage());
            }
        }
    }
}

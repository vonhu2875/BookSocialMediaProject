package com.vtbn.booksocial.services;

import com.vtbn.booksocial.entities.Chapter;

//mỗi khi 1 chương được tạo/sửa, ta chunk nội dung và ghi vào VectorStore.
public interface ChapterIndexingService {
    // Xoá index cũ (nếu có) rồi chunk + ghi lại nội dung mới nhất của chương vào Vector Store
    void indexChapter(Chapter chapter);
    // Xoá toàn bộ chunk thuộc 1 chương khỏi Vector Store (dùng khi xoá chương)
    void removeChapterIndex(int chapterId);
}

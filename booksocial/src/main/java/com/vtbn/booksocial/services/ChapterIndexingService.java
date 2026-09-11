package com.vtbn.booksocial.services;

import com.vtbn.booksocial.entities.Chapter;

public interface ChapterIndexingService {
    void indexChapter(Chapter chapter);
    void removeChapterIndex(int chapterId);
}

package com.vtbn.booksocial.services;

import org.springframework.web.multipart.MultipartFile;

public interface ChapterFileService {
    String extractText(MultipartFile file);
}

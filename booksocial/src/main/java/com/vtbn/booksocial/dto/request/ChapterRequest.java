package com.vtbn.booksocial.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterRequest {
    @Min(value = 1, message = "CHAPTER_NUMBER_INVALID")
    private int chapterNumber;
    @NotBlank(message = "CHAPTER_TITLE_REQUIRED")
    private String title;
//    private String content;
    private MultipartFile file;
}

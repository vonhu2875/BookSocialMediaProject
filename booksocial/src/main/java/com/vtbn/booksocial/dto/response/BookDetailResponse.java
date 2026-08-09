package com.vtbn.booksocial.dto.response;

import com.vtbn.booksocial.enums.BookLanguage;
import com.vtbn.booksocial.enums.BookStatus;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDetailResponse {
    private int id;
    private String title;
    private String description;
    private String coverImage;
    private BookLanguage language;
    private int totalChapters;
    private int viewCount;
    private BookStatus status;
    private int authorId;
    private String authorUsername;
    private List<CategoryResponse> categories;
    private Instant approvedAt;
    private Instant createdDate;
    private Instant updatedDate;
}

package com.vtbn.booksocial.dto.response;

import com.vtbn.booksocial.enums.BookLanguage;
import com.vtbn.booksocial.enums.BookStatus;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookListResponse {
    private int id;
    private String title;
    private String coverImage;
    private BookLanguage language;
    private int viewCount;
    private int authorId;
    private String authorUsername;
    private List<CategoryResponse> categories;
}

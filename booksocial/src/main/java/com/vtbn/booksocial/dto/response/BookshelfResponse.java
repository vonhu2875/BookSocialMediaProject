package com.vtbn.booksocial.dto.response;

import com.vtbn.booksocial.enums.BookshelfStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookshelfResponse {
    private int id;
    private int bookId;
    private String title;
    private String coverImage;
    private BookshelfStatus status;
    private boolean favorite;
    private Integer lastReadChapterId;
}

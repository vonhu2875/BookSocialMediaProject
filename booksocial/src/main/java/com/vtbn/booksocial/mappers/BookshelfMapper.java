package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.response.BookshelfResponse;
import com.vtbn.booksocial.entities.Bookshelf;
import org.springframework.stereotype.Component;

@Component
public class BookshelfMapper {
    public BookshelfResponse toBookshelfResponse(Bookshelf bookshelf) {
        return BookshelfResponse.builder()
                .id(bookshelf.getId())
                .bookId(bookshelf.getBook().getId())
                .title(bookshelf.getBook().getTitle())
                .coverImage(bookshelf.getBook().getCoverImage())
                .status(bookshelf.getStatus())
                .favorite(bookshelf.isFavorite())
                .lastReadChapterId(
                        bookshelf.getLastReadChapter() != null
                                ? bookshelf.getLastReadChapter().getId()
                                : null
                )
                .build();
    }
}

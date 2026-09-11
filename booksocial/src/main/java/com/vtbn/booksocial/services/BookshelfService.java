package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.ReadingProgressRequest;
import com.vtbn.booksocial.dto.response.BookshelfResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface BookshelfService {
    BookshelfResponse addToBookshelf(Authentication authentication, int bookId);
    void deleteBookshelf(Authentication authentication, int bookId);
    List<BookshelfResponse> getMyBookshelf(Authentication authentication);
    void updateReadingProgress(Authentication authentication, int bookId, ReadingProgressRequest request);
    void addBookFavorite(Authentication authentication, int bookId);
    List<BookshelfResponse> getMyFavoriteBookshelf(Authentication authentication);
}

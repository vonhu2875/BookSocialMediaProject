package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.BookRequest;
import com.vtbn.booksocial.dto.response.BookDetailResponse;
import com.vtbn.booksocial.dto.response.BookListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface BookService {
    BookListResponse createBook(Authentication authentication, BookRequest request);
    Page<BookListResponse> getBooks(List<Integer> categoryIds, int authorId, String keyword, Pageable pageable);
    BookDetailResponse getBook(int id);
    BookDetailResponse updateBook(Authentication authentication, int id, BookRequest request);
    void deleteBook(Authentication authentication, int id);
    Page<BookListResponse> getMyBooks(Authentication authentication,Pageable pageable);
    Page<BookListResponse> getPendingBooks(Pageable pageable);
    void approveBook(int id);
    void rejectBook(int id);
    void increaseViewCount(int id);
}

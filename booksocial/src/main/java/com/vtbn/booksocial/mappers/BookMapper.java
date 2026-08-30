package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.request.BookRequest;
import com.vtbn.booksocial.dto.response.BookDetailResponse;
import com.vtbn.booksocial.dto.response.BookListResponse;
import com.vtbn.booksocial.entities.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookMapper {
    private final CategoryMapper categoryMapper;
    public Book toBook(BookRequest request) {

        if (request == null) {
            return null;
        }

        return Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .language(request.getLanguage())
                .build();
    }

    public BookDetailResponse toBookDetailResponse(Book book) {

        if (book == null) {
            return null;
        }

        return BookDetailResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .description(book.getDescription())
                .coverImage(book.getCoverImage())
                .language(book.getLanguage())
                .totalChapters(book.getTotalChapters())
                .viewCount(book.getViewCount())
                .status(book.getStatus())
                .authorId(book.getAuthor().getId())
                .authorUsername(book.getAuthor().getUsername())
                .categories(
                        book.getCategories()
                                .stream()
                                .map(categoryMapper::toCategoryResponse)
                                .toList()
                )
                .approvedAt(book.getApprovedAt())
                .createdDate(book.getCreatedDate())
                .updatedDate(book.getUpdatedDate())
                .build();
    }

    public BookListResponse toBookListResponse(Book book) {

        if (book == null) {
            return null;
        }

        return BookListResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .coverImage(book.getCoverImage())
                .language(book.getLanguage())
                .viewCount(book.getViewCount())
                .authorId(book.getAuthor().getId())
                .status(book.getStatus())
                .authorUsername(book.getAuthor().getUsername())
                .categories(
                        book.getCategories()
                                .stream()
                                .map(categoryMapper::toCategoryResponse)
                                .toList()
                )
                .totalChapters(book.getTotalChapters())
                .build();
    }
}

package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.BookRequest;
import com.vtbn.booksocial.dto.request.ChapterRequest;
import com.vtbn.booksocial.dto.response.*;
import com.vtbn.booksocial.services.BookService;
import com.vtbn.booksocial.services.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/books"))
public class BookController {
    private final BookService bookService;
    private final ChapterService chapterService;

    @PostMapping
    public ApiResponse<BookListResponse> createBook(Authentication authentication, @ModelAttribute BookRequest request) {
        BookListResponse bookListResponse = bookService.createBook(authentication, request);
        return ApiResponse.<BookListResponse>builder().result(bookListResponse).build();
    }

    @GetMapping
    public ApiResponse<Page<BookListResponse>> getBooks(@RequestParam(required = false)List<Integer> categoryIds,
                                                        @RequestParam(required = false, defaultValue = "0") int authorId,
                                                        @RequestParam(required = false) String keyword,
                                                        Pageable pageable) {
        Page<BookListResponse> bookResponses= bookService.getBooks(categoryIds, authorId, keyword, pageable);
        return ApiResponse.<Page<BookListResponse>>builder().result(bookResponses).build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BookDetailResponse> getBook(@PathVariable int id) {
        BookDetailResponse bookDetailResponse = bookService.getBook(id);
        return ApiResponse.<BookDetailResponse>builder().result(bookDetailResponse).build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BookDetailResponse> updateBook(Authentication authentication,@PathVariable int id,@ModelAttribute BookRequest request) {
        BookDetailResponse bookDetailResponse = bookService.updateBook(authentication,id,request);
        return ApiResponse.<BookDetailResponse>builder().result(bookDetailResponse).build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBook(Authentication authentication, @PathVariable int id) {
        bookService.deleteBook(authentication, id);
        return ApiResponse.<Void>builder().message("Delete book success").build();
    }

    @GetMapping("/pending")
    public ApiResponse<Page<BookListResponse>> getPendingBooks(Pageable pageable) {
        Page<BookListResponse> books = bookService.getPendingBooks(pageable);
        return ApiResponse.<Page<BookListResponse>>builder().result(books).build();
    }

    @PutMapping("/{id}/approve")
    public ApiResponse<Void> approveBook(@PathVariable int id) {
        bookService.approveBook(id);
        return ApiResponse.<Void>builder().message("Approved book success").build();
    }
    @PutMapping("/{id}/reject")
    public ApiResponse<Void> rejectBook(@PathVariable int id) {
        bookService.rejectBook(id);
        return ApiResponse.<Void>builder().message("Rejected book success").build();
    }

    //CHAPTER
    @PostMapping("/{bookId}/chapters")
    public ApiResponse<ChapterDetailResponse> createChapter(Authentication authentication, @PathVariable int bookId, @ModelAttribute ChapterRequest request){
        ChapterDetailResponse chapterDetailResponse = chapterService.createChapter(authentication, bookId, request);
        return ApiResponse.<ChapterDetailResponse>builder().result(chapterDetailResponse).build();
    }

    @GetMapping("/{bookId}/chapters")
    public ApiResponse<Page<ChapterListResponse>> getChapters(@PathVariable int bookId, Pageable pageable){
            Page<ChapterListResponse> chapterListResponses = chapterService.getChapters(bookId, pageable);
            return ApiResponse.<Page<ChapterListResponse>>builder().result(chapterListResponses).build();
    }





}

package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.*;
import com.vtbn.booksocial.dto.response.*;
import com.vtbn.booksocial.services.BookService;
import com.vtbn.booksocial.services.BookshelfService;
import com.vtbn.booksocial.services.ChapterService;
import com.vtbn.booksocial.services.RatingService;
import com.vtbn.booksocial.services.impl.ChatServiceImpl;
import jakarta.validation.Valid;
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
    private final RatingService ratingService;
    private final BookshelfService bookshelfService;
    private final ChatServiceImpl chatService;
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
    @GetMapping("/pending")
    public ApiResponse<Page<BookListResponse>> getPendingBooks(Pageable pageable) {
        Page<BookListResponse> books = bookService.getPendingBooks(pageable);
        return ApiResponse.<Page<BookListResponse>>builder().result(books).build();
    }

    @GetMapping("/rejecting")
    public ApiResponse<Page<BookListResponse>> getRejectingBooks(Pageable pageable) {
        Page<BookListResponse> books = bookService.getRejectingBooks(pageable);
        return ApiResponse.<Page<BookListResponse>>builder().result(books).build();
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

    //RATING
    @PostMapping("/{bookId}/ratings")
    public ApiResponse<RatingDetailResponse> createRating(Authentication authentication,@PathVariable int bookId,@Valid @RequestBody RatingRequest request) {
        RatingDetailResponse ratingDetailResponse = ratingService.createRating(authentication,bookId,request);
        return ApiResponse.<RatingDetailResponse>builder().result(ratingDetailResponse).build();
    }
    @GetMapping("/{bookId}/ratings")
    public ApiResponse<List<RatingListResponse>> getRatingsByBook(@PathVariable int bookId) {
        List<RatingListResponse> ratingListResponses = ratingService.getRatingsByBook(bookId);
        return ApiResponse.<List<RatingListResponse>>builder().result(ratingListResponses).build();
    }
    @GetMapping("/{bookId}/ratings/myself")
    public ApiResponse<RatingDetailResponse> getMyRating(Authentication authentication,@PathVariable int bookId) {
        RatingDetailResponse ratingDetailResponse = ratingService.getMyRating(authentication,bookId);
        return ApiResponse.<RatingDetailResponse>builder().result(ratingDetailResponse).build();
    }
    @GetMapping("/{bookId}/ratings/summary")
    public ApiResponse<RatingSummaryResponse> getRatingSummary(@PathVariable int bookId) {
        RatingSummaryResponse ratingSummaryResponse = ratingService.getRatingSummary(bookId);
        return ApiResponse.<RatingSummaryResponse>builder().result(ratingSummaryResponse).build();
    }

    //Bookshelf
    @PostMapping("/{bookId}/bookshelfs")
    public ApiResponse<BookshelfResponse> addToBookshelf(Authentication authentication,@PathVariable int bookId) {
        BookshelfResponse response =
                bookshelfService.addToBookshelf(
                        authentication,
                        bookId
                );

        return ApiResponse.<BookshelfResponse>builder()
                .result(response)
                .build();
    }

    @DeleteMapping("/{bookId}/bookshelfs")
    public ApiResponse<Void> removeFromBookshelf(
            Authentication authentication,
            @PathVariable int bookId
    ) {

        bookshelfService.deleteBookshelf(
                authentication,
                bookId
        );

        return ApiResponse.<Void>builder()
                .message("delete bookshelf success")
                .build();
    }

    @PutMapping("/{bookId}/bookshelfs/progress")
    public ApiResponse<Void> updateReadingProgress(Authentication authentication,@PathVariable int bookId,@RequestBody ReadingProgressRequest request) {
        bookshelfService.updateReadingProgress(authentication,bookId,request);

        return ApiResponse.<Void>builder()
                .message("Update reading progress success")
                .build();
    }

    @PostMapping("/{id}/view")
    public ApiResponse<Void> increaseViewCount(@PathVariable int id) {
        bookService.increaseViewCount(id);
        return ApiResponse.<Void>builder()
                .message("View count increased")
                .build();
    }

    //Chatbot book
    @PostMapping("/{bookId}/chat")
    public ApiResponse<ChatResponse> chatWithBook(Authentication authentication,@PathVariable int bookId,@Valid @RequestBody ChatRequest chatRequest) {
        ChatResponse chatResponse = chatService.chatWithBook(authentication, bookId, chatRequest);
        return ApiResponse.<ChatResponse>builder().result(chatResponse).build();
    }

    @GetMapping("/{bookId}/chat/history")
    public ApiResponse<Page<AIChatHistoryResponse>> getAIChatHistory(Authentication authentication, @PathVariable int bookId, Pageable pageable) {
        Page<AIChatHistoryResponse> aiChatHistoryResponses = chatService.getBookChatHistory(authentication, bookId, pageable);
        return ApiResponse.<Page<AIChatHistoryResponse>>builder().result(aiChatHistoryResponses).build();
    }

    @DeleteMapping("/{bookId}/chat/history")
    public ApiResponse<Void> deleteAIChatHistory(Authentication authentication, @PathVariable int bookId) {
        chatService.deleteBookChatHistory(authentication, bookId);
        return ApiResponse.<Void>builder().message("delete ai chat history success").build();
    }
}
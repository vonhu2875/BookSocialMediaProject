package com.vtbn.booksocial.controllers;

import com.cloudinary.Api;
import com.vtbn.booksocial.dto.request.ChangePasswordRequest;
import com.vtbn.booksocial.dto.request.UpdateProfileRequest;
import com.vtbn.booksocial.dto.response.*;
import com.vtbn.booksocial.services.BookService;
import com.vtbn.booksocial.services.BookshelfService;
import com.vtbn.booksocial.services.QuizAttemptService;
import com.vtbn.booksocial.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final BookService bookService;
    private final BookshelfService bookshelfService;
    private final QuizAttemptService quizAttemptService;
    @GetMapping("/my-info")
    public ApiResponse<UserResponse> getMyInfo(Authentication authentication) {
        var result = userService.getInfoUser(authentication.getName());
        return ApiResponse.<UserResponse>builder().result(result).build();
    }

    @PutMapping("/my-info")
    public ApiResponse<UserResponse> updateMyInfo(Authentication authentication, @ModelAttribute UpdateProfileRequest request) {
        var result = userService.updateInfoUser(authentication.getName(), request);
        return ApiResponse.<UserResponse>builder().message("update success").result(result).build();
    }

    @PutMapping("/change-password")
    public ApiResponse<Void> changePassword(Authentication authentication, @RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(authentication.getName(), request);
        return ApiResponse.<Void>builder().message("change password success").build();
    }

    @GetMapping
    public ApiResponse<Page<UserResponse>> getAllUsers(Pageable pageable) {
        var result = userService.getAllUser(pageable);
        return ApiResponse.<Page<UserResponse>>builder().result(result).build();
    }

    @PutMapping("/{userId}/change-status")
    public ApiResponse<Void> changeStatusUser(Authentication authentication, @PathVariable int userId) {
        userService.changeStatusUser(authentication, userId);
        return ApiResponse.<Void>builder().message("Change status user success").build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(Authentication authentication,@PathVariable int id) {
        userService.deleteUser(authentication, id);
        return ApiResponse.<Void>builder().message("delete user success").build();
    }

    @GetMapping("/books")
    public ApiResponse<Page<BookDetailResponse>> getMyBooks(Authentication authentication, Pageable pageable) {
        Page<BookDetailResponse> bookDetailResponses = bookService.getMyBooks(authentication, pageable);
        return ApiResponse.<Page<BookDetailResponse>>builder().result(bookDetailResponses).build();
    }

    //Bookshelf
    @GetMapping("/bookshelfs")
    public ApiResponse<List<BookshelfResponse>> getMyBookshelf(
            Authentication authentication
    ) {
        List<BookshelfResponse> response =
                bookshelfService.getMyBookshelf(authentication);

        return ApiResponse.<List<BookshelfResponse>>builder()
                .result(response)
                .build();
    }
    //lấy danh sách những sách yêu thích
    @GetMapping("/bookshelfs/favorite")
    public ApiResponse<List<BookshelfResponse>> getMyFavoriteBook(Authentication authentication) {
        List<BookshelfResponse> bookshelfResponses = bookshelfService.getMyFavoriteBookshelf(authentication);
        return ApiResponse.<List<BookshelfResponse>>builder().result(bookshelfResponses).build();
    }
    //Attempt quiz
    @GetMapping("/my-attempts")
    public ApiResponse<Page<QuizAttemptResponse>> getMyAttempts(
            Authentication authentication, Pageable pageable) {

        Page<QuizAttemptResponse> response =
                quizAttemptService.getMyAttempts(authentication, pageable);

        return ApiResponse.<Page<QuizAttemptResponse>>builder()
                .result(response)
                .build();
    }


}
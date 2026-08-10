package com.vtbn.booksocial.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_ALREADY_EXISTS(
            1001,
            "User already exists",
            HttpStatus.BAD_REQUEST
    ),

    EMAIL_ALREADY_EXISTS(
            1002,
            "Email already exists",
            HttpStatus.BAD_REQUEST
    ),

    USER_NOT_FOUND(
            1003,
            "User not found",
            HttpStatus.NOT_FOUND
    ),

    INVALID_PASSWORD(
            1004,
            "Invalid password",
            HttpStatus.BAD_REQUEST
    ),

    UNAUTHENTICATED(
            1005,
            "Unauthenticated",
            HttpStatus.UNAUTHORIZED
    ),

    ACCESS_DENIED(
            1006,
            "Access denied",
            HttpStatus.FORBIDDEN
    ),

    INVALID_TOKEN(
            1007,
            "Invalid token",
            HttpStatus.UNAUTHORIZED
    ),

    TOKEN_EXPIRED(
            1008,
            "Token expired",
            HttpStatus.UNAUTHORIZED
    ),
    VALIDATION_FAILED(
            1009,
            "Validation failed",
            HttpStatus.BAD_REQUEST
    ),
    AVATAR_UPLOAD_ERROR(
            1010,
            "Upload avatar error",
            HttpStatus.NOT_ACCEPTABLE
    ),
    OLD_PASSWORD_INCORRECT(1011, "Mật khẩu cũ không chính xác", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID_SIZE(1012, "Mật khẩu phải chứa ít nhất 6 ký tự", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_REQUIRED(1013, "Vui lòng nhập mật khẩu cũ", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_REQUIRED(1014, "Vui lòng nhập mật khẩu mới", HttpStatus.BAD_REQUEST),
    CATEGORY_ALREADY_EXISTS(1015, "Danh mục đã tồn tại", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(1016, "Categoory not found",HttpStatus.NOT_FOUND),
    BOOK_NOT_FOUND(
            1017,
            "Book not found",
            HttpStatus.NOT_FOUND
    ),
    INVALID_BOOK_STATUS(1018, "Book status invalid", HttpStatus.BAD_REQUEST),
    CHAPTER_NUMBER_INVALID(1019, "Chapter number invalid", HttpStatus.BAD_REQUEST),
    CHAPTER_ALREADY_EXISTS(1020, "Chapter already exists", HttpStatus.BAD_REQUEST),
    CHAPTER_NOT_FOUND(1021,"Chapter not found", HttpStatus.NOT_FOUND),
    CHAPTER_FILE_REQUIRED(1022, "Chapter file required", HttpStatus.BAD_REQUEST),
    INVALID_CHAPTER_FILE(1023, "Invalid chapter file", HttpStatus.BAD_REQUEST),
    CHAPTER_FILE_READ_FAILED(1024, "chapter file read failed", HttpStatus.BAD_REQUEST),
    CHAPTER_CONTENT_EMPTY(1025, "Chapter content empty", HttpStatus.BAD_REQUEST),
    FILE_DELETE_ERROR(1026, "File delete error", HttpStatus.BAD_REQUEST),
    BOOK_ALREADY_EXISTS(1027, "Tiêu đề sách đã tồn tại", HttpStatus.BAD_REQUEST),
    UPLOAD_FILE_ERROR(1028,"Upload file error",HttpStatus.INTERNAL_SERVER_ERROR),
    COMMENT_NOT_FOUND(1029, "Comment not found", HttpStatus.NOT_FOUND),
    COMMENT_REPLY_NOT_ALLOWED(1030,"Cannot reply to a reply",HttpStatus.BAD_REQUEST),
    RATING_ALREADY_EXISTS(1031,"Rating already exists",HttpStatus.BAD_REQUEST),
    RATING_NOT_FOUND(1032,"Rating not found",HttpStatus.NOT_FOUND),
    STAR_INVALID(1031,"Số sao phải từ 1 đến 5",HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }


    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
